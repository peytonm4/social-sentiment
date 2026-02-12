/** Financial context for sentiment targets */

export type AssetType = "stock" | "commodity" | "sector" | "market" | "crypto";

export interface AssetTarget {
  /** e.g. "AAPL", "GC" (gold futures), "XLE" (energy sector ETF) */
  symbol: string;
  /** Human-readable name */
  name: string;
  type: AssetType;
  /** Aliases people use in social posts — e.g. ["apple", "aapl", "$aapl"] */
  aliases: string[];
}

/** Pre-built targets for quick lookup */
export const KNOWN_ASSETS: Record<string, AssetTarget> = {
  // Stocks
  AAPL:  { symbol: "AAPL",  name: "Apple Inc.",            type: "stock",     aliases: ["apple", "aapl", "$aapl", "appl"] },
  TSLA:  { symbol: "TSLA",  name: "Tesla Inc.",            type: "stock",     aliases: ["tesla", "tsla", "$tsla", "elon"] },
  NVDA:  { symbol: "NVDA",  name: "NVIDIA Corp.",          type: "stock",     aliases: ["nvidia", "nvda", "$nvda", "nvdia"] },
  MSFT:  { symbol: "MSFT",  name: "Microsoft Corp.",       type: "stock",     aliases: ["microsoft", "msft", "$msft"] },
  AMZN:  { symbol: "AMZN",  name: "Amazon.com Inc.",       type: "stock",     aliases: ["amazon", "amzn", "$amzn", "aws"] },
  GOOG:  { symbol: "GOOG",  name: "Alphabet Inc.",         type: "stock",     aliases: ["google", "goog", "$goog", "alphabet", "googl"] },
  META:  { symbol: "META",  name: "Meta Platforms Inc.",    type: "stock",     aliases: ["meta", "$meta", "facebook", "zuck"] },
  AMD:   { symbol: "AMD",   name: "Advanced Micro Devices", type: "stock",    aliases: ["amd", "$amd"] },
  // Commodities
  GC:    { symbol: "GC",    name: "Gold",                  type: "commodity", aliases: ["gold", "xau", "gc", "gold futures"] },
  CL:    { symbol: "CL",    name: "Crude Oil (WTI)",       type: "commodity", aliases: ["oil", "crude", "wti", "cl", "crude oil"] },
  SI:    { symbol: "SI",    name: "Silver",                type: "commodity", aliases: ["silver", "xag", "si", "silver futures"] },
  NG:    { symbol: "NG",    name: "Natural Gas",           type: "commodity", aliases: ["natgas", "natural gas", "ng"] },
  // Sectors
  XLK:   { symbol: "XLK",   name: "Technology Sector",     type: "sector",   aliases: ["tech", "technology", "tech sector", "xlk"] },
  XLF:   { symbol: "XLF",   name: "Financial Sector",      type: "sector",   aliases: ["financials", "banks", "banking", "financial sector", "xlf"] },
  XLE:   { symbol: "XLE",   name: "Energy Sector",         type: "sector",   aliases: ["energy", "energy sector", "oil stocks", "xle"] },
  XLV:   { symbol: "XLV",   name: "Healthcare Sector",     type: "sector",   aliases: ["healthcare", "health", "pharma", "biotech", "xlv"] },
  // Market-wide
  SPY:   { symbol: "SPY",   name: "S&P 500",              type: "market",    aliases: ["spy", "s&p", "s&p 500", "sp500", "spx", "the market"] },
  QQQ:   { symbol: "QQQ",   name: "Nasdaq 100",           type: "market",    aliases: ["qqq", "nasdaq", "nasdaq 100", "tech stocks"] },
  DIA:   { symbol: "DIA",   name: "Dow Jones",            type: "market",    aliases: ["dow", "djia", "dow jones", "dia"] },
  IWM:   { symbol: "IWM",   name: "Russell 2000",         type: "market",    aliases: ["russell", "small caps", "iwm", "russell 2000"] },
  // Crypto
  BTC:   { symbol: "BTC",   name: "Bitcoin",              type: "crypto",    aliases: ["bitcoin", "btc", "$btc"] },
  ETH:   { symbol: "ETH",   name: "Ethereum",             type: "crypto",    aliases: ["ethereum", "eth", "$eth"] },
};

export function resolveAsset(input: string): AssetTarget {
  const upper = input.toUpperCase().replace("$", "");

  // Direct symbol match
  if (KNOWN_ASSETS[upper]) return KNOWN_ASSETS[upper];

  // Alias match
  const lower = input.toLowerCase().replace("$", "");
  for (const asset of Object.values(KNOWN_ASSETS)) {
    if (asset.aliases.includes(lower)) return asset;
  }

  // Unknown — treat as stock ticker
  return {
    symbol: upper,
    name: upper,
    type: "stock",
    aliases: [lower, `$${lower}`],
  };
}
