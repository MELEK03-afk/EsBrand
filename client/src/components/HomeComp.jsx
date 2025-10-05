import React, { useState, useEffect } from 'react'
import ChangeComp from './ChangeComp'
import product from '../images/capuche.png'
import { Instagram,Shirt,X ,Smartphone,CircleCheckBig ,Search,Bolt,BookOpen,Trophy,Mail,MapPin,Phone,Clock ,ArrowRight} from 'lucide-react';
import product2 from '../images/product-1.jpg'
import wtshirt from '../images/wtshirt-2.png'
import tshirtmanches from '../images/tshirt-manches-2.png'
import baskets from '../images/baskets-10.png'
import Accessories from '../images/Accessories.jpg'
import Hoodies from '../images/Hoodies.jpg'
import product5 from '../images/ES2.png'
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
  const [Products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [nom, setNom] = useState("");

  const navigate = useNavigate();

const sendMail = async () => {
  console.log(phone, email, message, subject);

  if (!isValid()) {
    toast.error("All fields are required");
    return;
  }

  if (!isNumber(phone)) {
    toast.error("Invalid phone number");
    return;
  }

  if (phone.length !== 8) {
    toast.error("Phone number must be 8 digits long");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Invalid email address");
    return;
  }
  
  // API call
  try {
    const res = await axios.post("http://localhost:2025/api/Contactez-nous", {
      name,
      subject,
      email,
      message,
      phone,
    });

    if (res.status === 200) {
      toast.success("Message sent successfully ✅");
      console.log("Message sent successfully");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message ❌");
  }
};

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:2025/api/GetProduct");
       const featuredProducts = res.data
        .filter(p => p.isFeatured)
        .slice(0, 4);
       setProducts(featuredProducts);
      
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

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

  const getCardWidth = (index) => {
    return selectedCard === index ? "40%" : "15%";
  };
  useEffect(() => {
    if (showcontact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showcontact]);

  useEffect(() => {
    getProducts()
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
        {/* <div 
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
        </div> */}
        {Products.slice(0, 4).map((prod, index) => (
          <div 
            key={prod._id}
            className="selectCard"
            style={{
              width: getCardWidth(index),
              cursor: "pointer",
              transition: "width 0.6s ease"
            }}
            onClick={()=>navigate(`/PorductSelecte/${prod._id}`, {
                        state: {
                          parentCategoryId: prod.categoryId,
                          subcategoryId: prod.subcategoryId,
                          genre: prod.genre,
                        }})}
            onMouseEnter={() => handleCardClick(index)}
            onMouseLeave={() => handleCardClick(null)}
          >
            <img 
              src={`http://localhost:2025/${prod.images?.[0]?.urls?.[0]}`} 
              alt={prod.name} 
              style={{ objectFit: 'cover', width: "100%", borderRadius: "15px" }}
            />
          </div>
        ))}

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
        <div className={`divcontactHome`} >
        <Toaster/>
          <div style={{width:"100%",height:"100%",zIndex:"222",paddingBottom:'39%'}}>
          <ArrowRight size={30} onClick={()=>setShowContact(false)} style={{color:"white",cursor:"pointer",position:"absolute",top:"10px",left:"97%"}}/>
            <h1>Contact-<span style={{color:"#03F7EB"}}>us</span></h1>
            <p>Join our Sport Booking partner network and make your pitch easily accessible – we’d love to hear from you!</p>
            <div style={{display:"flex",justifyContent:"center",gap:"5%"}}>
              <div className='InformationsContact'>
                <h1> <Mail color='#03F7EB'/> Information de contact</h1>
                <h2> <MapPin size={19} color='#03F7EB'/> Adresse</h2>
                <p>123 Avenue du Sport</p>
                <p>75001 Paris, France</p>
                <h2> <Phone size={19} color='#03F7EB'/> Telephone</h2>
                <p>+216 99993286</p>
                <h2> <Mail size={19} color='#03F7EB'/> Email</h2>
                <p>KickOff@gmail.com</p>
                <h2> <Clock size={19} color='#03F7EB'/> Hours of operation</h2>
                <p>Lun - Ven: 8h00 - 01h00</p>
              </div>
              <div className='InformationsContact' style={{height:"660px"}}>
                <h3>Send us a message</h3>
                <div className='FormContact'>
                  <div style={{marginLeft:"4%"}}>
                    <h4>Full name </h4>
                    <input type="text" onChange={(e)=>setName(e.target.value)} placeholder='your name' name="" id="" />
                  </div>
                  <div style={{marginLeft:"4%"}}>
                    <h4>Telephone </h4>
                    <input type="text" onChange={(e)=>setPhone(e.target.value)} name="" placeholder="+216 99993286" />
                  </div>
                </div>
                <div className='FormContact'>
                  <div style={{marginLeft:"4%"}}>
                    <h4>Email</h4>
                    <input style={{width:"501px",height:"39px"}} onChange={(e)=>setEmail(e.target.value)} placeholder='voter@email.com' type="text" name="" id="" />
                  </div>
                </div>
                <div className='FormContact'>
                  <div style={{marginLeft:"4%"}}>
                    <h4>subject</h4>
                    <input style={{width:"501px",height:"39px"}} onChange={(e)=>setsubject(e.target.value)} placeholder='voter@email.com' type="text" name="" id="" />
                  </div>
                </div>
                <div className='FormContact'>
                  <div style={{marginLeft:"4%"}}>
                    <h4>Message</h4>
                    <textarea name="" onChange={(e)=>setMessage(e.target.value)} placeholder="Message..."></textarea>
                  </div>
                </div>
                <button onClick={sendMail}><Mail size={17}/> Send Message</button>
              </div>
            </div>
            <div className='rejoindre'>
              <h1>Why join us?</h1>
              <h3><CircleCheckBig size={19} color='#03F7EB'/> Increase the visibility of your land</h3>
              <h3><CircleCheckBig size={19} color='#03F7EB'/> Simplified reservation management</h3>
              <h3><CircleCheckBig size={19} color='#03F7EB'/> Dedicated technical support</h3>
              <h3><CircleCheckBig size={19} color='#03F7EB'/> Attractive commission</h3>
              <h3><CircleCheckBig size={19} color='#03F7EB'/> Automated secure payments</h3>
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