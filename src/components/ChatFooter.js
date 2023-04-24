import React, {useState} from 'react'

const ChatFooter = ({socket, roomId}) => {
    const [message, setMessage] = useState("")

    const handleSendMessage = (e) => {
        e.preventDefault()
        console.log("TESTING no trim: ", roomId)
        if (message.trim() && localStorage.getItem("userName")) {
            console.log("TEST: ", roomId)
            socket.emit("message", {
                text: message, 
                name: localStorage.getItem("userName"), 
                roomId: roomId,
            })}
            setMessage("")
    }

    return (
        <div className='chat__footer'>
            <form className='form' onSubmit={handleSendMessage}>
            <input 
                type="text" 
                placeholder='Write message' 
                className='message' 
                value={message} 
                onChange={e => setMessage(e.target.value)}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    )
}

export default ChatFooter