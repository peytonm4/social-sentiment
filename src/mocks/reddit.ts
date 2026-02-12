import type {
  RedditSearchResponse,
  RedditCommentsResponse,
  RedditPost,
  RedditComment,
} from "../types/reddit.js";
import type { AssetTarget } from "../types/financial.js";

const now = Math.floor(Date.now() / 1000);

function mockPost(overrides: Partial<RedditPost> & { id: string; title: string; selftext: string }): RedditPost {
  return {
    name: `t3_${overrides.id}`,
    author: "market_watcher",
    author_fullname: "t2_abc123",
    subreddit: "stocks",
    subreddit_id: "t5_2qjfk",
    subreddit_name_prefixed: "r/stocks",
    score: 142,
    ups: 158,
    downs: 16,
    upvote_ratio: 0.91,
    num_comments: 47,
    created: now - 3600,
    created_utc: now - 3600,
    permalink: `/r/stocks/comments/${overrides.id}/mock_post/`,
    url: `https://www.reddit.com/r/stocks/comments/${overrides.id}/mock_post/`,
    domain: "self.stocks",
    is_self: true,
    is_video: false,
    over_18: false,
    spoiler: false,
    stickied: false,
    locked: false,
    archived: false,
    link_flair_text: null,
    link_flair_css_class: null,
    distinguished: null,
    edited: false,
    gilded: 0,
    all_awardings: [],
    total_awards_received: 0,
    thumbnail: "self",
    media: null,
    num_crossposts: 0,
    saved: false,
    hidden: false,
    selftext_html: null,
    ...overrides,
  };
}

// ---- Mock data sets keyed by asset type ----
// When the real API is integrated, these disappear and real search results take over.

const STOCK_POSTS: RedditPost[] = [
  mockPost({
    id: "fin01",
    title: "$NVDA earnings absolutely crushed it - raised guidance again",
    selftext: "Revenue up 94% YoY, data center segment blowout. They beat on every metric. The AI demand story is not slowing down. This stock is incredibly undervalued at these levels given the growth trajectory. Raised my price target. Buying more on any dip.",
    author: "gpu_bull",
    score: 2891,
    ups: 3100,
    num_comments: 567,
    upvote_ratio: 0.93,
    subreddit: "stocks",
    link_flair_text: "Earnings",
  }),
  mockPost({
    id: "fin02",
    title: "TSLA looking extremely overvalued here - P/E of 180 with declining margins",
    selftext: "Margins compressed for the 4th straight quarter. Competition from BYD is real. Cybertruck production issues ongoing. Robotaxi is years away if ever. The stock is pricing in perfection but execution is getting worse. I'm shorting from here.",
    author: "value_investor_99",
    score: 1456,
    ups: 1700,
    num_comments: 823,
    upvote_ratio: 0.85,
    subreddit: "stocks",
    link_flair_text: "Bearish Thesis",
  }),
  mockPost({
    id: "fin03",
    title: "Apple's services revenue is the story nobody is talking about",
    selftext: "While everyone focuses on iPhone sales, services hit $26B this quarter. Gross margins over 70%. App Store, Apple TV+, iCloud, Apple Pay - it's becoming a recurring revenue machine. Hardware sales are fine but the moat is in the ecosystem. Very bullish long term.",
    author: "AAPL_lifer",
    score: 734,
    ups: 810,
    num_comments: 198,
    upvote_ratio: 0.91,
    subreddit: "investing",
    link_flair_text: "Analysis",
  }),
  mockPost({
    id: "fin04",
    title: "Just lost 40% of my portfolio panic selling during the dip. Learn from my mistake.",
    selftext: "I had paper hands and sold everything when the market dropped 8% last week. Now it's already recovered most of the losses and I'm sitting in cash. I bought high and sold low like an idiot. The fear got to me. Should have just held. Devastating loss.",
    author: "regretful_trader",
    score: 4521,
    ups: 4900,
    num_comments: 1203,
    upvote_ratio: 0.92,
    subreddit: "wallstreetbets",
  }),
  mockPost({
    id: "fin05",
    title: "AMD is getting squeezed out of the AI chip market",
    selftext: "Their MI300 isn't gaining the traction they hoped for. CUDA ecosystem lock-in is real. Data center customers aren't switching. Revenue growth is slowing and they're losing market share. I think there's significant downside risk from here. Sold my position.",
    author: "chip_analyst",
    score: 567,
    ups: 640,
    num_comments: 312,
    upvote_ratio: 0.88,
    subreddit: "stocks",
    link_flair_text: "Bearish",
  }),
  mockPost({
    id: "fin06",
    title: "Microsoft's cloud growth is insane - MSFT is my largest position",
    selftext: "Azure revenue grew 29% this quarter. Copilot adoption is ramping. Enterprise AI spending is flowing directly into Microsoft's ecosystem. Strong buyback program, solid dividend, incredible moat. This is a hold forever stock. Accumulating on every pullback.",
    author: "cloud_bull",
    score: 612,
    ups: 680,
    num_comments: 145,
    upvote_ratio: 0.90,
    subreddit: "investing",
    link_flair_text: "Bullish",
  }),
  mockPost({
    id: "fin07",
    title: "META investigation by DOJ - this could be serious",
    selftext: "The DOJ antitrust case is moving forward. If they're forced to divest Instagram or WhatsApp, the whole thesis falls apart. Regulatory risk is massively underpriced. The stock is acting like nothing is happening but this lawsuit could be devastating. Proceeding with caution.",
    author: "legal_eagle_trader",
    score: 1890,
    ups: 2100,
    num_comments: 678,
    upvote_ratio: 0.90,
    subreddit: "stocks",
    link_flair_text: "News",
  }),
  mockPost({
    id: "fin08",
    title: "Anyone else feel like this market rally has no legs?",
    selftext: "Breadth is terrible. Only 7 stocks are carrying the index. Small caps are in a downtrend. VIX is suspiciously low. Feels like a classic bull trap before a bigger move down. The recession signals are flashing and the Fed is not cutting. I'm raising cash.",
    author: "macro_bear",
    score: 2340,
    ups: 2600,
    num_comments: 890,
    upvote_ratio: 0.90,
    subreddit: "stocks",
    link_flair_text: "Discussion",
  }),
];

const COMMODITY_POSTS: RedditPost[] = [
  mockPost({
    id: "com01",
    title: "Gold breaking out above $2800 - this rally has legs",
    selftext: "Central banks are accumulating at record pace. Geopolitical uncertainty is rising. Real rates are coming down. Gold is doing exactly what it should be doing. I think $3000 is the next stop. Very bullish on precious metals here.",
    author: "gold_stacker",
    score: 890,
    ups: 980,
    num_comments: 234,
    upvote_ratio: 0.91,
    subreddit: "commodities",
    link_flair_text: "Gold",
  }),
  mockPost({
    id: "com02",
    title: "Oil is heading to $50 - demand destruction is real",
    selftext: "China demand is collapsing. EVs are eating into gasoline consumption faster than expected. OPEC can't hold production cuts forever. The oversupply is massive. I'm bearish on crude for the next 12 months. Shorting energy stocks.",
    author: "energy_bear",
    score: 567,
    ups: 640,
    num_comments: 189,
    upvote_ratio: 0.88,
    subreddit: "commodities",
    link_flair_text: "Oil",
  }),
  mockPost({
    id: "com03",
    title: "Silver is the most undervalued commodity on the planet",
    selftext: "Industrial demand from solar panels is surging. Supply deficits for 3 years running. Gold-to-silver ratio is historically extreme. When silver moves, it moves fast. This is a coiled spring. Accumulating physical and miners.",
    author: "silver_surfer",
    score: 445,
    ups: 490,
    num_comments: 156,
    upvote_ratio: 0.91,
    subreddit: "wallstreetsilver",
    link_flair_text: "DD",
  }),
  mockPost({
    id: "com04",
    title: "Natural gas storage report was terrible - expect more downside",
    selftext: "Injection was way above expectations. Mild winter forecast. LNG export facility delays. This commodity has no floor right now. Producers are going to start shutting in wells. Avoid natgas names until the supply picture clears up.",
    author: "nat_gas_trader",
    score: 234,
    ups: 270,
    num_comments: 89,
    upvote_ratio: 0.87,
    subreddit: "commodities",
    link_flair_text: "Natural Gas",
  }),
];

const SECTOR_POSTS: RedditPost[] = [
  mockPost({
    id: "sec01",
    title: "Tech sector is the only place to be right now",
    selftext: "AI capex cycle is just getting started. Cloud migration still has years to run. These companies print cash and buy back shares. P/E compression fears are overblown when you look at the earnings growth. Tech outperformance is structural, not a bubble.",
    author: "tech_permabull",
    score: 1234,
    ups: 1350,
    num_comments: 345,
    upvote_ratio: 0.91,
    subreddit: "investing",
    link_flair_text: "Sectors",
  }),
  mockPost({
    id: "sec02",
    title: "Financials are about to get crushed when rate cuts start",
    selftext: "Net interest margins will compress. Loan losses are ticking up. Commercial real estate exposure is a ticking time bomb. Banks are not prepared for the slowdown. Underperformance ahead. Selling all my financial positions.",
    author: "bank_skeptic",
    score: 678,
    ups: 750,
    num_comments: 234,
    upvote_ratio: 0.90,
    subreddit: "stocks",
    link_flair_text: "Bearish",
  }),
  mockPost({
    id: "sec03",
    title: "Energy sector is a value trap - don't fall for the dividends",
    selftext: "Peak oil demand is closer than people think. The transition to renewables is accelerating. These companies are returning capital because they have no growth opportunities. The dividends look great until the stock drops 30%. Avoid.",
    author: "energy_skeptic",
    score: 456,
    ups: 520,
    num_comments: 289,
    upvote_ratio: 0.87,
    subreddit: "investing",
    link_flair_text: "Sectors",
  }),
  mockPost({
    id: "sec04",
    title: "Healthcare is incredibly undervalued - GLP-1 drugs are just the start",
    selftext: "The obesity market alone is $100B+. AI drug discovery is cutting development timelines. Aging demographics globally. These are strong secular tailwinds. Healthcare stocks are trading at a discount to historical P/E. Very bullish on the sector.",
    author: "pharma_investor",
    score: 890,
    ups: 970,
    num_comments: 167,
    upvote_ratio: 0.92,
    subreddit: "investing",
    link_flair_text: "Healthcare",
  }),
];

const MARKET_POSTS: RedditPost[] = [
  mockPost({
    id: "mkt01",
    title: "S&P 500 hits all time high - where do we go from here?",
    selftext: "New ATH on strong breadth improvement. Earnings season has been solid. Inflation cooling. Soft landing looks increasingly likely. I'm cautiously optimistic but keeping some dry powder. The trend is your friend until it bends.",
    author: "index_investor",
    score: 1567,
    ups: 1700,
    num_comments: 456,
    upvote_ratio: 0.92,
    subreddit: "stocks",
    link_flair_text: "Market News",
  }),
  mockPost({
    id: "mkt02",
    title: "This market is being held up by 7 stocks. That's not healthy.",
    selftext: "The equal-weight S&P is massively underperforming the cap-weighted index. Small caps are in bear market territory. This kind of narrow leadership always ends badly. 2000 vibes. I'm getting very defensive here. Raising cash and buying puts.",
    author: "breadth_watcher",
    score: 2100,
    ups: 2350,
    num_comments: 789,
    upvote_ratio: 0.89,
    subreddit: "investing",
    link_flair_text: "Discussion",
  }),
  mockPost({
    id: "mkt03",
    title: "Fed holding rates steady - market seems fine with it",
    selftext: "No surprises from the Fed today. Dot plot still shows 2 cuts this year. Powell's language was balanced. The market is consolidating, which is healthy after the run-up. Not bearish, not wildly bullish. Just holding and watching.",
    author: "fed_watcher",
    score: 890,
    ups: 960,
    num_comments: 234,
    upvote_ratio: 0.93,
    subreddit: "economics",
    link_flair_text: "Fed",
  }),
  mockPost({
    id: "mkt04",
    title: "Nasdaq is in a massive bubble and nobody wants to admit it",
    selftext: "P/E ratios are at dot-com levels. Everyone is piling into the same AI trade. When this reverses it will be ugly. The crash will come when earnings disappoint even slightly. History doesn't repeat but it rhymes. I'm shorting QQQ.",
    author: "perma_bear_2026",
    score: 3400,
    ups: 3800,
    num_comments: 1456,
    upvote_ratio: 0.89,
    subreddit: "stocks",
    link_flair_text: "Bearish",
  }),
];

// ---- Post selector by asset ----

const POST_MAP: Record<string, RedditPost[]> = {};
for (const p of STOCK_POSTS) POST_MAP[p.id] = [p]; // individual lookup
for (const p of COMMODITY_POSTS) POST_MAP[p.id] = [p];
for (const p of SECTOR_POSTS) POST_MAP[p.id] = [p];
for (const p of MARKET_POSTS) POST_MAP[p.id] = [p];

function postsForAsset(asset: AssetTarget): RedditPost[] {
  switch (asset.type) {
    case "stock": return STOCK_POSTS;
    case "commodity": return COMMODITY_POSTS;
    case "sector": return SECTOR_POSTS;
    case "market": return MARKET_POSTS;
    case "crypto": return STOCK_POSTS; // reuse stock posts for demo
    default: return [...STOCK_POSTS, ...MARKET_POSTS];
  }
}

// ---- Mock comments ----

function mockComment(overrides: Partial<RedditComment> & { id: string; body: string }): RedditComment {
  return {
    name: `t1_${overrides.id}`,
    body_html: `<p>${overrides.body}</p>`,
    author: "commenter",
    author_fullname: "t2_def456",
    subreddit: "stocks",
    score: 23,
    ups: 25,
    downs: 2,
    created_utc: now - 1800,
    edited: false,
    parent_id: "t3_fin01",
    link_id: "t3_fin01",
    permalink: `/r/stocks/comments/fin01/mock/c_${overrides.id}/`,
    depth: 0,
    is_submitter: false,
    stickied: false,
    distinguished: null,
    gilded: 0,
    all_awardings: [],
    total_awards_received: 0,
    controversiality: 0,
    replies: "",
    ...overrides,
  };
}

export const mockRedditComments: RedditComment[] = [
  mockComment({ id: "rc01", body: "Earnings beat was massive. Diamond hands paying off. Buying more.", author: "bull_1", score: 234 }),
  mockComment({ id: "rc02", body: "This is a bubble. When it pops the bagholders will be crying.", author: "bear_2", score: 89 }),
  mockComment({ id: "rc03", body: "I've been accumulating since $200. Not selling until $300 minimum.", author: "long_term_3", score: 156 }),
  mockComment({ id: "rc04", body: "Revenue growth is slowing. The easy money has been made. Taking profits.", author: "cautious_4", score: 67 }),
  mockComment({ id: "rc05", body: "Shorts are getting absolutely destroyed right now. Squeeze incoming!", author: "squeeze_5", score: 312 }),
  mockComment({ id: "rc06", body: "The valuation is insane. This will crash hard. Fraud investigation coming.", author: "doom_6", score: 45 }),
  mockComment({ id: "rc07", body: "Solid quarter. Nothing spectacular, nothing terrible. Holding.", author: "neutral_7", score: 34 }),
  mockComment({ id: "rc08", body: "This stock is going to the moon. Best investment I've ever made!", author: "rocket_8", score: 189 }),
];

// ---- Assembled API responses ----

export function getMockRedditSearch(asset: AssetTarget): RedditSearchResponse {
  const posts = postsForAsset(asset);
  return {
    kind: "Listing",
    data: {
      after: `t3_${posts[posts.length - 1].id}`,
      before: null,
      dist: posts.length,
      modhash: "",
      geo_filter: "",
      children: posts.map((post) => ({ kind: "t3", data: post })),
    },
  };
}

export function getMockRedditComments(postId: string): RedditCommentsResponse {
  const allPosts = [...STOCK_POSTS, ...COMMODITY_POSTS, ...SECTOR_POSTS, ...MARKET_POSTS];
  const post = allPosts.find((p) => p.id === postId) ?? allPosts[0];
  return [
    {
      kind: "Listing",
      data: {
        after: null, before: null, dist: 1, modhash: "", geo_filter: "",
        children: [{ kind: "t3", data: post }],
      },
    },
    {
      kind: "Listing",
      data: {
        after: null, before: null, dist: mockRedditComments.length, modhash: "", geo_filter: "",
        children: mockRedditComments.map((c) => ({ kind: "t1", data: c })),
      },
    },
  ];
}
