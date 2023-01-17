import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
export const Chats = () => {

    const [chats, setChats] = useState([])
    const currentUser = useContext(AuthContext)
    const { dispatch } = useContext(ChatContext)

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                setChats(doc.data())
            });

            return () => unsub()
        }

        currentUser.uid && getChats()
    }, [currentUser.uid])

    const handleSelect = (userInfo) => {
        dispatch({
            type: 'CHANGE_USER',
            payload: userInfo
        })
    }
    return (
        <div className='chats'>
            {Object.entries(chats)?.sort((a,b)=> b[1].date - a[1].date).map((chat) => {
                const time = new Date(chat[1].date * 1000).toLocaleString().slice(11)
                const t1 = time.substring(0,4) //extracted time
                const t2 = time.slice(7)       // extracted am, pm
                return (
                    <div className="userChat" key={chat[0]} onClick={()=> handleSelect(chat[1].userInfo)}>
                        <img src={chat[1].userInfo.photoURL} alt="" />
                        <div className="userChatInfo">
                            <span>{chat[1].userInfo.displayName}</span>
                            <p>{chat[1].lastMessage?.text}</p>
                        </div>
                        <span className='time'>{t1}{t2}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Chats