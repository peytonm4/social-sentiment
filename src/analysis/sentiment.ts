import type { SentimentScore, SentimentLabel } from "../types/sentiment.js";

/**
 * Finance-tuned lexicon-based sentiment analyzer.
 *
 * Uses an AFINN-style word list extended with market/trading vernacular.
 * For production, swap this out for:
 *   - FinBERT (HuggingFace: ProsusAI/finbert) — best free option for financial text
 *   - OpenAI / Anthropic with a finance-specific prompt
 *   - Bloomberg sentiment data feed (enterprise)
 *   - Refinitiv MarketPsych (enterprise)
 */

// Scores: -5 (very bearish) to +5 (very bullish)
const LEXICON: Record<string, number> = {
  // ---- Bullish / positive market language ----
  bullish: 4, bull: 3, buy: 2, bought: 2, buying: 2, long: 2,
  moon: 4, mooning: 5, rocket: 4, squeeze: 3,
  breakout: 3, "breaking out": 3, rally: 3, rallying: 3, surge: 3, surging: 3,
  soar: 4, soaring: 4, skyrocket: 5, parabolic: 4,
  undervalued: 3, oversold: 2, dip: 1, "buy the dip": 3, btd: 3,
  upside: 2, uptrend: 2, momentum: 1, accumulate: 2, accumulating: 2,
  outperform: 3, beat: 2, beats: 2, exceeded: 3, blowout: 3,
  upgrade: 3, upgraded: 3, "price target": 1, raised: 2,
  dividend: 1, buyback: 2, "share buyback": 2, repurchase: 2,
  profit: 2, profitable: 2, profitability: 2, revenue: 1, growth: 2, growing: 2,
  earnings: 1, "earnings beat": 4, guidance: 1, "raised guidance": 4,
  innovation: 2, innovative: 2, disrupting: 2, disruptor: 2,
  recovery: 2, recovering: 2, rebound: 2, rebounding: 2,
  strong: 2, strength: 2, solid: 1, robust: 2, healthy: 2,
  confident: 2, confidence: 2, optimistic: 3, optimism: 3,
  opportunity: 2, potential: 1, promising: 2,
  "all time high": 3, ath: 3, "new high": 3, record: 2,
  diamond: 3, "diamond hands": 4, hold: 1, hodl: 3,
  tendies: 3, gains: 2, winner: 2, winning: 2,

  // ---- Bearish / negative market language ----
  bearish: -4, bear: -3, sell: -2, selling: -2, sold: -2, short: -2, shorting: -3,
  crash: -4, crashing: -5, tank: -4, tanking: -4, dump: -4, dumping: -4,
  plunge: -4, plunging: -4, collapse: -5, collapsing: -5,
  overvalued: -3, overbought: -2, bubble: -3, "bubble territory": -4,
  downside: -2, downtrend: -2, breakdown: -3, "breaking down": -3,
  resistance: -1, rejected: -2, rejection: -2, failed: -2,
  underperform: -3, miss: -2, missed: -2, disappointing: -3,
  downgrade: -3, downgraded: -3, "price cut": -2, lowered: -2, slashed: -3,
  loss: -2, losses: -2, losing: -2, deficit: -2,
  debt: -2, leverage: -1, overleveraged: -3, margin: -1, "margin call": -4,
  "earnings miss": -4, "lowered guidance": -4, warning: -2, "profit warning": -4,
  recession: -4, slowdown: -2, contraction: -3, stagflation: -4,
  inflation: -2, "rate hike": -2, hawkish: -2, tightening: -2,
  layoff: -3, layoffs: -3, "job cuts": -3, restructuring: -2, headcount: -2,
  fraud: -5, scam: -5, manipulation: -4, insider: -3, "insider trading": -5,
  investigation: -3, lawsuit: -3, subpoena: -4, sec: -2, regulatory: -2,
  bankruptcy: -5, insolvent: -5, "chapter 11": -5, default: -4, defaulting: -4,
  risk: -1, risky: -2, volatile: -2, volatility: -1, uncertainty: -2,
  fear: -3, panic: -4, "panic selling": -5, capitulation: -4,
  "dead cat bounce": -3, "bull trap": -3, bagholder: -3, bagholding: -3,
  "paper hands": -2, weak: -2, weakness: -2, struggling: -2,
  overexposed: -2, dilution: -3, diluting: -3,

  // ---- General sentiment (carried over, still useful) ----
  amazing: 3, incredible: 3, outstanding: 4, excellent: 3, fantastic: 3,
  love: 2, great: 2, good: 1, nice: 1, happy: 2,
  terrible: -4, awful: -4, horrible: -4, worst: -4,
  hate: -3, angry: -3, furious: -4, disgusted: -4,
  bad: -2, poor: -2, useless: -3, garbage: -4, trash: -3,

  // ---- Neutral / contextual ----
  hold: 0.5, holding: 0.5, sideways: 0, flat: 0, consolidating: 0, consolidation: 0,
  wait: 0, watching: 0, "wait and see": 0, neutral: 0,
};

const NEGATORS = new Set([
  "not", "never", "no", "without", "don't", "doesn't", "didn't",
  "won't", "can't", "couldn't", "isn't", "aren't", "wasn't", "weren't",
  "hardly", "barely", "neither", "nor",
]);

const INTENSIFIERS: Record<string, number> = {
  absolutely: 1.5, completely: 1.5, totally: 1.5, genuinely: 1.2,
  really: 1.3, very: 1.3, super: 1.3, extremely: 1.5, incredibly: 1.5,
  so: 1.3, massively: 1.5, hugely: 1.4, insanely: 1.5,
};

export function analyzeSentiment(text: string): SentimentScore {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9'$\s-]/g, " ");
  const words = cleaned.split(/\s+/).filter(Boolean);

  let totalScore = 0;
  let wordHits = 0;
  let negate = false;
  let intensifier = 1;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/^\$/, ""); // strip $ prefix for ticker-like words

    if (NEGATORS.has(word)) {
      negate = true;
      continue;
    }

    if (INTENSIFIERS[word]) {
      intensifier = INTENSIFIERS[word];
      continue;
    }

    // Check two-word phrases first
    const bigram = i < words.length - 1 ? `${word} ${words[i + 1]}` : null;
    let score = bigram && LEXICON[bigram] !== undefined ? LEXICON[bigram] : undefined;

    if (score !== undefined && bigram) {
      i++; // consumed the bigram
    } else {
      score = LEXICON[word];
    }

    if (score !== undefined && score !== 0) {
      let adjusted = score * intensifier;
      if (negate) adjusted *= -0.75;
      totalScore += adjusted;
      wordHits++;
    }

    negate = false;
    intensifier = 1;
  }

  const normalizedScore = wordHits === 0 ? 0 : Math.tanh(totalScore / (wordHits * 1.5));
  const magnitude = Math.abs(normalizedScore);

  return {
    score: Math.round(normalizedScore * 1000) / 1000,
    magnitude: Math.round(magnitude * 1000) / 1000,
    label: getLabel(normalizedScore),
    wordHits,
  };
}

function getLabel(score: number): SentimentLabel {
  if (score <= -0.5) return "very_bearish";
  if (score <= -0.15) return "bearish";
  if (score < 0.15) return "neutral";
  if (score < 0.5) return "bullish";
  return "very_bullish";
}
