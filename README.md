# Social Sentiment

Financial sentiment analysis from Reddit and X/Twitter. Uses mock data that mirrors real API response shapes — designed as a reference for when you're ready to plug in live APIs.

## Quick Start

```bash
npm install
npm start -- NVDA
```

## Usage

Pass any stock ticker, commodity, sector, or market index:

```bash
# Stocks
npm start -- NVDA
npm start -- TSLA
npm start -- AAPL

# Commodities (aliases work)
npm start -- gold
npm start -- oil
npm start -- silver

# Sectors
npm start -- tech
npm start -- healthcare

# Market indices
npm start -- SPY
npm start -- QQQ

# Filter to one platform
npm start -- NVDA --source reddit
npm start -- gold --source twitter

# Explicit flag syntax
npm start -- --asset MSFT --source twitter
```

## What It Does

1. **Resolves the asset** — fuzzy input (`"gold"`, `"$NVDA"`, `"tech"`) maps to a typed `AssetTarget` with symbol, name, type, and aliases
2. **Fetches posts** — pulls from Reddit and X/Twitter clients (mock data now, real API later)
3. **Analyzes sentiment** — finance-tuned lexicon with ~200 market terms (bullish/bearish, earnings beat/miss, squeeze/capitulation, etc.) plus negation and intensifier handling
4. **Produces a signal** — engagement-weighted sentiment score mapped to `STRONG BUY / BUY / HOLD / SELL / STRONG SELL`

## Output

Each run shows per-platform:
- Individual posts ranked by sentiment with visual score bars
- Summary with average score, engagement-weighted score, and distribution
- Most bullish and most bearish posts
- Overall signal

## Project Structure

```
src/
├── types/
│   ├── financial.ts    # AssetTarget, known assets, resolver
│   ├── reddit.ts       # Reddit JSON API types (Listing, Post, Comment)
│   ├── twitter.ts      # X/Twitter API v2 types (Tweet, User, Search)
│   └── sentiment.ts    # Scores, analyzed posts, summaries
├── mocks/
│   ├── reddit.ts       # Mock posts per asset type (stock/commodity/sector/market)
│   └── twitter.ts      # Mock tweets per asset type
├── clients/
│   ├── reddit.ts       # Reddit client (mock toggle + real API notes)
│   └── twitter.ts      # Twitter client (mock toggle + real API notes)
├── analysis/
│   ├── sentiment.ts    # Lexicon-based analyzer
│   └── summarize.ts    # Aggregation + signal derivation
└── index.ts            # CLI entry point
```

## Switching to Real APIs

Each client has a `USE_MOCK` flag and commented-out real API code with:
- Endpoint URLs and query construction
- Auth method (Reddit OAuth2, Twitter Bearer Token)
- Rate limits and tier pricing
- Recommended search query patterns for financial data

**Reddit** — Free with OAuth2 (script app type). 100 req/min.

**X/Twitter** — Free tier is write-only (no search). Basic tier ($100/mo) gets 10k reads/month with 7-day search window.

## Sentiment Approach

Currently uses a lexicon-based analyzer (no external APIs, zero cost). For production, consider:
- **FinBERT** (HuggingFace: `ProsusAI/finbert`) — best free option for financial text
- **LLM-based** — Anthropic/OpenAI with a finance-specific prompt
- **Enterprise** — Bloomberg sentiment feed, Refinitiv MarketPsych
