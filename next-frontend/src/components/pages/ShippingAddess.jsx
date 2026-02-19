"use client";

import "../../styles/ShippingAddress.css"
import { useState } from "react"
import { useRouter } from "next/navigation";

import Input from "../ui/Input"
import AddressCard from "../cards/AddressCard"
import NavigationControl from "../ui/NavigationControl"
import Loading from "../states/Loading"
import { useAuth } from "../../context/AuthContext"
import { useCheckout } from "../../context/CheckoutContext"

function ShippingAddess() {
    const { user, isLoading } = useAuth();
    const { userAddresses, addNewAddress, setDefaultAddressHandler, isPending, mutationError } = useCheckout();

    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("India");
    const [open, setOpen] = useState(user?.addresses.length === 0 || false);

    const addressFormHandler = (e) => {
        e.preventDefault();
        const address = {
            name,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
            country
        }
        addNewAddress(address)
    }

    const addressClickedHandler = (address) => {
        setOpen(false)
        setDefaultAddressHandler(address)
    }

    const continueClickedHandler = (e) => {
        e.preventDefault();
        router.push("/checkout/review")
    }
    if (isPending || isLoading) return <Loading />

    const addresses = userAddresses || user.addresses;
    return (
        <>
            <NavigationControl />
            <div className="shippingAddresses">
                <div className="shippingAddressContainer">
                    <h2>Delivery Address</h2>
                    <br />
                    {(addresses && addresses?.length > 0) &&
                        <>
                            <div className="dbAddresses">
                                <h3 style={{ color: "#555" }}>Continue with</h3>
                                {addresses?.map(address => {
                                    return (
                                        <AddressCard key={address._id} address={address} onClick={addressClickedHandler} />
                                    )
                                })}
                                <button className="btn" onClick={continueClickedHandler}>Continue</button>
                                <p style={{ textAlign: "center", color: "#555" }}>or</p>
                                {!open && <button className="btn" onClick={(e) => setOpen(true)}>Add new</button>}
                            </div>
                        </>
                    }
                    {(open || !(addresses && addresses.length > 0)) &&
                        <form className="shippingAddress" onSubmit={addressFormHandler}>
                            <h3 style={{ color: "#555" }}>Add Address</h3>
                            <Input type={"text"} placeholder={"Full Name"} value={name} onChange={(e) => setName(e.target.value)} />
                            <Input type={"tel"} placeholder={"Phone"} value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <Input type={"text"} placeholder={"Building / Street / Landmark"} value={line1} onChange={(e) => setLine1(e.target.value)} />
                            <Input type={"text"} placeholder={"Area / Village / locality"} value={line2} onChange={(e) => setLine2(e.target.value)} />
                            <br />
                            <select value={country} onChange={e => setCountry(e.target.value)}>
                                <option value="india">India</option>
                            </select>

                            <div className="flex">
                                <Input type={"text"} placeholder={"State"} value={state} onChange={(e) => setState(e.target.value)} />
                                <div className="pinCode">
                                    <Input type={"text"} placeholder={"Pincode"} value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                </div>
                            </div>
                            <Input type={"text"} placeholder={"City"} value={city} onChange={(e) => setCity(e.target.value)} />
                            <br />
                            {mutationError && <p style={{ color: "red" }}>{mutationError.response.data.message}</p>}
                            <button type="submit" className={"btn"} disabled={isPending}>
                                {isPending ? "Saving..." : "Next"}
                            </button>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}

export default ShippingAddess