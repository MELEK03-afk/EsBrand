import React, { useState, useRef } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import {Link,useNavigate} from "react-router-dom"
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import EsL from '../images/Es4.png'
const ResetPasword = () => {
  const [Rest, setReset] = useState('Rest1')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ConfPassword, setConfPassword] = useState('')
  const [code, setCode] = useState(new Array(6).fill(''))
  const user = JSON.parse(localStorage.getItem('user'))
  const [serverCode, setServerCode] = useState('') // 👈 to store backend code

  const inputsRef = useRef([])

  // handle typing in code inputs
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
  const navigate=useNavigate()

      if (value && index < 5) {
        inputsRef.current[index + 1].focus()
      }
    }
  }

  // handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  // send email with reset code
  const ResetEmail = async () => {
    if (!email) {
      return toast.error('Email Required !!')
    }

    const find = await axios.post("http://localhost:2025/api/CheckEmail", {
        email,
    })

    if (find.status === 204) {
      return toast.error('Email Not exist !!')

    }
    
    setReset('Rest2')
    try {
      const res = await axios.post("http://localhost:2025/api/ResetEmail", {
        email,
      })

      const { code } = res.data
      if (code) {
        setServerCode(code) // 👈 save backend code
        setReset('Rest2')
      }
    } catch (error) {
      console.error("Error sending reset email:", error)
      toast.error("❌ Erreur lors de l’envoi du code")
    }
  }


  const NewPassword = async () => {
    if (password != ConfPassword) {
      return toast.error('❌ Password not matched')
    }
    try {
      const res = await axios.post(`http://localhost:2025/api/NewPassword`, {
        password,
        email
      })

      if (res.status === 200) {
        toast.success("✅ Password changet")
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
      if (res.status === 204) {
        toast.error("✅ Email Not Found")
        
      }


    } catch (error) {
      console.error("Error sending reset email:", error)
      toast.error("❌ Erreur lors de l’envoi du code")
    }
  }


  // check entered code
  const handleVerify = () => {
    const enteredCode = code.join('')
    if (enteredCode === serverCode) {
      toast.success("🔓 Code vérifié avec succès, créez un nouveau mot de passe.")
      setReset('Rest3') // go to new password form
    } else {
      toast.error("❌ Code incorrect !")
    }
  }

  const displayForm = () => {
    if (Rest === 'Rest1') {
      return (
        <div className='ResetP'>
          <div className='IconRest'>
            <Mail size={32} />
          </div>
          <h1>Forgot your password?</h1>
          <p>Enter your email to receive a reset link.</p>
          <h4>Adresse email</h4>
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='votreEmail@example.com' />
          <button onClick={ResetEmail}>
            Send the reset code
          </button>
          <Link to='/Seconnect' style={{textDecoration:"none"}}>
            <p id='Retour'><ArrowLeft /> Return to login</p>
          </Link>
        </div>
      )
    }

    if (Rest === 'Rest2') {
      return (
        <div className='ResetP' style={{ width: "49%" }}>
          <h1>Vérification en deux étapes</h1>
          <p>
            Un code de vérification a été envoyé à votre email <br />
            <span style={{ color: "#03F7EB" }}>{email}</span>.<br />
            Veuillez saisir ce code, il expirera dans 15 minutes.
          </p>

          <div className="CodeInputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="BtnGroup">
            <button onClick={() => (setReset('Rest1'),setEmail(''))} className="BackBtn">
              Retour
            </button>
            <button onClick={handleVerify} className="VerifyBtn">
              Vérifier
            </button>
          </div>
        </div>
      )
    }

    if (Rest === 'Rest3') {
      return (
        <div className='ResetP' style={{ width: "49%" }}>
          <h1>Créer un nouveau mot de passe</h1>
          <input style={{marginTop:"50px"}} type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Nouveau mot de passe" />
          <input style={{marginTop:"20px"}} type="password" onChange={(e)=>setConfPassword(e.target.value)} placeholder="Confirmer le mot de passe" />
          <button style={{marginTop:"20px"}} className="VerifyBtn" onClick={NewPassword}>Enregistrer</button>
        </div>
      )
    }
  }

  return (
    <div className='ResetPasword'>
      <Toaster />
      <img src={EsL} width={'70px'} height={'70px'} alt="" />
      {displayForm()}
    </div>
  )
}

export default ResetPasword
