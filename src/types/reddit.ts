/**
 * Reddit API response types.
 * Based on Reddit's JSON API (oauth.reddit.com).
 *
 * Key endpoints for sentiment work:
 *   GET /r/{subreddit}/search.json?q={query}&sort=relevance&t=week
 *   GET /r/{subreddit}/comments/{article_id}.json
 *   GET /r/{subreddit}/hot.json?limit=25
 *
 * Auth: OAuth2 bearer token via https://www.reddit.com/api/v1/access_token
 *       (script app type for server-side, client_credentials grant)
 *
 * Rate limits: 100 requests/minute with OAuth
 */

// --- Core "Thing" wrapper Reddit uses for everything ---

export interface RedditListing<T> {
  kind: "Listing";
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: RedditThing<T>[];
  };
}

export interface RedditThing<T> {
  kind: string; // "t1" = comment, "t3" = post, "t5" = subreddit
  data: T;
}

// --- Post (t3) ---

export interface RedditPost {
  id: string;
  name: string; // fullname, e.g. "t3_abc123"
  title: string;
  selftext: string;
  selftext_html: string | null;
  author: string;
  author_fullname: string;
  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  score: number;
  ups: number;
  downs: number;
  upvote_ratio: number;
  num_comments: number;
  created: number; // unix epoch
  created_utc: number;
  permalink: string;
  url: string;
  domain: string;
  is_self: boolean;
  is_video: boolean;
  over_18: boolean;
  spoiler: boolean;
  stickied: boolean;
  locked: boolean;
  archived: boolean;
  link_flair_text: string | null;
  link_flair_css_class: string | null;
  distinguished: string | null;
  edited: number | false;
  gilded: number;
  all_awardings: RedditAward[];
  total_awards_received: number;
  thumbnail: string;
  preview?: RedditPreview;
  media: RedditMedia | null;
  num_crossposts: number;
  saved: boolean;
  hidden: boolean;
}

export interface RedditAward {
  id: string;
  name: string;
  description: string;
  count: number;
  icon_url: string;
}

export interface RedditPreview {
  images: Array<{
    source: { url: string; width: number; height: number };
    resolutions: Array<{ url: string; width: number; height: number }>;
    id: string;
  }>;
  enabled: boolean;
}

export interface RedditMedia {
  type: string;
  oembed?: {
    provider_url: string;
    title: string;
    thumbnail_url: string;
    html: string;
  };
}

// --- Comment (t1) ---

export interface RedditComment {
  id: string;
  name: string; // "t1_xyz789"
  body: string;
  body_html: string;
  author: string;
  author_fullname: string;
  subreddit: string;
  score: number;
  ups: number;
  downs: number;
  created_utc: number;
  edited: number | false;
  parent_id: string;
  link_id: string;
  permalink: string;
  depth: number;
  is_submitter: boolean;
  stickied: boolean;
  distinguished: string | null;
  gilded: number;
  all_awardings: RedditAward[];
  total_awards_received: number;
  controversiality: number;
  replies: RedditListing<RedditComment> | "";
}

// --- Search result is just a listing of posts ---

export type RedditSearchResponse = RedditListing<RedditPost>;
export type RedditCommentsResponse = [
  RedditListing<RedditPost>,   // the post itself
  RedditListing<RedditComment>  // comments
];
