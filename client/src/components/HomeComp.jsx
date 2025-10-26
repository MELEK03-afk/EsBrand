import React, { useState, useEffect } from 'react'
import ChangeComp from './ChangeComp'
import product from '../images/capuche.png'
import { Instagram,Shirt,X ,Smartphone,CircleCheckBig ,Search,Bolt,BookOpen,Trophy,Mail,MapPin,Phone,Clock ,ArrowRight} from 'lucide-react';
import product2 from '../images/product-32-0.png'
import Accessories from '../images/stoush.jpg'
import veste from '../images/vetment/product-28-3.jpg.png'
import pontalon from '../images/vetment/pontalon-6-0.png'
import product5 from '../images/vetment/product-30-1.jpg.png'
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
    const res = await axios.post("http://192.168.1.17:2025/api/Contactez-nous", {
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
      const res = await axios.get("http://192.168.1.17:2025/api/GetProduct");
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
      const res = await axios.post('http://192.168.1.17:2025/api/Subscribe', {
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
    return selectedCard === index ? "36%" : "15%";
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

        {Products.slice(0, 4).map((prod, index) => {
          // ✅ FIX only this line
          const imagePath = prod?.images?.[0]?.urls?.[0]?.replace(/\\/g, "/");

          return (
            <div 
              key={prod._id}
              className="selectCard"
              style={{
                backgroundImage: `url("http://192.168.1.17:2025/${imagePath}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: getCardWidth(index), // ✅ unchanged
                cursor: "pointer"
              }}
              onClick={() => navigate(`/PorductSelecte/${prod._id}`, {
                state: {
                  parentCategoryId: prod.categoryId,
                  subcategoryId: prod.subcategoryId,
                  genre: prod.genre,
                }
              })}
              onMouseEnter={() => handleCardClick(index)}
              onMouseLeave={() => handleCardClick(null)}
            >
              <div className="card-info" onClick={(e) => {
                e.stopPropagation();
                navigate(`/PorductSelecte/${prod._id}`, {
                  state: {
                    parentCategoryId: prod.categoryId,
                    subcategoryId: prod.subcategoryId,
                    genre: prod.genre,
                  },
                });
              }}>
                <div className="ci-row">
                  <div className="ci-text">
                    <h4 className="ci-title">{prod.name || 'Product'}</h4>
                    {prod.price && <span className="ci-sep">•</span>}
                    {prod.price && <span className="ci-price">{prod.price} DT</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
      {/* Categories Section */}
      <div className='categories-section'>
        <div className="categories-header">
          <h2>Collections</h2>
          <p>Find your perfect style</p>
        </div>
        <div className="categories-grid">
          <div className="category-card"onClick={() => {
                    navigate(`/ProductU/Accessories`, {
                      state: {
                        parentCategoryId: '68e6aa7973661e800ce393d1',
                        subcategoryId: null,
                        genre: 'men',
                      }
                    });
                  }}>
            <div className="category-image">
              <img src={pontalon} alt="Hoodies" />
            </div>
            <div className="category-info">
              <h3>Pontalon</h3>
              <p>Comfortable & Stylish</p>
            </div>
          </div>
          <div className="category-card" onClick={() => {
                    navigate(`/ProductU/Accessories`, {
                      state: {
                        parentCategoryId: '68e6a9f473661e800ce393ae',
                        subcategoryId: null,
                        genre: 'men',
                      }
                    });
                  }}>
            <div className="category-image">
              <img src={veste} alt="Hoodies" />
            </div>
            <div className="category-info">
              <h3>Blousons et manteaux</h3>
              <p>Comfortable & Stylish</p>
            </div>
          </div>
          <div className="category-card"  onClick={() => {
                    navigate(`/ProductU/Chaussures`, {
                      state: {
                        parentCategoryId: '68e6aa8873661e800ce393d6',
                        subcategoryId: null,
                        genre: 'men',
                      }
                    });
                  }}>
            <div className="category-image">
              <img src={product2} alt="T-Shirts" />
            </div>
            <div className="category-info">
              <h3>Chaussures</h3>
              <p>Classic & Versatile</p>
            </div>
          </div>
          <div className="category-card"   
                    onClick={() => {
                    navigate(`/ProductU/Accessories`, {
                      state: {
                        parentCategoryId: '68e6ada473661e800ce39435',
                        subcategoryId: null,
                        genre: 'men',
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
     
      <div className='Featured'>
        <h1>Featured Collection</h1>
        <p>Explore our carefully curated selection of premium streetwear and contemporary fashion</p>
        <div className='FeaturedProductCards'>
          {Products.slice(0, 4).map((prod, index) => 
          <div className='FeaturedProductCard' onClick={() => (navigate(`/PorductSelecte/${prod._id}`, {
                state: {
                  parentCategoryId: prod.categoryId,
                  subcategoryId: prod.subcategoryId,
                  genre: prod.genre,
                }
              }))}>
            <img src={`http://192.168.1.17:2025/${prod.images[0]?.urls[3]}`} alt="" />
            <h2>{prod.name}</h2>
            <h3>{prod.price} TND</h3>

          </div>
          )}
        </div>
      </div>

      {/* About Section */}



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
      <div className='footer'>
        <div className="footer-container">
          <div className="footer-1">
            <h2>Es</h2>
              <div className="footer-copyright">
                &copy; {new Date().getFullYear()} Es. All rights reserved.
              </div>          </div>
          <div className="footer-1">
            <h3>Quick Links</h3>
            <Link to='/AboutEs' className='footerLinks'>About</Link>
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