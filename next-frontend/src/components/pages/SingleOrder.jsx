"use client";

import "../../styles/SingleOrder.css"

import Loading from '../states/Loading';
import Error from '../states/Error';
import NavigationControl from '../ui/NavigationControl';
import OrderItemCard from '../cards/OrderItemCard';
import { useOrder } from "@/hooks/useOrders";
import { useUpdateOrderStateMutation } from "@/hooks/useMutation";
import { useFormDate } from "@/hooks/useFormDate";

function SingleOrder({ orderId }) {
  const steps = ["confirmed", "shipped", "out_for_delivery", "delivered"];

  const { data, isLoading, error } = useOrder({ id: orderId })
  const order = data?.data ?? {};

  const updateOrderStatusMutation = useUpdateOrderStateMutation();

  const cancelOrderHandler = ({ id, status }) => {
    alert("Do you wnat to cancel Order!!")
    updateOrderStatusMutation.mutate({
      id,
      status
    })
  }

  if (isLoading) return <Loading />;
  if (error) return <Error />

  const createdOn = useFormDate(order.createdAt)
  const currentStep = steps.indexOf(order.orderStatus);
  return (
    <>
      <NavigationControl />
      <br />
      <div className="singleOrder">
        {order.orderStatus === "cancelled" && <p style={{ color: "red" }}>Order Cancelled</p>}
        {((order.orderStatus === "pending") || (order.orderStatus === "confirmed")) && <button className='cancelOrderBtn' onClick={(e) => cancelOrderHandler({ id: order._id, status: "cancelled" })} >Cancel Order</button>}
        {error && <p>{error?.response?.data?.message}</p>}
        <p><b>#</b>{order.orderNumber}</p>
        <p className='orderDate'>{createdOn}</p>
        <p className='orderDate'>{order.estimatedDelivery
          ? `Delivery by ${order.estimatedDelivery}`
          : "Estimated delivery will be updated soon"}</p>
        <br />
        {/* <p><b>Payment Method:</b>{order.paymentMethod}</p> */}
        <div>
          <b>Items:</b>
          <br /><br />
          <div className='orderItems'>
            {order.items.map((item, i) => (
              <OrderItemCard key={i} item={item} />
            ))}
          </div>
        </div>
        <br />
        {order.orderStatus !== "cancelled" && <div>
          <b>Order Status:</b>
          <div className="order-tracker">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`step ${index < currentStep
                  ? "completed"
                  : index === currentStep
                    ? "active"
                    : ""
                  }`}
              >
                <span>{index < currentStep ? "✔" : index === currentStep ? "⏳" : ""}</span>
                <p>{step.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </div>}
        <div>
          <b>Order Summery:</b>
          <br /><br />
          <table className="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map(item => (
                <tr key={item._id}>
                  <td>{item.book.title}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.lineTotal}</td>
                </tr>
              ))}

              <tr className="summary">
                <td colSpan="3">Subtotal</td>
                <td>₹{order.subtotal}</td>
              </tr>
              <tr className="summary">
                <td colSpan="3">Discount</td>
                <td>-₹{order.discount}</td>
              </tr>
              <tr className="summary">
                <td colSpan="3">Tax</td>
                <td>+₹{order.tax}</td>
              </tr>
              <tr className="summary">
                <td colSpan="3">Shipping</td>
                <td>+₹{order.shippingFee}</td>
              </tr>
              <tr className="summary">
                <td colSpan="3">Total Payable</td>
                <td>₹{order.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <br />
        <div>
          <b>Address:</b>
          <br /><br />
          <div className="orderShippingAddress">
            <p>{order.shippingAddress.name}</p>
            <p>+91 {order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.line1}, {order.shippingAddress.line2}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>

          </div>
        </div>
      </div>
    </>
  )
}

export default SingleOrder