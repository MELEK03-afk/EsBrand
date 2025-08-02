import React, { useState, useEffect } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { CircleX,Menu } from 'lucide-react';
import toast,{Toaster}  from 'react-hot-toast'
const SeConnect = () => {
    const [from, setForm] = useState(true)
    const [email,setEmail] = useState('')
    const [emailerror,setEmailError] = useState('')
    const [phoneNumber,setphoneNumber] = useState('')
    const [phoneError,setphoneNumberError] = useState('')
    const [password,setPassword] = useState('')
    const [passwordError,setPasswordError] = useState('')
    const navigate=useNavigate()
    function isNumber(phoneNumber) {
        var pattern = /^\d+\.?\d*$/;
        return pattern.test(phoneNumber);  // returns a boolean
    }
    const SignUP = async () => {
        var checkPhone = isNumber(phoneNumber)
        console.log(email);
        console.log(phoneNumber);
        console.log(password);
        
        if (!email || !phoneNumber || !password) {
            toast.error("All fields are require")
            
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError(<>Invalid Email <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)
            
        }
        if (!checkPhone) {
            setphoneNumberError(<>Invalid Phone Number <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)
            
        }
        if (password.length < 6) {
            setPasswordError(<>Invalid password <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)
            return
        }
        try {
            const res= await axios.post('http://localhost:2025/api/SignUp', {
                email,
                phoneNumber,
                password
            })
            console.log(res)
            
            if (res.status === 201) {
                console.log(res.data);
                
                toast.success('Welcome Account created')
                localStorage.setItem('user', JSON.stringify(res.data))
                setTimeout(() => {
                    navigate("/", { replace: true });
                    // Force a refresh to update the HeaderBar
                    window.location.reload();
                }, 1000);
                setEmail('')
                setPassword('')
                setphoneNumber('')
                // Clear errors after successful signup
                setEmailError('')
                setphoneNumberError('')
                setPasswordError('')
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Server error occurred');
        }
    }
    const SignIn = async()=>{
        if (!email  || !password) {
            toast.error("All fields are require")            
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError(<>Invalid Email <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)   
        }
        if (password.length < 6) {
            setPasswordError(<>Invalid password <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)
            return
        }
        try {
            const res= await axios.post('http://localhost:2025/api/SignIn', {
                email,
                phoneNumber,
                password
            })           
            if (res.status === 200) {
                toast.success('Welcome Back')
                localStorage.setItem('user', JSON.stringify(res.data))
                setTimeout(() => {
                    navigate("/", { replace: true });
                    // Force a refresh to update the HeaderBar
                    window.location.reload();
                }, 1000);
                setEmail('')
                setPassword('')
                setEmailError('')
                setPasswordError('')
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Server error occurred');
        }

    }
    const DisplayForm = () => {
        if (from === false) {
            return (
                <>
                    <h1 style={{ marginTop: "4%" }}>Welcome</h1>
                    <h4>Create your Account</h4>
                    <p>E-mail</p>
                    <input 
                        placeholder="you@gmail.com" 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="text" 
                        value={email}
                    />
                    {emailerror && <p id='errorP' style={{color: 'red', fontSize: '12px'}}>{emailerror}</p>}
                    <p>Phone Number</p>
                    <input 
                        placeholder="+216" 
                        type="text" 
                        onChange={(e) => setphoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                    {phoneError && <p id='errorP' style={{color: 'red', fontSize: '12px'}}>{phoneError}</p>}
                    <p>Password</p>
                    <input 
                        placeholder="• • • • • • • •" 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {passwordError && <p id='errorP' style={{color: 'red', fontSize: '12px'}}>{passwordError}</p>}
                    <button className='seconnectBt' onClick={SignUP}>Sign Up</button>
                    <h5 style={{ color: "rgb(184, 183, 183)" }}>
                        {from ? "You don't have Account?" : "Already have Account?"} 
                        <span style={{ cursor: "pointer", color: "black", textDecoration: "underline", fontWeight: "600" }} onClick={() => (setForm(!from),setEmail(''),setPassword(''),setphoneNumber(''))}>
                            {from ? 'Sign Up' : 'Sign In'}
                        </span>
                    </h5>
                </>
            )
        } else {
            return (
                <>
                    <h1 style={{ marginTop: "4%" }}>Welcome Back</h1>
                    <h4>Sign in to continue to your account</h4>
                    <p>E-mail</p>
                    <input placeholder="you@gmail.com"  onChange={(e) => setEmail(e.target.value)} type="text" name="" id="" />
                    <p>Password</p>
                    <input placeholder="• • • • • • • •" onChange={(e) => setPassword(e.target.value)} type="password" name="" id="" />
                    <button className='seconnectBt' onClick={SignIn}>Sign In</button>
                    <h5 style={{ color: "rgb(184, 183, 183)" }}>
                        {from ? "You don't have Account?" : "Already have Account?"} 
                        <span style={{ cursor: "pointer", color: "black", textDecoration: "underline", fontWeight: "600" }} onClick={() => (setForm(!from),setEmail(''),setPassword(''),setphoneNumber(''))}>
                            {from ? 'Sign Up' : 'Sign In'}
                        </span>
                    </h5>
                </>
            )
        }
    }

    return (
        <div className='SeConnect'>
            <div className="SeConnect-1"></div>
            <div className="SeConnect-2">
                <div key={from ? "sign-in" : "sign-up"} className="fade-in">
                    <Toaster/>
                    {DisplayForm()}
                </div>
            </div>
        </div>
    )
}

export default SeConnect