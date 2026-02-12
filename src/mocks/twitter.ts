import type {
  Tweet,
  TwitterUser,
  TwitterSearchResponse,
} from "../types/twitter.js";
import type { AssetTarget } from "../types/financial.js";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600_000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200_000).toISOString();

function mockTweet(overrides: Partial<Tweet> & { id: string; text: string }): Tweet {
  return {
    author_id: "1001",
    conversation_id: overrides.id,
    created_at: hourAgo,
    edit_history_tweet_ids: [overrides.id],
    lang: "en",
    possibly_sensitive: false,
    reply_settings: "everyone",
    source: "Twitter Web App",
    public_metrics: {
      retweet_count: 12, reply_count: 5, like_count: 48,
      quote_count: 3, bookmark_count: 7, impression_count: 2340,
    },
    ...overrides,
  };
}

// ---- Stock-focused tweets ----

const STOCK_TWEETS: Tweet[] = [
  mockTweet({
    id: "1900000000000000001",
    text: "$NVDA earnings blowout. Revenue beat, guidance raised, data center demand through the roof. This stock is going to the moon. Adding to my position aggressively.",
    author_id: "2001",
    created_at: now,
    public_metrics: { retweet_count: 890, reply_count: 234, like_count: 4500, quote_count: 156, bookmark_count: 89, impression_count: 450000 },
    entities: { cashtags: [{ start: 0, end: 5, tag: "NVDA" }] },
  }),
  mockTweet({
    id: "1900000000000000002",
    text: "$TSLA is in trouble. Margins collapsing, competition crushing them in China, and Elon is distracted. Overvalued by at least 50%. This crash is just getting started.",
    author_id: "2002",
    created_at: hourAgo,
    public_metrics: { retweet_count: 567, reply_count: 890, like_count: 2100, quote_count: 234, bookmark_count: 67, impression_count: 340000 },
    entities: { cashtags: [{ start: 0, end: 5, tag: "TSLA" }] },
  }),
  mockTweet({
    id: "1900000000000000003",
    text: "Apple's ecosystem moat is the strongest in tech. Services growing 15% YoY. Buyback machine. This is a hold forever stock. $AAPL",
    author_id: "2003",
    created_at: hourAgo,
    public_metrics: { retweet_count: 123, reply_count: 45, like_count: 678, quote_count: 23, bookmark_count: 34, impression_count: 56000 },
    entities: { cashtags: [{ start: 118, end: 123, tag: "AAPL" }] },
  }),
  mockTweet({
    id: "1900000000000000004",
    text: "Just closed my $AMD short for a 35% gain. MI300 is underperforming, losing share to NVDA. Still bearish. More downside ahead.",
    author_id: "2004",
    created_at: twoHoursAgo,
    public_metrics: { retweet_count: 89, reply_count: 123, like_count: 345, quote_count: 12, bookmark_count: 23, impression_count: 23000 },
    entities: { cashtags: [{ start: 18, end: 22, tag: "AMD" }] },
  }),
  mockTweet({
    id: "1900000000000000005",
    text: "$MSFT Azure growth accelerating again. Copilot revenue starting to show up. This is the safest mega-cap to own. Strong buy.",
    author_id: "2005",
    created_at: now,
    public_metrics: { retweet_count: 234, reply_count: 67, like_count: 1200, quote_count: 45, bookmark_count: 56, impression_count: 89000 },
    entities: { cashtags: [{ start: 0, end: 5, tag: "MSFT" }] },
  }),
  mockTweet({
    id: "1900000000000000006",
    text: "The $META antitrust case is a real risk. If they lose Instagram the whole bull case collapses. Market is not pricing this in. Be careful.",
    author_id: "2006",
    created_at: twoHoursAgo,
    public_metrics: { retweet_count: 456, reply_count: 234, like_count: 1890, quote_count: 89, bookmark_count: 45, impression_count: 230000 },
    entities: { cashtags: [{ start: 4, end: 9, tag: "META" }] },
  }),
];

// ---- Commodity tweets ----

const COMMODITY_TWEETS: Tweet[] = [
  mockTweet({
    id: "1900000000000000011",
    text: "Gold breaking out to new highs. Central banks buying record amounts. Real rates falling. $2800 was resistance, now it's support. $3000 is inevitable. Extremely bullish.",
    author_id: "2011",
    created_at: now,
    public_metrics: { retweet_count: 345, reply_count: 89, like_count: 1567, quote_count: 67, bookmark_count: 45, impression_count: 120000 },
  }),
  mockTweet({
    id: "1900000000000000012",
    text: "Crude oil demand is collapsing. China is weak, EVs are accelerating the decline. OPEC cuts can't save this. Oil heading to $50. Shorting energy.",
    author_id: "2012",
    created_at: hourAgo,
    public_metrics: { retweet_count: 234, reply_count: 156, like_count: 890, quote_count: 45, bookmark_count: 23, impression_count: 89000 },
  }),
  mockTweet({
    id: "1900000000000000013",
    text: "Silver is the trade of the decade. Industrial demand from solar + supply deficit = squeeze potential. Gold/silver ratio at 85 is absurd. Accumulating.",
    author_id: "2013",
    created_at: hourAgo,
    public_metrics: { retweet_count: 156, reply_count: 67, like_count: 567, quote_count: 23, bookmark_count: 34, impression_count: 45000 },
  }),
  mockTweet({
    id: "1900000000000000014",
    text: "Natural gas storage report was bearish. Injection well above expectations. Mild weather killing demand. No floor in sight. Avoid.",
    author_id: "2014",
    created_at: twoHoursAgo,
    public_metrics: { retweet_count: 45, reply_count: 23, like_count: 123, quote_count: 5, bookmark_count: 12, impression_count: 12000 },
  }),
];

// ---- Sector tweets ----

const SECTOR_TWEETS: Tweet[] = [
  mockTweet({
    id: "1900000000000000021",
    text: "Tech sector earnings have been outstanding this quarter. AI spending is accelerating. These companies are growth machines with amazing margins. Overweight tech.",
    author_id: "2021",
    created_at: now,
    public_metrics: { retweet_count: 234, reply_count: 89, like_count: 1200, quote_count: 45, bookmark_count: 56, impression_count: 89000 },
  }),
  mockTweet({
    id: "1900000000000000022",
    text: "Bank stocks are a value trap. NIM compression coming, CRE losses piling up, regulatory risk increasing. Don't chase the yield. The financial sector is headed for pain.",
    author_id: "2022",
    created_at: hourAgo,
    public_metrics: { retweet_count: 345, reply_count: 234, like_count: 890, quote_count: 67, bookmark_count: 34, impression_count: 120000 },
  }),
  mockTweet({
    id: "1900000000000000023",
    text: "Energy sector dividends look amazing until you realize the underlying business is in structural decline. Peak oil demand is here. Sell the rallies.",
    author_id: "2023",
    created_at: hourAgo,
    public_metrics: { retweet_count: 189, reply_count: 145, like_count: 567, quote_count: 34, bookmark_count: 23, impression_count: 67000 },
  }),
  mockTweet({
    id: "1900000000000000024",
    text: "Healthcare is the most undervalued sector. GLP-1 tailwind is massive. AI drug discovery cutting costs. Aging demographics globally. Strong buy signal.",
    author_id: "2024",
    created_at: twoHoursAgo,
    public_metrics: { retweet_count: 156, reply_count: 67, like_count: 789, quote_count: 23, bookmark_count: 45, impression_count: 56000 },
  }),
];

// ---- Market-wide tweets ----

const MARKET_TWEETS: Tweet[] = [
  mockTweet({
    id: "1900000000000000031",
    text: "S&P 500 new all time high! Earnings growth strong, inflation cooling, soft landing achieved. Bullish momentum is undeniable. Stay long.",
    author_id: "2031",
    created_at: now,
    public_metrics: { retweet_count: 567, reply_count: 234, like_count: 2890, quote_count: 89, bookmark_count: 67, impression_count: 340000 },
  }),
  mockTweet({
    id: "1900000000000000032",
    text: "Market breadth is terrible. Only mega-caps are holding the index up. This is a classic bull trap. Recession indicators flashing. Raising cash and buying puts.",
    author_id: "2032",
    created_at: hourAgo,
    public_metrics: { retweet_count: 890, reply_count: 567, like_count: 3400, quote_count: 234, bookmark_count: 89, impression_count: 560000 },
  }),
  mockTweet({
    id: "1900000000000000033",
    text: "Fed holding steady. Two cuts expected this year. Market is fairly valued at 21x forward earnings. Not cheap, not expensive. Neutral positioning makes sense here.",
    author_id: "2033",
    created_at: hourAgo,
    public_metrics: { retweet_count: 123, reply_count: 89, like_count: 456, quote_count: 23, bookmark_count: 34, impression_count: 45000 },
  }),
  mockTweet({
    id: "1900000000000000034",
    text: "The Nasdaq is in a massive bubble. AI hype is the new dot-com. When earnings disappoint even slightly this whole thing crashes. Shorting QQQ aggressively.",
    author_id: "2034",
    created_at: twoHoursAgo,
    public_metrics: { retweet_count: 1200, reply_count: 890, like_count: 4500, quote_count: 345, bookmark_count: 123, impression_count: 890000 },
  }),
  mockTweet({
    id: "1900000000000000035",
    text: "Best market environment for stock picking in years. Dispersion is high, correlations are low. Active management is finally being rewarded. Love it.",
    author_id: "2035",
    created_at: now,
    public_metrics: { retweet_count: 89, reply_count: 34, like_count: 345, quote_count: 12, bookmark_count: 23, impression_count: 23000 },
  }),
];

// ---- Mock users ----

export const mockTwitterUsers: TwitterUser[] = [
  { id: "2001", name: "GPU Bull", username: "gpu_bull_trades", created_at: "2020-03-15T00:00:00Z", description: "Semiconductor analyst. Long NVDA.", profile_image_url: "https://pbs.twimg.com/profile/2001.jpg", protected: false, verified: false, public_metrics: { followers_count: 45000, following_count: 890, tweet_count: 12400, listed_count: 567 } },
  { id: "2002", name: "Tesla Bear", username: "tsla_reality", created_at: "2019-07-22T00:00:00Z", description: "Valuation matters. Short TSLA.", profile_image_url: "https://pbs.twimg.com/profile/2002.jpg", protected: false, verified: false, public_metrics: { followers_count: 23000, following_count: 340, tweet_count: 8900, listed_count: 345 } },
  { id: "2003", name: "Apple Investor", username: "aapl_forever", created_at: "2018-01-10T00:00:00Z", description: "Long-term Apple shareholder since 2010.", profile_image_url: "https://pbs.twimg.com/profile/2003.jpg", protected: false, verified: false, public_metrics: { followers_count: 12000, following_count: 450, tweet_count: 5600, listed_count: 234 } },
  { id: "2004", name: "Chip Shorts", username: "semi_bear", created_at: "2021-06-01T00:00:00Z", description: "Trading semis from the short side.", profile_image_url: "https://pbs.twimg.com/profile/2004.jpg", protected: false, verified: false, public_metrics: { followers_count: 8900, following_count: 567, tweet_count: 3400, listed_count: 123 } },
  { id: "2005", name: "Cloud Capital", username: "cloud_capital", created_at: "2019-11-30T00:00:00Z", description: "Cloud & SaaS focused fund manager.", profile_image_url: "https://pbs.twimg.com/profile/2005.jpg", protected: false, verified: true, public_metrics: { followers_count: 67000, following_count: 234, tweet_count: 4500, listed_count: 890 } },
  { id: "2006", name: "Regulatory Risk", username: "antitrust_watch", created_at: "2020-02-14T00:00:00Z", description: "Tracking regulatory risk in big tech.", profile_image_url: "https://pbs.twimg.com/profile/2006.jpg", protected: false, verified: false, public_metrics: { followers_count: 34000, following_count: 890, tweet_count: 7800, listed_count: 456 } },
  { id: "2011", name: "Gold Stacker", username: "stack_gold", created_at: "2018-08-20T00:00:00Z", description: "Precious metals bull. Sound money.", profile_image_url: "https://pbs.twimg.com/profile/2011.jpg", protected: false, verified: false, public_metrics: { followers_count: 28000, following_count: 340, tweet_count: 9800, listed_count: 567 } },
  { id: "2012", name: "Energy Trader", username: "crude_trader", created_at: "2019-12-01T00:00:00Z", description: "Commodities trader. Oil & gas.", profile_image_url: "https://pbs.twimg.com/profile/2012.jpg", protected: false, verified: false, public_metrics: { followers_count: 15000, following_count: 450, tweet_count: 6700, listed_count: 234 } },
  { id: "2013", name: "Silver Squeeze", username: "silver_ape", created_at: "2021-01-28T00:00:00Z", description: "Physical silver stacker. End the manipulation.", profile_image_url: "https://pbs.twimg.com/profile/2013.jpg", protected: false, verified: false, public_metrics: { followers_count: 19000, following_count: 670, tweet_count: 11200, listed_count: 345 } },
  { id: "2014", name: "NatGas Trader", username: "natgas_flows", created_at: "2020-05-15T00:00:00Z", description: "Natural gas fundamentals & flows.", profile_image_url: "https://pbs.twimg.com/profile/2014.jpg", protected: false, verified: false, public_metrics: { followers_count: 5600, following_count: 234, tweet_count: 3400, listed_count: 89 } },
  { id: "2021", name: "Tech Sector Bull", username: "tech_permabull", created_at: "2019-03-10T00:00:00Z", description: "AI & cloud investor.", profile_image_url: "https://pbs.twimg.com/profile/2021.jpg", protected: false, verified: false, public_metrics: { followers_count: 34000, following_count: 560, tweet_count: 8900, listed_count: 456 } },
  { id: "2022", name: "Bank Skeptic", username: "short_banks", created_at: "2020-09-22T00:00:00Z", description: "CRE risk is real.", profile_image_url: "https://pbs.twimg.com/profile/2022.jpg", protected: false, verified: false, public_metrics: { followers_count: 12000, following_count: 345, tweet_count: 4500, listed_count: 234 } },
  { id: "2023", name: "Peak Oil Demand", username: "energy_transition", created_at: "2021-04-01T00:00:00Z", description: "The energy transition is here.", profile_image_url: "https://pbs.twimg.com/profile/2023.jpg", protected: false, verified: false, public_metrics: { followers_count: 8900, following_count: 450, tweet_count: 3400, listed_count: 123 } },
  { id: "2024", name: "Healthcare Alpha", username: "pharma_picks", created_at: "2018-11-15T00:00:00Z", description: "Biotech & pharma analyst.", profile_image_url: "https://pbs.twimg.com/profile/2024.jpg", protected: false, verified: true, public_metrics: { followers_count: 56000, following_count: 234, tweet_count: 7800, listed_count: 890 } },
  { id: "2031", name: "Index Bull", username: "spy_calls", created_at: "2019-06-01T00:00:00Z", description: "Stocks only go up.", profile_image_url: "https://pbs.twimg.com/profile/2031.jpg", protected: false, verified: false, public_metrics: { followers_count: 23000, following_count: 670, tweet_count: 12300, listed_count: 345 } },
  { id: "2032", name: "Macro Bear", username: "recession_watch", created_at: "2020-03-15T00:00:00Z", description: "Macro strategist. Currently bearish.", profile_image_url: "https://pbs.twimg.com/profile/2032.jpg", protected: false, verified: true, public_metrics: { followers_count: 89000, following_count: 120, tweet_count: 5600, listed_count: 1200 } },
  { id: "2033", name: "Fed Watcher", username: "fomc_minutes", created_at: "2017-08-10T00:00:00Z", description: "Tracking Federal Reserve policy.", profile_image_url: "https://pbs.twimg.com/profile/2033.jpg", protected: false, verified: true, public_metrics: { followers_count: 120000, following_count: 89, tweet_count: 4500, listed_count: 2300 } },
  { id: "2034", name: "Bubble Watch", username: "its_a_bubble", created_at: "2021-11-01T00:00:00Z", description: "Called the top in 2021. Calling it again.", profile_image_url: "https://pbs.twimg.com/profile/2034.jpg", protected: false, verified: false, public_metrics: { followers_count: 45000, following_count: 340, tweet_count: 8900, listed_count: 567 } },
  { id: "2035", name: "Active Alpha", username: "stock_picker", created_at: "2018-05-20T00:00:00Z", description: "Fundamental stock picker. Long/short equity.", profile_image_url: "https://pbs.twimg.com/profile/2035.jpg", protected: false, verified: false, public_metrics: { followers_count: 15000, following_count: 560, tweet_count: 6700, listed_count: 345 } },
];

function tweetsForAsset(asset: AssetTarget): Tweet[] {
  switch (asset.type) {
    case "stock": return STOCK_TWEETS;
    case "commodity": return COMMODITY_TWEETS;
    case "sector": return SECTOR_TWEETS;
    case "market": return MARKET_TWEETS;
    case "crypto": return STOCK_TWEETS;
    default: return [...STOCK_TWEETS, ...MARKET_TWEETS];
  }
}

export function getMockTwitterSearch(asset: AssetTarget): TwitterSearchResponse {
  const tweets = tweetsForAsset(asset);
  const authorIds = new Set(tweets.map((t) => t.author_id));
  const users = mockTwitterUsers.filter((u) => authorIds.has(u.id));

  return {
    data: tweets,
    includes: { users },
    meta: {
      newest_id: tweets[0].id,
      oldest_id: tweets[tweets.length - 1].id,
      result_count: tweets.length,
      next_token: "b26v89c19zqg8o3fpzbkk3t0fl5s9xg7t3qrknj1pe5d1",
    },
  };
}
