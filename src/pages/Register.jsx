import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

function Register() {

  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const [image, setImage] = useState()
  const [passwordValidate, setPasswordValidate] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setLoading(true)
    setErr(false)
    e.preventDefault()

    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const confirmPassword = e.target[3].value
    const file = e.target[4].files[0]

    if (!file) {
      setImgErr(true)
      setLoading(false)
      return
    }

    if(password !== confirmPassword){
      setPasswordValidate(true)
      setLoading(false)
      return
    }

    try {
      setPasswordValidate(false)
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          // Handle unsuccessful uploads
          setErr(true)
          setLoading(false)
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            })

            await setDoc(doc(db, 'userChats', res.user.uid), {})
            await signInWithEmailAndPassword(auth, email, password)
            setLoading(false)
            navigate('/')
          });
        }
      );
    } catch (error) {
      setErr(true)
      setLoading(false)
    }

  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chatty</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Name' required />
          <input type="email" placeholder='Email' required />
          <input type="password" placeholder='Password' required />
          <input type="password" placeholder='Confirm password' required />
          <input style={{ display: 'none' }} type="file" accept='image/*' id='file' onChange={(e) => { setImage(e.target.files[0]); setImgErr(false) }} />
          <label htmlFor="file">
            <img src={image ? URL.createObjectURL(image) : Add} alt="add an avatar" />
            <span>{image ? image?.name : 'Add an avatar'}{imgErr && <span style={{ color: 'red' }}> - Please select an avatar</span>}</span>
          </label>
          <button>
            {loading ? <span className="loading-icon"></span> : 'Sign Up'}
          </button>
          {err && <span style={{ color: 'red' }}>Something went wrong.</span>}
          {passwordValidate && <span style={{ color: 'red' }}>Password does't match confirm password!</span>}
        </form>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register