import type { TwitterSearchResponse } from "../types/twitter.js";
import type { AssetTarget } from "../types/financial.js";
import type { AnalyzedPost } from "../types/sentiment.js";
import { getMockTwitterSearch } from "../mocks/twitter.js";
import { analyzeSentiment } from "../analysis/sentiment.js";

/**
 * X/Twitter client — currently returns mock data.
 *
 * To switch to real API:
 * 1. Apply for developer access at https://developer.x.com
 *    (Basic tier = $100/mo, needed for search/read access)
 * 2. Get Bearer Token from project dashboard
 * 3. Search for tweets about the asset:
 *    GET https://api.x.com/2/tweets/search/recent
 *      ?query=$SYMBOL OR "company name" -is:retweet lang:en
 *      &tweet.fields=created_at,public_metrics,entities,context_annotations,lang
 *      &user.fields=name,username,public_metrics,verified
 *      &expansions=author_id
 *      &max_results=100
 *    Headers: Authorization: Bearer {token}
 *
 * Search query tips for financial data:
 *   - Use $SYMBOL (cashtag) for best precision
 *   - Add -is:retweet to avoid noise
 *   - Add lang:en for English only
 *   - Use has:cashtags for posts specifically about stocks
 *   - Combine: "$AAPL OR $APPLE -is:retweet lang:en"
 *
 * Important limits:
 *   - Free tier: write-only (NO search/read access at all)
 *   - Basic ($100/mo): 10k tweets read/month, last 7 days
 *   - Pro ($5000/mo): 1M tweets/month, 30-day + full-archive search
 */

const USE_MOCK = true;

export async function searchTwitter(asset: AssetTarget): Promise<TwitterSearchResponse> {
  if (USE_MOCK) {
    return getMockTwitterSearch(asset);
  }

  // Real implementation:
  // const cashtag = `$${asset.symbol}`;
  // const query = `${cashtag} OR "${asset.name}" -is:retweet lang:en`;
  // const url = new URL("https://api.x.com/2/tweets/search/recent");
  // url.searchParams.set("query", query);
  // url.searchParams.set("tweet.fields", "created_at,public_metrics,entities,context_annotations,lang");
  // url.searchParams.set("user.fields", "name,username,public_metrics,verified");
  // url.searchParams.set("expansions", "author_id");
  // url.searchParams.set("max_results", "100");
  // const res = await fetch(url, {
  //   headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
  // });
  // return res.json();
  throw new Error("Real API not configured");
}

export async function analyzeTwitterPosts(asset: AssetTarget): Promise<AnalyzedPost[]> {
  const response = await searchTwitter(asset);
  const userMap = new Map(response.includes?.users?.map((u) => [u.id, u]));

  return response.data.map((tweet) => {
    const user = userMap.get(tweet.author_id);
    const sentiment = analyzeSentiment(tweet.text);

    return {
      id: tweet.id,
      platform: "twitter" as const,
      text: tweet.text,
      author: user?.username ?? tweet.author_id,
      timestamp: tweet.created_at,
      engagement: {
        likes: tweet.public_metrics.like_count,
        replies: tweet.public_metrics.reply_count,
        shares: tweet.public_metrics.retweet_count + tweet.public_metrics.quote_count,
      },
      sentiment,
    };
  });
}
