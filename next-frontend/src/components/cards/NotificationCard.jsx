import { useRouter } from "next/navigation";

function NotificationCard({ children, setCard, path }) {
    const router = useRouter();

    const buttonHandler = (e) => {
        setCard(false)
        if(path)
        router.push(path)
    }
    return (
        <div className="notificationCardContainer backdrop">
            <div className="notificationcard">
                <h2>Notification</h2>
                <br />
                {children}
                <button className='btn' onClick={buttonHandler}>OK</button>
            </div>
        </div>
    )
}

export default NotificationCard