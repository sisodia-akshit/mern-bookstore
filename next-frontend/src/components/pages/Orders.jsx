"use client";

import "../../styles/Orders.css"
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../services/orderApi";
import Loading from "../states/Loading";
import Order from "../Order";
import NavigationControl from "../ui/NavigationControl";

const Orders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: ({ signal }) => getMyOrders({ signal })
  })
  const orders = data?.data ?? []
  // const total = data?.total ?? 0;

  if (isLoading) return <Loading />
  return (
    <>
      <NavigationControl />
      <h2 style={{ margin: "0 10px", color: "var(--primary-color)" }}>My Orders</h2>
      <div className="orders">
        {error && <p style={{ color: "red" }}>{error.message}</p>}
        {orders.map((o, i) => {
          return <Order key={o._id} order={o} />
        })}
      </div>
    </>
  );
};

export default Orders;
