import React, { useState, useEffect } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { CircleX,Mail,House ,Shirt,Lock,Phone  ,Eye  } from 'lucide-react';
import toast,{Toaster}  from 'react-hot-toast'
const SeConnect = () => {
    const [from, setForm] = useState(true)
    const [email,setEmail] = useState('')
    const [emailerror,setEmailError] = useState('')
    const [phoneNumber,setphoneNumber] = useState('')
    const [phoneError,setphoneNumberError] = useState('')
    const [password,setPassword] = useState('')
    const [showpassword,setShowPassword] = useState(false)
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
            return toast.error("All fields are require")
            
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setEmailError(<>Invalid Email <CircleX size={15} style={{position:'relative',top:"5px"}}/></>)
            
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
                    <div style={{ position: "relative", width: "100%" }}>
                        <Mail size={19} style={{ position: "absolute", left: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Es@gmail.com"
                            style={{
                            paddingLeft: "35px", // space for the icon
                            height: "40px",
                            width: "60%",
                            }}
                        />
                    </div>
                    {emailerror && <p id='errorP' style={{color: 'red', fontSize: '12px'}}>{emailerror}</p>}
                    <p>Phone Number</p>
                    <div style={{ position: "relative", width: "100%" }}>
                        <Phone  size={19} style={{ position: "absolute", left: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                        <input
                            type="email"
                            onChange={(e) => setphoneNumber(e.target.value)} 
                            placeholder="+216"
                            style={{
                            paddingLeft: "35px", // space for the icon
                            height: "40px",
                            width: "60%",
                            }}
                        />
                    </div>
                    {phoneError && <p id='errorP' style={{color: 'red', fontSize: '12px'}}>{phoneError}</p>}
                    <p>Password</p>
                    <div style={{ position: "relative", width: "100%" }}>
                        <Lock  size={19} style={{ position: "absolute", left: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                        <input
                            type={showpassword ?"text":"password"}
                            placeholder="*********"
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                            paddingLeft: "35px", // space for the icon
                            height: "40px",
                            width: "60%",
                            }}
                        />
                    <Eye  onClick={()=>setShowPassword(!showpassword)} size={19} style={{ cursor:"pointer",position: "absolute", right: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                    </div>  
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
                    <h1 style={{ marginTop: "4%" }}> Welcome Back</h1>
                    <h4>Sign in to continue to your account</h4>
                    <p>E-mail</p>
                    <div style={{ position: "relative", width: "100%" }}>
                        <Mail size={19} style={{ position: "absolute", left: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Es@gmail.com"
                            style={{
                            paddingLeft: "35px", // space for the icon
                            height: "40px",
                            width: "60%",
                            }}
                        />
                    </div>   
                    <p>Password</p>
                    <div style={{ position: "relative", width: "100%" }}>
                        <Lock  size={19} style={{ position: "absolute", left: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                        <input
                            type={showpassword ?"text":"password"}
                            placeholder="*********"
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                            paddingLeft: "35px", // space for the icon
                            height: "40px",
                            width: "60%",
                            }}
                        />
                        <Eye onClick={()=>setShowPassword(!showpassword)}  size={19} style={{cursor:"pointer", position: "absolute", right: "19%", top: "52%", transform: "translateY(-50%)", color: "gray" }} />
                    </div>  
                    <Link to='/ResetPassword' style={{textDecoration:"none",color:"black"}}>
                    <h4 id='Resetph4'>Forgot password?</h4>
                    </Link>                    
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
            <div className="SeConnect-1">
                <div class="pc-page">
                <div class="pc-wrap">
                    <div class="pc-card">
                    <p class="pc-prompt">
                        We are passionate about creating high-quality, stylish clothing that empowers individuals to express their unique personality
                    </p>

                    <div class="pc-controls">
                        <div class="pc-left">
                        <button class="pc-btn pc-btn-icon pc-plus" aria-label="add">+</button>

                        <div class="pc-tag">
                            <span class="pc-tag-icon">⚡</span>
                            <span class="pc-tag-text">Inspiration</span>
                            <span class="pc-tag-caret">▾</span>
                        </div>
                        </div>

                        <div class="pc-center">
                        <div class="pc-variant">Es 1.0</div>
                        </div>

                        <div class="pc-right">
                        <button class="pc-btn pc-btn-icon pc-mic" aria-label="mic"><Shirt/></button>
                        <button class="pc-send" aria-label="send">Es</button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="SeConnect-2">
                <House onClick={()=>navigate("/")} size={23}  strokeWidth={3} style={{position:"absolute",cursor:'pointer',top:"10px",right:"10px"}}/>
                <div key={from ? "sign-in" : "sign-up"} className="fade-in">
                    <Toaster/>
                    {DisplayForm()}
                </div>
            </div>
        </div>
    )
}

export default SeConnect