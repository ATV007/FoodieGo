// src/components/loginPopup/LoginPopup.jsx
import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from './../context/StoreContext';
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken, setUser} = useContext(StoreContext) // setUser added

    const [currentState, setCurrentState] = useState('Login')
    const [data, setData] = useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name
        const value = event.target.value 
        setData(data=>({...data,[name]:value}))
    }

   const onLogin = async (event) =>{
        event.preventDefault()
        let newUrl = url;
        if(currentState==='Login'){
            newUrl+= "/api/user/login"
        }else{
            newUrl += "/api/user/register"
        }

        try {
          const response = await axios.post(newUrl, data);

          // EXPECTED: response.data => { success: true, token: "...", user: { _id, name, email } }
          if(response.data.success){
              const token = response.data.token;
              setToken(token);
              localStorage.setItem("token", token);

              // If backend returns user object — store it
              if(response.data.user){
                const user = response.data.user;
                setUser(user);
                localStorage.setItem("userId", user._id);
                localStorage.setItem("userName", user.name || "");
              } else {
                // fallback: try to fetch user profile with token (see fallback section)
                try {
                  const profileRes = await axios.get(url + "/api/user/me", { headers: { token }});
                  if(profileRes.data && profileRes.data.user){
                    setUser(profileRes.data.user);
                    localStorage.setItem("userId", profileRes.data.user._id);
                    localStorage.setItem("userName", profileRes.data.user.name || "");
                  }
                } catch (e) {
                  console.warn("Could not fetch user profile after login", e);
                }
              }

              setShowLogin(false);
          } else {
              alert(response.data.message || "Login/Register failed");
          }
        } catch (err) {
          console.error("Login error", err);
          alert("Login failed — check console for details");
        }
   }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currentState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currentState==='Login'?<></>: <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
               
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>

            <button type='submit'>{currentState==='Sign Up'?'Create account':'Login'}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing, I agree to the terms of use & privacy policy</p>
            </div>
            {currentState==='Login'?
             <p>Create a new account? <span onClick={()=> setCurrentState('Sign Up')}>Click here</span></p>
             :<p>Already have an account? <span onClick={()=> setCurrentState('Login')}>Login here</span></p>}
        </form>
    </div>
  )
}

export default LoginPopup
