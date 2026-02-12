import { analyzeRedditPosts } from "./clients/reddit.js";
import { analyzeTwitterPosts } from "./clients/twitter.js";
import { summarize } from "./analysis/summarize.js";
import { resolveAsset } from "./types/financial.js";
import type { AssetTarget } from "./types/financial.js";
import type { AnalyzedPost, SentimentSummary } from "./types/sentiment.js";

// ---- CLI args ----

const args = process.argv.slice(2);

function getFlag(name: string): string | undefined {
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split("=")[1];
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : undefined;
}

const assetInput = getFlag("asset") ?? getFlag("ticker") ?? getFlag("symbol") ?? args.find((a) => !a.startsWith("--")) ?? "SPY";
const sourceFlag = getFlag("source") ?? getFlag("platform");
const asset = resolveAsset(assetInput);

// ---- Formatting ----

const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m",
  blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m", white: "\x1b[37m",
};

const SIGNAL_DISPLAY: Record<string, string> = {
  strong_buy:  `${C.green}${C.bold}STRONG BUY${C.reset}`,
  buy:         `${C.green}BUY${C.reset}`,
  hold:        `${C.yellow}HOLD${C.reset}`,
  sell:        `${C.red}SELL${C.reset}`,
  strong_sell: `${C.red}${C.bold}STRONG SELL${C.reset}`,
};

function scoreColor(score: number): string {
  if (score <= -0.5) return C.red;
  if (score <= -0.15) return `${C.red}${C.dim}`;
  if (score < 0.15) return C.yellow;
  if (score < 0.5) return `${C.green}${C.dim}`;
  return C.green;
}

function labelDisplay(label: string): string {
  return label.replace("very_", "VERY ").replace("_", " ").toUpperCase();
}

function scoreBar(score: number): string {
  const width = 20;
  const center = Math.floor(width / 2);
  const pos = Math.round((score + 1) / 2 * width);
  let bar = "";
  for (let i = 0; i <= width; i++) {
    if (i === center) bar += "|";
    else if (i === pos) bar += "#";
    else bar += "-";
  }
  return bar;
}

function printPost(post: AnalyzedPost, index: number): void {
  const color = scoreColor(post.sentiment.score);
  const truncated = post.text.length > 120 ? post.text.slice(0, 120) + "..." : post.text;
  const sign = post.sentiment.score > 0 ? "+" : "";
  console.log(
    `  ${C.dim}${String(index + 1).padStart(2)}.${C.reset} ` +
    `${color}${sign}${post.sentiment.score.toFixed(3)}${C.reset} ` +
    `[${scoreBar(post.sentiment.score)}] ` +
    `${C.dim}@${post.author}${C.reset}`
  );
  console.log(`      ${C.dim}${truncated}${C.reset}`);
  console.log(
    `      ${C.cyan}${post.engagement.likes} likes | ${post.engagement.replies} replies | ${post.engagement.shares} shares${C.reset}`
  );
}

function printSummary(summary: SentimentSummary): void {
  const platform = summary.platform === "reddit" ? "Reddit" : "X/Twitter";
  const color = scoreColor(summary.averageScore);
  const sign = summary.averageScore > 0 ? "+" : "";
  const ewSign = summary.engagementWeightedScore > 0 ? "+" : "";

  console.log(`\n${"=".repeat(70)}`);
  console.log(`${C.bold}  ${platform} Sentiment: ${summary.asset.name} (${summary.asset.symbol})${C.reset}`);
  console.log(`${"=".repeat(70)}`);
  console.log(`  Asset type:     ${summary.asset.type}`);
  console.log(`  Posts analyzed:  ${summary.postCount}`);
  console.log(`  Avg sentiment:   ${color}${sign}${summary.averageScore.toFixed(3)}${C.reset}  [${scoreBar(summary.averageScore)}]`);
  console.log(`  Avg magnitude:   ${summary.averageMagnitude.toFixed(3)}`);
  console.log(`  EW sentiment:    ${color}${ewSign}${summary.engagementWeightedScore.toFixed(3)}${C.reset}  (engagement-weighted)`);
  console.log(`  Signal:          ${SIGNAL_DISPLAY[summary.signal]}`);
  console.log();
  console.log(`  Distribution:`);
  console.log(`    ${C.red}${C.bold}very bearish: ${summary.distribution.very_bearish}${C.reset}`);
  console.log(`    ${C.red}bearish:      ${summary.distribution.bearish}${C.reset}`);
  console.log(`    ${C.yellow}neutral:      ${summary.distribution.neutral}${C.reset}`);
  console.log(`    ${C.green}bullish:      ${summary.distribution.bullish}${C.reset}`);
  console.log(`    ${C.green}${C.bold}very bullish: ${summary.distribution.very_bullish}${C.reset}`);

  if (summary.mostBullish) {
    console.log(`\n  ${C.green}Most bullish:${C.reset}`);
    printPost(summary.mostBullish, 0);
  }
  if (summary.mostBearish) {
    console.log(`\n  ${C.red}Most bearish:${C.reset}`);
    printPost(summary.mostBearish, 0);
  }
}

// ---- Main ----

async function main() {
  console.log(`\n${C.bold}${C.magenta}Social Sentiment Analyzer${C.reset}`);
  console.log(`${C.dim}Asset: ${asset.name} (${asset.symbol}) | Type: ${asset.type} | Source: ${sourceFlag ?? "all"} | Mode: mock data${C.reset}\n`);

  const sources = sourceFlag ? [sourceFlag] : ["reddit", "twitter"];

  for (const source of sources) {
    let posts: AnalyzedPost[];

    if (source === "reddit") {
      posts = await analyzeRedditPosts(asset);
    } else if (source === "twitter") {
      posts = await analyzeTwitterPosts(asset);
    } else {
      console.error(`Unknown source: ${source}`);
      continue;
    }

    // Print individual posts sorted by sentiment
    console.log(`\n${C.bold}  ${source === "reddit" ? "Reddit" : "X/Twitter"} Posts:${C.reset}`);
    console.log(`  ${"-".repeat(66)}`);
    posts
      .sort((a, b) => b.sentiment.score - a.sentiment.score)
      .forEach((post, i) => printPost(post, i));

    const summary = summarize(posts, source as "reddit" | "twitter", asset);
    printSummary(summary);
  }

  console.log(`\n${C.dim}${"=".repeat(70)}`);
  console.log(`  Mock data. See src/clients/ for real API integration notes.`);
  console.log(`  Usage: npm start -- NVDA | npm start -- --asset gold --source reddit${C.reset}\n`);
}

main().catch(console.error);
