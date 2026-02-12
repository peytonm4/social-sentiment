import type { AssetTarget } from "../types/financial.js";
import type { AnalyzedPost, SentimentSummary, SentimentLabel } from "../types/sentiment.js";

export function summarize(
  posts: AnalyzedPost[],
  platform: "reddit" | "twitter",
  asset: AssetTarget,
): SentimentSummary {
  const empty: SentimentSummary = {
    asset,
    platform,
    postCount: 0,
    averageScore: 0,
    averageMagnitude: 0,
    distribution: { very_bearish: 0, bearish: 0, neutral: 0, bullish: 0, very_bullish: 0 },
    mostBullish: null,
    mostBearish: null,
    engagementWeightedScore: 0,
    signal: "hold",
  };

  if (posts.length === 0) return empty;

  const distribution: Record<SentimentLabel, number> = {
    very_bearish: 0, bearish: 0, neutral: 0, bullish: 0, very_bullish: 0,
  };
  let totalScore = 0;
  let totalMagnitude = 0;
  let weightedScoreSum = 0;
  let weightSum = 0;
  let mostBullish = posts[0];
  let mostBearish = posts[0];

  for (const post of posts) {
    totalScore += post.sentiment.score;
    totalMagnitude += post.sentiment.magnitude;
    distribution[post.sentiment.label]++;

    const engagement = post.engagement.likes + post.engagement.replies + post.engagement.shares;
    const weight = Math.log1p(engagement);
    weightedScoreSum += post.sentiment.score * weight;
    weightSum += weight;

    if (post.sentiment.score > mostBullish.sentiment.score) mostBullish = post;
    if (post.sentiment.score < mostBearish.sentiment.score) mostBearish = post;
  }

  const avgScore = totalScore / posts.length;
  const ewScore = weightSum > 0 ? weightedScoreSum / weightSum : 0;

  return {
    asset,
    platform,
    postCount: posts.length,
    averageScore: Math.round(avgScore * 1000) / 1000,
    averageMagnitude: Math.round((totalMagnitude / posts.length) * 1000) / 1000,
    distribution,
    mostBullish,
    mostBearish,
    engagementWeightedScore: Math.round(ewScore * 1000) / 1000,
    signal: deriveSignal(ewScore, posts.length),
  };
}

function deriveSignal(ewScore: number, postCount: number): SentimentSummary["signal"] {
  // Need enough posts for a meaningful signal
  if (postCount < 3) return "hold";
  if (ewScore >= 0.5) return "strong_buy";
  if (ewScore >= 0.15) return "buy";
  if (ewScore > -0.15) return "hold";
  if (ewScore > -0.5) return "sell";
  return "strong_sell";
}
