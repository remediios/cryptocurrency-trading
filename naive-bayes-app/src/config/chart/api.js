export const CryptoChart = (coin, days = 365) =>
  `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=gbp&days=${days}`;
