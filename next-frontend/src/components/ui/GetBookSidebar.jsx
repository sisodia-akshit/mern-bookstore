import { useRouter} from "next/navigation";

import { useCart } from "../../context/CartContext";
import "../../styles/GetBookSidebar.css"
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationCard from "../cards/NotificationCard";
import QuantityButton from "../ui/QuantityButton";

function GetBookSidebar({ book, onClose }) {
    const { user } = useAuth();
    const { cart, addToCart, mutationPending, mutationError } = useCart();
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [isLogged, setLogged] = useState(false);

    const addToCartHandler = (e) => {
        if (!user) {
            setLogged(true)
            return
        }

        addToCart({ book, quantity })
        onClose(false)
    }
    const buyNowHandler = (e) => {
        if (!user) {
            setLogged(true)
            return
        }
        addToCart({ book, quantity })
        router.push("/cart")
    }
    let stock = book.stock;
    const InCart = cart.items.filter(item => item.book._id === book._id)[0]
    if(InCart){
        stock -= InCart.quantity;
    }

    return (
        <div className="getBookSidebar">
            {isLogged && <NotificationCard setCard={setLogged} path={"/login"}>
                <p>Please Log in to Purchase</p>
            </NotificationCard>}
            <div className="getBookSidebarMain">
                <div className="getBookSidebarDetails">

                    <span className="getBookSidebarClose" onClick={e => onClose(false)}><i className="fa-solid fa-xmark"></i></span>
                    <img src={book.coverImage} alt={book.title} height={100} />
                    <h3 style={{ textTransform: "capitalize", color: "var(--primary-color" }} >{book.title}</h3>
                    <div className="SBookAuthor" style={{ display: "flex" }}>
                        <p>{book.author}</p>&nbsp;&nbsp;
                        <i className="fa-solid fa-pen"></i>
                    </div>
                    <div className="SBookPrice">₹{book.price}</div>
                    <div >
                        <br />
                        <b>Quantity</b>
                        <br />
                        <QuantityButton quantity={quantity} setQuantity={setQuantity} stock={stock} />
                    </div >
                    <br />
                    <p><b>Available Stock:</b> {stock}</p>
                    <p><b>Seller:</b> {book?.createdBy?.name ?? "N/A"}</p>
                    <p><b>Category: </b>{book.category}</p>
                    <p><b>Genre: </b>{book.genres.map((g, i) => <span key={i}>{g}, </span>)}</p>
                    <br />
                    <div>{book.description}</div>
                </div>


                {mutationError && <p>{mutationError.message}</p>}
                <div className="getBookSidebarButtons">
                    <button className='btn' onClick={buyNowHandler} disabled={mutationPending || stock === 0} >{mutationPending ? "Buying" : "Buy Now"}</button>
                    <button className='btn' onClick={addToCartHandler} disabled={mutationPending || stock === 0}>{mutationPending ? "Updating Cart" : "Add to Cart"}</button>
                </div>
            </div>
        </div >
    )
}

export default GetBookSidebar