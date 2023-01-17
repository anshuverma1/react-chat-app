import React, { useContext } from 'react'
import Cam from '../img/cam.png'
import Add from '../img/add.png'
import More from '../img/more.png'
import Messages from '../components/Messages'
import Input from '../components/Input'
import { ChatContext } from '../context/ChatContext'

function Chat() {

  const { data } = useContext(ChatContext)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <div className='userInfo'>
          {data?.user?.displayName && <img src={data?.user?.photoURL} alt="" />}
          <span>{data?.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <img src={Cam} alt="camera icon" />
          <img src={Add} alt="add icon" />
          <img src={More} alt="more icon" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat