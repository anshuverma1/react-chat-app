import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

function Message({ message }) {

  const currentUser = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:'smooth'})
  },[message])

  const time = new Date(message.date * 1000).toLocaleString().slice(11)
  const t1 = time.substring(0,4) //extracted time
  const t2 = time.slice(7)       // extracted am, pm

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>{t1}{t2}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message