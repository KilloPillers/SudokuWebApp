import './Chatbox.css'
import React from 'react'

const ChatBody = ({messages, lastMessageRef}) => { 
  
  return (
    <>
      <div className='message__container'>
        {messages.map(message => (
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <div className='message__sender'>
                <p>{message.text}</p>
              </div>
            </div>
          ):(
            <div className="message__chats" key={message.id}>
              <div className='message__recipeient'>
                <p style={{marginLeft:"2px", fontSize: "12px"}}>{message.name}</p>
                <div className='message__recipient'>
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
          )
          ))}
        <div ref={lastMessageRef} />   
      </div>
    </>
  )
}

export default ChatBody