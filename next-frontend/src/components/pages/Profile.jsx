"use client";

import Error from '../states/Error';
import Loading from '../states/Loading';
import { useAuth } from '../../context/AuthContext';
import "../../styles/User.css"

function Profile() {
    const { user, logout, error, isLoading } = useAuth();
    if (isLoading) return <Loading />
    if (error) return <Error error={error} />
    return (
        <div className='user'>
            <img src={user.photo ? user.photo : "https://res.cloudinary.com/dgpznnv1r/image/upload/v1768841024/books/fzyjghqjqyrztxhlzya9.webp"} alt="" height={120} />
            <br />
            <h3 style={{ color: "var(--primary-color)" }}>{user.name}</h3>
            <p style={{ color: "#555" }}>{user.email}</p>
            <br />
            <br />
            <button onClick={logout} className='btnLogout btn'>Logout</button>

        </div>
    )
}

export default Profile
