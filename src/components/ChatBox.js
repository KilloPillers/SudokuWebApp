import React, { useEffect, useState, useRef} from 'react'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatBox = ({socket, roomId}) => { 
  const [messages, setMessages] = useState([])
  const lastMessageRef = useRef(null);

  useEffect(()=> {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data])
    })
  }, [socket, messages])

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className="chat">
      <div className='chat__main'>
        <header className='chat__mainHeader'>
            <p style={{textAlign:"center", background: "lightskyblue", fontSize: "20px"}}>Room Chat</p>
        </header>
        <ChatBody messages={messages} lastMessageRef={lastMessageRef}/>
        <ChatFooter socket={socket} roomId={roomId}/>
      </div>
    </div>
  )
}

export default ChatBox