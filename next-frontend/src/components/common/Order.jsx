
import OrderItemCard from './cards/OrderItemCard'
import "../styles/Orders.css"
import { useRouter } from 'next/navigation';


function Order({ order }) {
    const router = useRouter();
    const d = new Date(order.createdAt);
    const pad = (n) => String(n).padStart(2, "0");
    const hours = d.getHours() % 12 || 12;
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    const createdOn = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}, ${pad(hours)}:${pad(d.getMinutes())} ${ampm}`;

    const orderButtonHandler = (e) => {
        router.push(`orders/${order._id}`);
    }
    return (
        <div className='order' >
            <p className='orderNumber'><b>#</b> {order.orderNumber}</p>
            {/* <p className='orderNumber' style={{ textTransform: "capitalize" }}><b>Order Status:</b> {order.orderStatus}</p> */}
            <p className='orderDate'>{createdOn}</p>

            <br />
            <div className='orderItems'>
                {order.items.map((item, i) => (
                    <OrderItemCard key={i} item={item} />
                ))}
            </div>
            <br />
            <span style={{ fontSize: "1.5rem", color: "var(--secondary-color)" }}>₹{order.totalAmount}</span>
            <button className="btn" onClick={orderButtonHandler} >See Info</button>
            <br />
        </div>)
}

export default Order