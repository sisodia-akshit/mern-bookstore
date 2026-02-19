"use client";


import CartItemCard from "../CartItemCard";
import Error from "../states/Error";
import Loading from "../states/Loading";
import { useCart } from "../../context/CartContext";
import NavigationControl from "../ui/NavigationControl";
import "../../styles/Cart.css"
import { useRouter } from "next/navigation";

const Cart = () => {
    const router = useRouter();
    const { cart, isLoading, error, mutationPending, mutationError } = useCart();

    const checkOutHandler = (e) => {
        e.preventDefault();
        router.push("/checkout/address")
    }

    if (isLoading || mutationPending) return <Loading />
    if (error) return <Error />
    if (cart.items.length === 0) {
        return (
            <>
                <NavigationControl /><br />
                <p className="cart" style={{ textAlign: "center" }} >Cart is empty</p>
            </>
        )
    };

    return (
        <>
            <NavigationControl />
            <div className="cart">
                <div className="cartContainer">
                    <h2>Cart</h2>

                    {cart?.items.map((item, i) => (
                        <CartItemCard key={i} item={item} />
                    ))}

                    <div className="cartSummery">
                        <p className="total"><span>Items ({cart.items.length}): </span><b>₹{cart?.totalAmount}</b></p>
                        <p className="total"><span>Estimated total: </span> <b>₹{cart?.totalAmount}</b></p>
                        <p style={{ color: "var(--primary-color)", fontSize: "12px" }}>Taxes & shipping calculated at checkout</p>
                        <br />
                        <button className="btn" onClick={checkOutHandler}>Checkout</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
