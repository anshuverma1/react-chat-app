import React from 'react'
import Add from '../img/addAvatar.png'

function Login() {
  return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">Chatty</span>
            <span className="title">Login</span>
            <form>
                <input type="email" placeholder='Email' />
                <input type="password" placeholder='Password' />
                <button>Login</button>
            </form>
            <p>Don't have an account? Sign up</p>
        </div>
    </div>
  )
}

export default Login