import React, { useContext, useState } from 'react'
import Img from '../img/img.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

function Input() {

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const id = uuid()

  const currentUser = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async (e) => {
    e.preventDefault()
    setText('')
    if (image) {
      const storageRef = ref(storage, id)
      const uploadTask = uploadBytesResumable(storageRef, image)

      uploadTask.on(
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id,
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              })
            })
          });
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id,
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp()
    })
    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp()
    })
    setImage(null)
  }

  return (
    <form onSubmit={handleSend}>
      <div className='input'>
        <input type="text" placeholder='Type something...' value={text} onChange={e => setText(e.target.value)} />
        <div className="send">
          <input type="file" id="file" style={{ display: 'none' }} onChange={e => setImage(e.target.files[0])} />
          <label htmlFor="file">
            <img src={Img} alt="upload icon" />
          </label>
          <button>Send</button>
        </div>
      </div>
    </form>
  )
}

export default Input