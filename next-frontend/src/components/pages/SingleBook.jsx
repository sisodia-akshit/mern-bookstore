"use client";

import "../../styles/SingleBook.css"
import StarRating from '../ui/StarRating';
import BookLoading from '../states/BookLoading';
import Error from '../states/Error';
import { useState } from 'react';
import ReviewModel from '../models/ReviewModel';
import StarLine from '../ui/StarLine';
import ReviewComment from '../ui/ReviewComment';
import BookCard from '../cards/BookCard';
import NavigationControl from '../ui/NavigationControl';
import GetBookSidebar from '../ui/GetBookSidebar';
import Notification from '../states/Notification';
import { useCart } from '../../context/CartContext';
import { useProduct, useProductCategory } from "@/hooks/useInventory";

function SingleBook({ id }) {
    const { toast } = useCart();

    const [GetNow, setGetNow] = useState(false);
    const [isOpen, setOpen] = useState(false)

    //Get Book by Id
    const { data, isLoading, error } = useProduct({ id })
    const book = data?.data ?? {};
    const hasPurchased = data?.hasPurchased ?? false;
    const category = data?.data?.category;

    // Similar books (same Category)
    const response = useProductCategory({ category })
    const books = response?.data?.data ?? [];

    const getNowButtonHandler = (e) => {
        setGetNow(true)
    }

    if (isLoading) return <BookLoading />
    if (error) return <Error error={error} />

    return (
        <>
            {toast && <Notification message={toast} />}
            <NavigationControl />
            {GetNow && <GetBookSidebar book={book} onClose={setGetNow} />}
            <br />
            <ReviewModel isOpen={isOpen} onClose={(e) => setOpen(false)} id={id} />

            <div className="singleBookMain">
                {/* <h2 style={{ margin: "0 20px" }}>Book</h2> */}
                <div className="singleBookTop">
                    <span className="Availability" style={{ backgroundColor: book.stock > 0 ? "var(--success-color)" : "var(--error-color)" }}>{book.stock > 0 ? "Available" : "N/A"}</span>
                    <img src={book.coverImage} alt={book.title} />
                    <div className="SBookTopInfo">

                        <h2 className='singleBookTitle' >{book.title}</h2>
                        <div className="SBookAuthor">
                            <p>{book.author}</p>&nbsp;&nbsp;
                            <i className="fa-solid fa-pen"></i>
                        </div>
                        <div className="SBookPrice">
                            <p>₹{book.price}</p>
                        </div>
                        <p className='SBookDescription'>
                            {book.description}
                        </p>
                        {book.stock > 0 && <div className="SBookButtons">
                            <button className='btn' onClick={getNowButtonHandler}>Get&nbsp;Now&nbsp;!!</button>
                        </div>}

                    </div>
                </div>
                <div className="bookInfo">
                    <div className="bookInfoTop">
                        <h2>Details</h2>
                        <div className="productRating"><span style={{ whiteSpace: 'nowrap' }}><b style={{ color: '#555' }}>{book.ratings} </b> * | {book?.reviews?.length} Ratings</span></div>

                    </div>
                    <hr />
                    <p><b>Book : </b>{book.title}</p>
                    <p><b>Author : </b>{book.author}</p>
                    <p><b>Available Stock : </b>{book.stock}</p>
                    <p><b>Price : </b>₹{book.price}</p>
                    <p><b>Language : </b>{book.language}</p>
                    <p><b>Category : </b>{book.category}</p>
                    <p className='genres'>
                        <b>Genres   : </b>
                        {book.genres?.map((curr, i) => {
                            return <span key={i}>{curr}, </span>
                        })}
                    </p>
                    <p style={{ textAlign: 'justify' }} className='SBookDescription'><b>Description : </b>"{book.description}"</p>

                </div>

                <div className="RatingsAndReviews">
                    <div className="reviewAndRatingLeft">
                        <h1>{book.ratings?.toFixed(1)}</h1>
                        <StarRating ratings={book.ratings} />
                        <br />
                        <p>{book.reviews?.length} reviews</p>
                    </div>
                    <div className="reviewAndRatingRight">
                        {book?.reviews &&
                            [5, 4, 3, 2, 1].map((r) => {
                                return <StarLine key={r} number={r} reviews={book?.reviews?.filter(curr => curr.rating === r ?? curr)} totalReviews={book?.reviews?.length} />
                            })
                        }
                        <br />
                        {hasPurchased && <button className='btn' onClick={(e) => setOpen(true)}>Write a Review</button>}
                    </div>

                </div>
                <div className="customerReviews">
                    {book.reviews?.map((curr) => {
                        return (
                            <ReviewComment key={curr.id} review={curr} />
                        )
                    })}
                </div>
            </div>
            <h3 style={{ margin: "0 10px" }}>You might like</h3>
            <br />
            <div className="bookContainer">
                {books.map((book, i) => (
                    <BookCard key={i} book={book} />
                ))}
            </div>

        </>
    )
}

export default SingleBook