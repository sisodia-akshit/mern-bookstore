import React from 'react'
import "../styles/Chat.css"

function LoadChat({ data, user }) {
    return (
        <div className='chatMessage' style={data?.user?._id === user?._id ? { maxWidth: "100%", textAlign: 'right' } : {}}>
            {(data?.user?._id !== user?._id) && <span>{data.user.name}</span>}
            <p style={(data?.user?._id === user?._id) ? { backgroundColor: "var(--chat-color)" } : {}}>{data.message}</p>
        </div>
    )
}

export default LoadChat