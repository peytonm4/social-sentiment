/**
 * X/Twitter API v2 response types.
 * Based on https://developer.x.com/en/docs/twitter-api
 *
 * Key endpoints for sentiment work:
 *   GET /2/tweets/search/recent?query={query}&tweet.fields=...&expansions=...
 *   GET /2/tweets/:id?tweet.fields=...
 *   GET /2/users/:id/tweets?tweet.fields=...
 *
 * Auth: OAuth 2.0 Bearer Token (App-only) for search
 *       OAuth 2.0 PKCE (User context) for user-specific actions
 *
 * Rate limits (App-only):
 *   - Recent search: 450 requests / 15-min window (Basic tier)
 *   - Tweet lookup: 300 requests / 15-min window
 *
 * Tiers: Free (very limited), Basic ($100/mo), Pro ($5000/mo), Enterprise
 * Free tier: 1 app, write-only (post tweets). NO read/search access.
 * Basic tier: 10k tweets read/mo, search last 7 days
 */

// --- Tweet object (v2) ---

export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  conversation_id: string;
  created_at: string; // ISO 8601
  edit_history_tweet_ids: string[];
  lang: string;
  possibly_sensitive: boolean;
  reply_settings: "everyone" | "mentionedUsers" | "following";
  source: string;
  public_metrics: TweetPublicMetrics;
  entities?: TweetEntities;
  context_annotations?: ContextAnnotation[];
  referenced_tweets?: ReferencedTweet[];
  in_reply_to_user_id?: string;
  geo?: TweetGeo;
  attachments?: TweetAttachments;
}

export interface TweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
}

export interface TweetEntities {
  urls?: Array<{
    start: number;
    end: number;
    url: string;
    expanded_url: string;
    display_url: string;
    unwound_url?: string;
  }>;
  hashtags?: Array<{
    start: number;
    end: number;
    tag: string;
  }>;
  mentions?: Array<{
    start: number;
    end: number;
    username: string;
    id: string;
  }>;
  cashtags?: Array<{
    start: number;
    end: number;
    tag: string;
  }>;
  annotations?: Array<{
    start: number;
    end: number;
    probability: number;
    type: string;
    normalized_text: string;
  }>;
}

export interface ContextAnnotation {
  domain: { id: string; name: string; description?: string };
  entity: { id: string; name: string; description?: string };
}

export interface ReferencedTweet {
  type: "retweeted" | "quoted" | "replied_to";
  id: string;
}

export interface TweetGeo {
  place_id: string;
  coordinates?: { type: string; coordinates: [number, number] };
}

export interface TweetAttachments {
  media_keys?: string[];
  poll_ids?: string[];
}

// --- User object (v2) ---

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  created_at: string;
  description: string;
  location?: string;
  profile_image_url: string;
  protected: boolean;
  verified: boolean;
  public_metrics: UserPublicMetrics;
  entities?: {
    url?: { urls: Array<{ start: number; end: number; url: string; expanded_url: string }> };
    description?: TweetEntities;
  };
}

export interface UserPublicMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
}

// --- Search response (v2) ---

export interface TwitterSearchResponse {
  data: Tweet[];
  includes?: {
    users?: TwitterUser[];
    tweets?: Tweet[]; // referenced tweets
    media?: TwitterMedia[];
    places?: TwitterPlace[];
  };
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token?: string;
  };
  errors?: TwitterApiError[];
}

export interface TwitterMedia {
  media_key: string;
  type: "photo" | "video" | "animated_gif";
  url?: string;
  preview_image_url?: string;
  width: number;
  height: number;
  alt_text?: string;
  public_metrics?: { view_count: number };
}

export interface TwitterPlace {
  id: string;
  full_name: string;
  name: string;
  country: string;
  country_code: string;
  geo: { type: string; bbox: number[] };
  place_type: string;
}

export interface TwitterApiError {
  detail: string;
  title: string;
  resource_type: string;
  parameter: string;
  value: string;
  type: string;
}

// --- Single tweet lookup ---

export interface TwitterTweetResponse {
  data: Tweet;
  includes?: TwitterSearchResponse["includes"];
}
