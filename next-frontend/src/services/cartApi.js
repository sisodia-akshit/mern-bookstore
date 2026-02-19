import API from "./api";

export const getMyCart = async () => {
  const res = await API.get("cart");
  return res;
};
export const addToCartApi = async ({ book, quantity }) => {
  const res = await API.post("cart", { book, quantity });
  return res;
};
export const updateCartApi = async ({ id, book, quantity }) => {
  const res = await API.put(`cart/${id}`, { book, quantity });
  return res;
};
export const removeFromCartApi = async ({ id }) => {
  const res = await API.delete(`cart/${id}`);
  return res;
};
export const clearCartApi = async () => {
  const res = await API.delete(`cart`);
  return res;
};
export const checkoutPreviewApi = async () => {
  const res = await API.get(`cart/checkout`);
  return res.data;
};
