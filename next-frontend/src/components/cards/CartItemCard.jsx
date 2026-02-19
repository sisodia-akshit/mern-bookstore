import { useCart } from '../../context/CartContext'
import "../../styles/CartItemCard.css"
import QuantityButton from '../ui/QuantityButton';

function CartItemCard({ item }) {
    const { removeFromCart, updateCart, mutationPending } = useCart();
    const updateQtyHandler = (quantity) => {
        updateCart({
            book: item.book._id,
            quantity
        })
    }
    return (
        <div className='cartItemCard' >
            <img src={item.coverImage} alt={item.book.title} height={120} width={120} />

            <div className="info">
                <div className="CITitle">
                    <h3 style={{ color: "var(--primary-color)" }}>{item.book.title}</h3>
                    <h5 style={{ color: "#888" }}>{item.book.author}</h5>
                </div>
                {!mutationPending && <QuantityButton quantity={item.quantity} stock={item.book.stock} setQuantity={updateQtyHandler} />}
            </div>
            <div className="price">
                <p style={{ color: "var(--primary-color)" }}>₹{item.lineTotal}</p>
            </div>

            <button onClick={() => removeFromCart(item.book._id)}><i className="fa-regular fa-circle-xmark"></i></button>
        </div>
    )
}

export default CartItemCard