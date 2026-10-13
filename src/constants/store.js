// Delivery rules. These must match the backend (orderController.js).
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 50;
export const MAX_QUANTITY_PER_ITEM = 50;

// Shipping charge for a given subtotal.
// Invalid or empty subtotals (NaN, 0, negative) return 0 instead of charging a fee.
export const shippingFor = (subtotal) => {
  const amount = Number(subtotal);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return amount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
};

// Progress towards free delivery, handy for a cart "add ₹X more" bar.
// -> { unlocked, remaining, percent }
export const freeShippingProgress = (subtotal) => {
  const amount = Math.max(0, Number(subtotal) || 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - amount);
  return {
    unlocked: remaining === 0,
    remaining,
    percent: Math.min(
      100,
      Math.round((amount / FREE_SHIPPING_THRESHOLD) * 100),
    ),
  };
};

// `label` must match the category names stored on products in the database
export const CATEGORIES = Object.freeze([
  Object.freeze({
    label: "Dry Fruits",
    slug: "dry-fruits",
    description: "Premium almonds, cashews, pista, walnuts and more.",
  }),
  Object.freeze({
    label: "Seeds",
    slug: "seeds",
    description: "Nutritious seeds selected for everyday wellness.",
  }),
  Object.freeze({
    label: "Dried Berries",
    slug: "dried-berries",
    description: "Naturally sweet and delicious dried fruits.",
  }),
]);

export const getCategoryBySlug = (slug) =>
  CATEGORIES.find((category) => category.slug === slug);

export const getCategoryByLabel = (label) =>
  CATEGORIES.find((category) => category.label === label);

export const CART_STORAGE_KEY = "bbs-royal-basket-cart";
export const LAST_ORDER_KEY = "bbs-last-order";

export const INDIAN_STATES = Object.freeze([
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]);
