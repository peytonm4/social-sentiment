import type { RedditSearchResponse, RedditCommentsResponse } from "../types/reddit.js";
import type { AssetTarget } from "../types/financial.js";
import type { AnalyzedPost } from "../types/sentiment.js";
import { getMockRedditSearch, getMockRedditComments } from "../mocks/reddit.js";
import { analyzeSentiment } from "../analysis/sentiment.js";

/**
 * Reddit client — currently returns mock data.
 *
 * To switch to real API:
 * 1. Register a Reddit app at https://www.reddit.com/prefs/apps
 *    (choose "script" type for server-side)
 * 2. Get access token:
 *    POST https://www.reddit.com/api/v1/access_token
 *    Auth: Basic base64(client_id:client_secret)
 *    Body: grant_type=client_credentials
 * 3. Search for posts mentioning the asset:
 *    GET https://oauth.reddit.com/r/{sub}/search.json
 *      ?q=${symbol} OR ${alias1} OR ${alias2}
 *      &sort=relevance&t=week&limit=100
 *    Headers: Authorization: Bearer {token}, User-Agent: social-sentiment/1.0
 *
 * Useful subreddits by asset type:
 *   stocks:      r/stocks, r/investing, r/wallstreetbets, r/stockmarket
 *   commodities: r/commodities, r/wallstreetsilver, r/gold
 *   sectors:     r/stocks, r/investing, r/sectoranalysis
 *   market:      r/stocks, r/investing, r/economics, r/wallstreetbets
 *   crypto:      r/cryptocurrency, r/bitcoin, r/ethtrader
 */

const USE_MOCK = true;

export async function searchReddit(asset: AssetTarget): Promise<RedditSearchResponse> {
  if (USE_MOCK) {
    return getMockRedditSearch(asset);
  }

  // Real implementation:
  // const query = [asset.symbol, ...asset.aliases.slice(0, 3)]
  //   .map((t) => `"${t}"`)
  //   .join(" OR ");
  // const token = await getAccessToken();
  // const url = `https://oauth.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=week&limit=100`;
  // const res = await fetch(url, {
  //   headers: { Authorization: `Bearer ${token}`, "User-Agent": "social-sentiment/1.0" },
  // });
  // return res.json();
  throw new Error("Real API not configured");
}

export async function getRedditComments(postId: string): Promise<RedditCommentsResponse> {
  if (USE_MOCK) {
    return getMockRedditComments(postId);
  }
  throw new Error("Real API not configured");
}

export async function analyzeRedditPosts(asset: AssetTarget): Promise<AnalyzedPost[]> {
  const response = await searchReddit(asset);

  return response.data.children.map((child) => {
    const post = child.data;
    const textToAnalyze = `${post.title}. ${post.selftext}`;
    const sentiment = analyzeSentiment(textToAnalyze);

    return {
      id: post.id,
      platform: "reddit" as const,
      text: textToAnalyze,
      author: post.author,
      timestamp: new Date(post.created_utc * 1000).toISOString(),
      engagement: {
        likes: post.score,
        replies: post.num_comments,
        shares: post.num_crossposts,
      },
      sentiment,
    };
  });
}
