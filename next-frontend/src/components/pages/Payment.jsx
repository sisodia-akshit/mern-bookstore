"use client";

import "../../styles/Payment.css"
import React, { useState } from 'react'
import Link from "next/link";

import NavigationControl from '../ui/NavigationControl';
import NotificationCard from '../cards/NotificationCard';
import { useCheckout } from '../../context/CheckoutContext';
import { useAuth } from '../../context/AuthContext';
import { usePlaceOrderMutation } from "@/hooks/useMutation";

function Payment() {
    const { user } = useAuth();
    const { preview, selectedAddress } = useCheckout();

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isNotification, setNotification] = useState(false);

    let defaultAddress = selectedAddress;
    if (!defaultAddress) defaultAddress = user.addresses.filter((a) => a.isDefault === true)[0]

    const placeOrderMutation = usePlaceOrderMutation({ setNotification })

    const handlePlaceOrder = () => {
        placeOrderMutation.mutate({
            addressId: defaultAddress._id,
            paymentMethod
        })
    };
    return (
        <>
            {isNotification &&
                <NotificationCard setCard={setNotification} path={"/user"}>
                    <p>Congratulation!</p>
                    <p>Your order has been placed</p>
                </NotificationCard>
            }
            <NavigationControl />
            <br />
            <div className="checkout-page">
                <div className="checkout-container">

                    {/* Order Summary */}
                    <section className="checkout-section">
                        <h2>Order Summary</h2>

                        <SummaryRow label="Items total" value={`₹${preview?.subTotal}`} />
                        <SummaryRow label="Tax" value={`₹${preview?.tax}`} />
                        <SummaryRow label="Shipping" value={`₹${preview?.shippingFee}`} />
                        <SummaryRow label="Total payable" value={`₹${preview?.totalAmount}`} bold />
                    </section>

                    {/* Address */}
                    <section className="checkout-section">
                        <h2>Delivery Address</h2>

                        <div className="address-box">
                            <p><strong>{defaultAddress?.name}</strong></p>
                            <p>{defaultAddress?.line1}, {defaultAddress?.line2}</p>
                            <p>{defaultAddress?.city}, {defaultAddress?.pincode}</p>
                            <p>{defaultAddress?.state}, {defaultAddress?.country}</p>
                            <p>📞 {defaultAddress?.phone}</p>
                            <Link href={"/checkout/address"}>Change address</Link>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="checkout-section">
                        <h2>Payment Method</h2>

                        <label className="radio-option">
                            <input
                                type="radio"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                            />
                            Cash on Delivery
                        </label>

                        <label className="radio-option disabled">
                            <input type="radio" disabled />
                            UPI (Coming soon)
                        </label>

                        <label className="radio-option disabled">
                            <input type="radio" disabled />
                            Card (Coming soon)
                        </label>

                        <p className="note">
                            * Online payments will be available soon
                        </p>
                    </section>

                    {placeOrderMutation.error && <><p style={{ color: "red", textAlign: "center" }}>{placeOrderMutation.error.message}</p> <br /> </>}

                    {/* Place Order */}
                    <button
                        className="place-order-btn"
                        disabled={placeOrderMutation.isPending}
                        onClick={handlePlaceOrder}
                    >
                        {placeOrderMutation.isPending ? "Placing order..." : "Place Order"}
                    </button>

                </div>
            </div>

        </>
    )
}

function SummaryRow({ label, value, bold }) {
    return (
        <div className={`summary-row ${bold ? "bold" : ""}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

export default Payment