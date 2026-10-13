import api from "./api";

export async function getProducts() {
  const response = await api.get("/products");
  return response.data.products ?? [];
}

export async function getProductBySlug(slug) {
  const response = await api.get(`/products/slug/${encodeURIComponent(slug)}`);
  return response.data.product;
}
