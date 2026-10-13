const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatINR = (amount) => inr.format(Number(amount) || 0);

// Returns e.g. 17 when price is 250 and the original price is 300, otherwise 0
export const discountPercent = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};
