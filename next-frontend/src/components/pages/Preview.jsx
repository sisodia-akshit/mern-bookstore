"use client";

import "../../styles/Checkout.css"
import { useRouter } from 'next/navigation';

import Loading from '../states/Loading';
import Error from '../states/Error';
import NavigationControl from '../ui/NavigationControl';
import { useCheckout } from '../../context/CheckoutContext';

function Preview() {
    const { preview, isLoading, error } = useCheckout();
    const router = useRouter()

    const nextButtonHandler = (e) => {
        router.push('/checkout/payment')
    }

    if (isLoading) return <Loading />
    if (error) return <Error />
    return (
        <>
            <NavigationControl />
            <br />
            <div className="preview">
                <div className="previewContainer">
                    <div className="previewCheckout">
                        <h2>Review</h2>
                        <br />
                        <p><b>Items total</b><span>₹{preview?.subTotal}</span></p>
                        <p><b>Discount</b><span>₹{preview?.discount}</span></p>
                        <p><b>Tax</b><span>₹{preview?.tax}</span></p>
                        <p><b>Shipping</b><span>₹{preview?.shippingFee}</span></p>
                    </div>
                    <p className='previewTotal'><b>Total payable</b><span>₹{preview?.totalAmount}</span></p>
                    <button className='btn' onClick={nextButtonHandler}>Next</button>
                </div>
            </div>
        </>
    )
}

export default Preview