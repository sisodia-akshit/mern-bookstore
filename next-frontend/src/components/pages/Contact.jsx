"use client";

import "../../styles/Contact.css"
import { useState } from 'react';

import NotificationCard from '../cards/NotificationCard';
import Input from '../ui/Input';
import NavigationControl from '../ui/NavigationControl';
import { useContactMutation } from "@/hooks/useMutation";

function Contact() {
    const [name, setName] = useState("")
    // const [secondName, setSName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState(undefined)
    const [message, setMessage] = useState("")
    const [isMessage, setIsMessage] = useState(false)

    const contactMutation = useContactMutation({ setIsMessage, setName, setMessage })
    
    const emailFormHandler = (e) => {
        e.preventDefault();
        contactMutation.mutate({
            name,
            message
        })
    }
    return (
        <>
            <NavigationControl />
            <br />
            <div className="contact">
                <h1 style={{ textAlign: "center" }}>Get In Touch With Our BookStore Team</h1>
                <br />
                {isMessage && <NotificationCard setCard={setIsMessage} ><p>Message sent Successfully.</p></NotificationCard>}
                <form className='contactMe' onSubmit={emailFormHandler} >
                    <h2 style={{ color: "#555" }}>Contact</h2>
                    <div className="grid">
                        <Input type={"text"} name={"name"} placeholder={"First Name"} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
                        {/* <Input type={"text"} name={"name"} placeholder={"Second Name"} value={secondName} onChange={(e) => setSName(e.target.value)} maxLength={40} /> */}
                        <Input type={"tel"} name={"phone"} placeholder={"Phone"} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
                    </div>
                    <div className="grid">
                        <Input type={"email"} name={"email"} placeholder={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={40} />
                    </div>

                    <br />
                    <textarea
                        required
                        placeholder='Message'
                        className='contectMessage'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <p className='messageLength'>{message.length}/2000</p>
                    <br />
                    {contactMutation.error && (
                        <><p style={{ color: "red", margin: "0px auto" }}>{contactMutation.error.message}</p><br /></>
                    )}
                    <button type='submit' disabled={contactMutation.isPending}>{contactMutation.isPending ? "Sending" : "Send"}</button>
                </form>
            </div>
        </>
    )
}

export default Contact