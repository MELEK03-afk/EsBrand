import React, { useState, useEffect } from 'react'
import ChangeComp from './ChangeComp'
import product from '../images/capuche.png'
import { Mail,Instagram,Shirt,X} from 'lucide-react';
import product2 from '../images/product-1.jpg'
import wtshirt from '../images/wtshirt-2.png'
import tshirtmanches from '../images/tshirt-manches-2.png'
import baskets from '../images/baskets-10.png'
import Accessories from '../images/Accessories.jpg'
import Hoodies from '../images/Hoodies.jpg'
import product5 from '../images/tshirt-manches-2.png'
import { Link, useNavigate } from 'react-router-dom';
import toast,{Toaster}  from 'react-hot-toast'
import axios from 'axios'

const HomeComp = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showcontact,setShowContact]=useState(false)
  const [showSpinner, setShowSpinner] = useState(true); // Spinner state
  localStorage.setItem('selecteMenu', 'Dashbord');
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const Subscribe = async () => {
    if (!email) {
      return toast.error("Email field is required")
    }
    
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address")
    }

    setIsSubscribing(true)
    try {
      const res = await axios.post('http://localhost:2025/api/Subscribe', {
        email,
      })
      
      if (res.status === 201) {                
        setEmail('')
        toast.success('Successfully Subscribed!')
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error occurred');
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleCardClick = (index) => {
    setSelectedCard(selectedCard === index ? null : index);
  };
  const navigate = useNavigate();

  const getCardWidth = (index) => {
    return selectedCard === index ? "29%" : "15%";
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='HomeComp' onClick={()=>setShowContact}>
      {showSpinner && (
        <div className="spinner-overlay">
          <div className="spinner" />
          <div className="spinner-message">
            Welcome! Please wait while we load your experience...
          </div>
        </div>
      )}
      <ChangeComp/>
      <div className="homediv-0">
        <div 
          className="selectCard" 
          style={{
            width: getCardWidth(0),
            cursor: "pointer", 
            transition: "width 0.6s ease"
          }}
          onMouseEnter={() => handleCardClick(0)}
          onMouseLeave={() => handleCardClick(null)}
        >
          <img src={Hoodies} style={{objectFit:'cover',width:"100%",borderRadius:"15px"}} alt="" />
        </div>
        <div 
          className="selectCard" 
          style={{
            width: getCardWidth(1),
            cursor: "pointer", 
            transition: "width 0.6s ease"
          }}
          onMouseEnter={() => handleCardClick(1)}
          onMouseLeave={() => handleCardClick(null)}
        >
          <img src={baskets} style={{objectFit:'cover',width:"100%",borderRadius:"15px"}} alt="" />
        </div>
        <div 
          className="selectCard" 
          style={{
            width: getCardWidth(2),
            cursor: "pointer", 
            transition: "width 0.6s ease"
          }}
          onMouseEnter={() => handleCardClick(2)}
          onMouseLeave={() => handleCardClick(null)}
        >
          <img src={Accessories} style={{objectFit:'cover',width:"100%",borderRadius:"15px"}} alt="" />
        </div>
        <div 
          className="selectCard" 
          style={{
            width: getCardWidth(3),
            cursor: "pointer", 
            transition: "width 0.6s ease"
          }}
          onMouseEnter={() => handleCardClick(3)}
          onMouseLeave={() => handleCardClick(null)}

        >
          <img src={wtshirt} style={{objectFit:'cover',width:"100%",borderRadius:"15px"}} alt="" />
        </div>
        <div 
          className="selectCard" 
          style={{
            width: getCardWidth(4),
            cursor: "pointer", 
            transition: "width 0.6s ease"
          }}
          onMouseEnter={() => handleCardClick(4)}
          onMouseLeave={() => handleCardClick(null)}

        >
          <img src={tshirtmanches} style={{objectFit:'cover',width:"100%",borderRadius:"15px"}} alt="" />
        </div>
      </div>
      
      {/* Subscribe Section */}
      <div className='Subscribe-section'>
        <Toaster/>
        <div className="Subscribe-content">
          <h2>Subscribe to our newletter</h2>
          <p>Stay informed about Es Brand's news, special offers and trends!</p>
          <form className="Subscribe-form" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              value={email}
              onChange={(e)=> setEmail(e.target.value)} 
              placeholder="Votre email" 
              required 
              disabled={isSubscribing}
            />
            <button 
              type="submit" 
              onClick={Subscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* About Section */}
      <div className='about-section'>
        <div className="about-content">
          <div className="about-text">
            <h2>About Es Brand</h2>
            <p>We are passionate about creating high-quality, stylish clothing that empowers individuals to express their unique personality. Our designs blend contemporary trends with timeless elegance, ensuring every piece becomes a staple in your wardrobe.</p>
            <div className="about-stats">
              <div className="stat">
                <h3>500+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Unique Designs</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Customer Support</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src={product5}  alt="About Es Brand" />
          </div>
        </div>
      </div>


      {/* Categories Section */}
      <div className='categories-section'>
        <div className="categories-header">
          <h2>Shop by Category</h2>
          <p>Find your perfect style</p>
        </div>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-image">
              <img src={Hoodies} alt="Hoodies" />
            </div>
            <div className="category-info">
              <h3>Hoodies</h3>
              <p>Comfortable & Stylish</p>
            </div>
          </div>
          <div className="category-card"  onClick={() => {
                    navigate(`/ProductU/Accessories`, {
                      state: {
                        parentCategoryId: '68865fd48aeb37d665ebb038',
                        subcategoryId: '688660178aeb37d665ebb056',
                        genre: 'men',
                      }
                    });
                  }}>
            <div className="category-image">
              <img src={product2} alt="T-Shirts" />
            </div>
            <div className="category-info">
              <h3>T-Shirts</h3>
              <p>Classic & Versatile</p>
            </div>
          </div>
          <div className="category-card"   
                    onClick={() => {
                    navigate(`/ProductU/Accessories`, {
                      state: {
                        parentCategoryId: '68865fdf8aeb37d665ebb042',
                        subcategoryId: '688a6c0d8d228dbe48cc2b2a',
                        genre: 'women',
                      }
                    });
                  }}
                  >
            <div className="category-image">
              <img  src={Accessories} alt="Accessories" />
            </div>
            <div className="category-info">
              <h3>Accessories</h3>
              <p>Complete Your Look</p>
            </div>
          </div>
        </div>
      </div>

      {showcontact && (
        <div className='Hcontact'>
          <X size={40} className="Xcontact" onClick={()=>setShowContact(false)} />
          <h1>Es</h1>
          <div style={{width:"100%",height:"80%",display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",bottom:"0"}}>
            <div className='Hcontact-1'>
              <h2>Contactez-nous</h2>
              <p>Having trouble with your order or need assistance? We're here to help! Whether you have questions about your purchase, need to report an issue, or want to make changes to your order, our team is ready to support you. Don't hesitate to reach out — we'd love to hear from you and ensure you have the best shopping experience!</p>
            </div>
            <div className='Hcontact-2'>
              <p>Email</p>
              <input type="text" placeholder='you@gmail.com'/>
              <p>Phone Number</p>
              <input type="text" placeholder='+216 '/>
              <p>Message</p>
              <textarea placeholder='Your Message' name="" id=""></textarea>
              <button className='send'>Send</button>
            </div>
          </div>
        </div>
      )}
      {/* <div className='homediv-2'>
        <div className="homediv-2-1">
          <h1>Redefine Your Style</h1>
          <p>Dive into our curated collection for modern women—elegant silhouettes,
          premium textures, and effortless layering pieces that inspire confidence every day.</p>
          <button>Expolre Now</button>
        </div>
        <div className="homediv-2-2">
        </div>
      </div> */}
      <div className='footer'>
        <div className="footer-container">
          <div className="footer-1">
            <h2>Es</h2>
              <div className="footer-copyright">
                &copy; {new Date().getFullYear()} Es. All rights reserved.
              </div>          </div>
          <div className="footer-1">
            <h3>Quick Links</h3>
            <Link className='footerLinks'>Shoop</Link>
            <Link onClick={()=>setShowContact(!showcontact)} className='footerLinks'>Contact</Link>
          </div>
          <div className="footer-1">
            <h3>Get in Touch</h3>
            <p className='getintouch'><span><Mail size={20} style={{position:"relative",top:"5px",right:"5px"}}/></span>meleksaket2003@gmail.com</p>
            <p className='getintouch'><span><Instagram  size={20} style={{position:"relative",top:"5px",right:"5px"}}/></span>esseketmelek</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeComp