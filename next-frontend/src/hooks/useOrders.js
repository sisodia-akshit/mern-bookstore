import { useQuery } from "@tanstack/react-query";
import { getAllOrders, getOrders } from "../services/ordersApi";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "@/services/orderApi";

export const useOrders = ({ page, limit, status, sort, order }) => {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, status, sort, order],
    queryFn: ({ signal }) =>
      user?.role === "admin"
        ? getAllOrders({
            page,
            limit,
            status: status?.toLowerCase(),
            sort,
            order,
            signal,
          })
        : getOrders({ signal }),
    keepPreviousData: true,
  });

  return { data, isLoading, error };
};

export const useOrder = ({ id }) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById({ id }),
  });
};
