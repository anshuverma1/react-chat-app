import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

function Login() {

  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true)
    setErr(false)
    e.preventDefault()

    const email = e.target[0].value
    const password = e.target[1].value

    try {

      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)
      navigate('/')

    } catch (error) {
      setLoading(false)
      setErr(true)
    }

  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chatty</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder='Email' required/>
          <input type="password" placeholder='Password' required/>
          <button>
            {loading ? <span className="loading-icon"></span> : 'Login'}
          </button>
          {err && <span style={{color:'red'}}>Incorrect username or password.</span>}
        </form>
        <p>Don't have an account? <Link to='/register'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login