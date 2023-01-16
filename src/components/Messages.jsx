import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import Message from '../components/Message'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
function Messages() {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => unsub()
  }, [data.chatId])

  return (
    <div className='messages'>
      {messages.map((message)=>{
        return <Message message={message} key={message.id} />
      })}
    </div>
  )
}

export default Messages