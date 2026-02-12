import type { AssetTarget } from "./financial.js";

/** Shared types for sentiment analysis results */

export type SentimentLabel = "very_bearish" | "bearish" | "neutral" | "bullish" | "very_bullish";

export interface SentimentScore {
  /** -1 (very bearish) to +1 (very bullish) */
  score: number;
  /** Absolute magnitude of sentiment (0 to 1) */
  magnitude: number;
  /** Human-readable label */
  label: SentimentLabel;
  /** Number of sentiment-bearing words found */
  wordHits: number;
}

export interface AnalyzedPost {
  id: string;
  platform: "reddit" | "twitter";
  text: string;
  author: string;
  timestamp: string;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
  };
  sentiment: SentimentScore;
}

export interface SentimentSummary {
  asset: AssetTarget;
  platform: "reddit" | "twitter";
  postCount: number;
  averageScore: number;
  averageMagnitude: number;
  distribution: Record<SentimentLabel, number>;
  mostBullish: AnalyzedPost | null;
  mostBearish: AnalyzedPost | null;
  /** Weighted by engagement (higher engagement = more influence) */
  engagementWeightedScore: number;
  /** Overall signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell" */
  signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
}
