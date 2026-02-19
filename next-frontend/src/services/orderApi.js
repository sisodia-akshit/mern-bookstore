import API from "./api";

export const placeOrder = async (order) => {
  const res = await API.post("orders", order);
  return res.data;
};

export const getMyOrders = async ({ signal }) => {
  const res = await API.get(`orders/my`, { signal });
  return res.data;
};
export const getOrderById = async ({ orderId }) => {
  const res = await API.get(`orders/${orderId}`);
  return res.data;
};
export const updateOrderStatus = async ({ id, status }) => {
  const res = await API.patch(`orders/${id}`, { status });
  return res.data;
};
