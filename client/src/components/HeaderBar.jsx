import React,{useState,useEffect,useMemo} from 'react'
import { Menu,Search,UserRound ,X ,LogOut,User,Mail, CreditCard, Truck, MapPin,ShoppingBag,ShieldUser,Edit2,Trash2 ,Dot,MoveRight,MoveLeft   } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import EsL from '../images/Es4.png'

import axios from 'axios'
function HeaderBar({showBag,setShowBag}   ) {
  const [categorySelected,setCategorySelected]=useState('')
  const [categorySelectedName,setCategorySelectedName]=useState('')
  const [showMenu,setShowMenu]=useState(false)
  const [showSearch,setShowSearch]=useState(false)
  const [genre,setGenre]=useState('men')
  const user=JSON.parse(localStorage.getItem('user'))
  const [ShowUser,setShowUser] =useState(false)
  const [HoverCat,setHoverCat] =useState(null)
  const [HoverSub,setHoverSub] =useState(null)
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productCart, setProductCart] = useState([]);
  const [product, setProduct] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [quantity, setquantity] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [showBagEdit, setShowBagEdit] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate total using useMemo
  const total = useMemo(() => {
    if (!productCart?.cart?.products) return 0;
    return productCart.cart.products.reduce((sum, product) => {
      return sum + (product.productId?.price * product.quantity);
    }, 0);
  }, [productCart]);

  const getCategory = async () => {  
    try {
      const res = await axios.get("http://localhost:2025/api/Admin/Get-category",{
      });
      setCategories(res.data);            
    } catch (error) {
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message)
      }
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };
  const getProductCart = async () => {  
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:2025/api/GetProductCart/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      setProductCart(res.data);
             
    } catch (error) {
      console.log(error);
    }
  };
  const getSubCategory = async (id) => {  
    try {
      const res = await axios.get(`http://localhost:2025/api/Admin/Get-Subcategory/${id}`);
      setSubcategories(res.data);     
       
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message)
      }
    }
  };
  const GetPById = async (id) => {  
    
    try {
      const res = await axios.get(`http://localhost:2025/api/Admin/Get-product/${id}`);     
      setName(res.data.name)
      setProduct(res.data)  
      // console.log('Product data:', res.data);
      // console.log('Product images:', res.data.images);
      setColors(Array.isArray(res.data.color) ? res.data.color : []);
      setSizes(() => {
        try {
          const raw = Array.isArray(res.data.size) ? res.data.size[0] : res.data.size;
          return JSON.parse(raw);
        } catch {
          return [];
        }
      });
      setImages(res.data.images || []);
      if (Array.isArray(res.data.color) && res.data.color.length > 0) {
        setSelectedColor(res.data.color[0]);
      }
      // Set initial image based on the first color
      if (Array.isArray(res.data.color) && res.data.color.length > 0) {
        const initialImage = getImageByColor(res.data, res.data.color[0]);
        setImage(initialImage);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message)
      }
    }
  };
  const getSafeImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Normalize the path to use forward slashes
    let normalizedPath = imagePath.replace(/\\/g, '/');
    return normalizedPath.startsWith('http')
      ? normalizedPath
      : `http://localhost:2025/${normalizedPath.replace(/^\//, '')}`;
  };

  const getImageByColor = (product, color, index = 0) => {
    if (!product?.images?.length) {
      return '';
    }
    
    // Find the image object that matches the color
    const match = product.images.find(img => 
      img.color?.toLowerCase() === color?.toLowerCase()
    );
    
    
    if (match?.urls?.[index]) {
      const url = getSafeImageUrl(match.urls[index]);
      return url;
    }
    
    // Fallback to first available image
    const fallback = product.images.find(img => img.urls?.[index]);
    if (fallback) {
      const url = getSafeImageUrl(fallback.urls[index]);
      console.log('Returning fallback URL:', url);
      return url;
    }
    
    console.log('No image found');
    return '';
  };
  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    getProductCart();
  }, [showBag, user?.id]);

  // Handle body overflow when shopping bag is open
  useEffect(() => {
    if (showBag || showBagEdit || showMenu || showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showBag, showBagEdit,showMenu,showSearch]);


  useEffect(() => {
    setHoverCat('')
    setHoverSub('')
    setCategorySelected('')
  }, [showMenu]);

  // Update image when selected color changes
  useEffect(() => {
    if (product && selectedColor) {
      const newImage = getImageByColor(product, selectedColor);
      console.log('Setting new image:', newImage);
      setImage(newImage);
    }
  }, [selectedColor, product]);
  
  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const newUser = JSON.parse(localStorage.getItem('user')) || null;
        setUser(newUser);
      } catch (error) {
        setUser(null);
      }
    }

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for changes when the component mounts or when navigating
    const checkUser = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user')) || null;
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
          setUser(currentUser);
        }
      } catch (error) {
        setUser(null);
      }
    }

    // Check user state periodically
    const interval = setInterval(checkUser, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user])

  const DeletePrdCart = async (productToDelete) => {
    if (!user?.id) return;
    try {
      const res = await axios.delete('http://localhost:2025/api/DeletePrdCart', {
        data: {
          userId: user.id,
          productId: productToDelete.productId._id,
          size: productToDelete.size,
          color: productToDelete.color
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        getProductCart();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCartItem = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.put('http://localhost:2025/api/cart-update', {
          userId: user.id,
          productId: product._id,
          size: selectedSize,
          quantity:quantity,
          color: selectedColor
        
      });

      if (res.status === 200) {
        getProductCart();
        setShowBagEdit(false)
      }
    } catch (error) {
      console.log(error);
    }
  };


    const items = [
    { icon: <MapPin size={18} style={{ marginRight: "6px" }} />, text: "Livraison rapide sur toute la Tunisie" },
    { icon: <Mail size={18} style={{ marginRight: "6px" }} />, text: "EsBrand@gmail.com" },
    { icon: <CreditCard size={18} style={{ marginRight: "6px" }} />, text: "Tous les paiements sont acceptés" },
    { icon: <Truck size={18} style={{ marginRight: "6px" }} />, text: "Livraison gratuite à partir de 120 DT" }
  ];
  return (
    <div>
      {/* <div className="HeaderBar-2">
        <div className="scrolling-text">
          Livraison gratuite à partir de 120 DT
        </div>
      </div> */}
      <div className="InfoBar">
        <div className="scrolling-wrapper">
          {items.map((item, i) => (
            <div className="scrolling-item" key={i}>
              {item.icon} {item.text}
            </div>
          ))}
          {/* duplicate items for infinite loop */}
          {items.map((item, i) => (
            <div className="scrolling-item" key={`dup-${i}`}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </div>
        {showBag && (
          <div onClick={() => {setShowBagEdit(false),setTimeout(() => {setShowBag(false);}, 400)}} className='overflow-2'>
          </div>
        )}
        {showMenu && (
          <div className='overflow'>
          </div>
        )}
        <div className='Search' style={{minHeight:showSearch === true ?"400px":"0px"}}>
          <X style={{color:"black",position:"absolute",right:"20px"} }/>
          <input type="text" className="SearchInput" placeholder="Serach For ...." />
        </div>
      <div   className='HeaderBar slide-down'>
        <Toaster/>
        <div className='HeaderBar-1'>
          <Menu onClick={()=>(setShowMenu(!showMenu),setShowUser(false),setShowBag(false))} size={25} strokeWidth={3} style={{color:"white",marginLeft:"1%",cursor:"pointer"}}/>
          <Link className='h1' to='/' style={{textDecoration:"none",color:"white"}}>
          <img src={EsL} onClick={()=>(setShowMenu(false),setShowBag(false))} width={'70px'} height={'70px'} alt="" />
          
          </Link>
          {/* <div className='recherche'>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
            />
            {searchInput && (
              <X 
                size={16} 
                style={{cursor:"pointer", marginRight: "5px"}} 
                onClick={() => setSearchInput('')}
              />
            )}
            <Search style={{cursor:"pointer"}}/>
          </div> */}
          <div className='HeaderBar-3'> 
            <div className="HeaderBar-4">
              {user ? (
                <User  onClick={()=>(setShowMenu(false),setShowUser(!ShowUser),setIsDropdownOpen(true),setShowBag(false))} style={{cursor:"pointer",color:"white"}}/> 
              ):(
                <Link to='/Seconnect'onClick={()=>(setShowMenu(false),setShowBag(false))}>
                <button >Se Connect <UserRound size={15} style={{position:"relative",left:"5px",top:"2px"}}/></button>
                </Link>
              )}
            </div>
            <Search onClick={()=>(setShowSearch(!showSearch))} style={{color:"white",cursor:"pointer"}}/>
            <ShoppingBag onClick={()=>(setShowMenu(false),setShowUser(false),setShowBag(!showBag))} style={{cursor:"pointer",color:"white"}}/>
            {
              productCart.cart?.products?.length === 0 ?(
                ''
              ):(
                <div className='CountPCart' style={{display:!user?'none':''}} onClick={()=>(setShowMenu(false),setShowBag(!showBag))}>{productCart.cart?.products?.length}</div>
              )
            }     
          </div>
        </div> 
        <div className='MenuUser'  style={{
              height: showMenu ? "474px" : "0px",
              paddingBottom: showMenu ? "2%" : "0%",
              transition: showMenu
                ? "height 0.5s ease, padding-bottom 0.5s ease" // slow open
                : "height 0.15s ease, padding-bottom 0.15s ease" // fast close
            }}>
          <div>
            <X onClick={()=>setShowMenu(false)} style={{display: showMenu ?"":"none",cursor:"pointer", marginLeft:"90%"}}/>
            <div className='MenuGenre' style={{display: showMenu ?"":"none"}}>
              <h2 onClick={()=>setGenre('men')} style={{fontWeight: genre === 'men' ?'':'300',color: genre === "men" ?"white":'gray'}}>Men</h2>
              <h2 onClick={()=>setGenre('women')}  style={{fontWeight: genre === 'women' ?'':'300',color: genre === "women" ?"white":'gray'}}>women</h2>
            </div>
          </div>
          <div style={{display:"flex",width:"100%"}}>
            <div className="list-1" >
              {categorySelected === '' ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4 }}
                  >
                    {categories.map((category) => (
                      <span 
                        key={category._id} 
                        style={{ display: showMenu === false ? "none" : "", transition: "all 0.5s" }}
                        className="SpanList"
                      >
                        {HoverCat === category._id ? <MoveRight /> : <Dot />}
                        <h2
                          style={{ fontWeight: category._id === categorySelected ? "700" : "" }}
                          onMouseEnter={() => setHoverCat(category._id)}
                          onMouseLeave={() => setHoverCat(null)}
                          onClick={() => {
                            getSubCategory(category._id);
                            setCategorySelectedName(category.name);
                            setCategorySelected(category._id);
                          }}
                        >
                          {category.name}
                        </h2>
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="subcategories"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span style={{ paddingBottom: "4%" }}>
                      <span
                        style={{ display: showMenu === false ? "none" : "", transition: "all 0.5s", padding: "2px" }}
                        className="SpanList"
                      >
                        <MoveLeft
                          style={{ cursor: "pointer",color:"#FBCA00" }}
                          onClick={() => {
                            setCategorySelected("");
                            setHoverCat("");
                          }}
                        />
                        <h3 style={{ margin: "0", marginLeft: "5%",color:"#FBCA00" }}>{categorySelectedName}</h3>
                      </span>

                      {subcategories.filter((subcategory) => subcategory.genre === genre).map((subcategory) => {
                        const parentCategory = categories.find((cat) => cat._id === subcategory.categoryId);
                        return (
                          <span
                            key={subcategory._id}
                            style={{ display: showMenu === false ? "none" : "", transition: "all 0.5s" }}
                            className="SpanList"
                          >
                            {HoverSub === subcategory._id ? <MoveRight /> : <Dot />}
                            <h2
                              onClick={() => {
                                navigate(
                                  `/ProductU/${subcategory.name}?subcategoryId=${subcategory._id}&genre=${genre}`,
                                  {
                                    state: {
                                      parentCategoryId: parentCategory ? parentCategory._id : "unknown",
                                      subcategoryId: subcategory._id,
                                      genre: genre,
                                    },
                                  }
                                );
                                setShowMenu(false);
                              }}
                              onMouseEnter={() => setHoverSub(subcategory._id)}
                              onMouseLeave={() => setHoverSub(null)}
                            >
                              {subcategory.name}
                            </h2>
                          </span>
                        );
                      })}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
        <div className='ShoppingBag' style={{width: showBag === true ?'29%':"0",overflow: "hidden",
              transition: showBag
                ? "width 0.5s ease, padding-bottom 0.5s ease" // slow open
                : "width 0.15s ease, padding-bottom 0.15s ease" // fast close
            }}>
          {productCart.cart?.products?.length === 0 ?(          
            <div>
              <X onClick={()=>setShowBag(false)} style={{display: showBag ?"":"none",cursor:"pointer", marginLeft:"90%"}}/>
              <h3 style={{textAlign:"center",position:"relative",top:"-10px",display: showBag ?"":"none"}}>ShoppingBag</h3>
              
              {/* Empty Cart Message */}
              <div className='EmptyBag' style={{
                display: showBag ? "flex" : "none",
              }}>
                <ShoppingBag size={60} style={{color: "#ccc", marginBottom: "15px"}}/>
                <h4 style={{color: "#666", marginBottom: "10px", fontSize: "18px"}}>Your cart is empty</h4>
                <p style={{color: "#999", fontSize: "14px", lineHeight: "1.4"}}>
                  Looks like you haven't added any items to your cart yet. 
                  Start shopping to see your items here!
                </p>
                <Link to="/" onClick={() => setShowBag(false)}>
                  <button  onClick={()=>setShowMenu(true)}>Start Shopping</button>
                </Link>
            </div>
            </div>
          ):(
            <div className='PdSb'>
              <X onClick={() => {
                setShowBagEdit(false); // first
                setTimeout(() => {
                  setShowBag(false); // after 0.5s
                }, 400);
              }} style={{display: showBag ?"":"none",cursor:"pointer", marginLeft:"90%"}}/>
              <h3 style={{textAlign:"center",position:"relative",top:"0px",display: showBag ?"":"none"}}>ShoppingBag <ShoppingBag style={{position:"relative",top:"5px",left:"1%"}}/> </h3>
              <div className='PdSb-1'>
              {productCart?.cart?.products?.map((product, index) => {
                // Use getImageByColor to get the correct image for the product's color
                const imageUrl = getImageByColor(product.productId, product.color, 0);
                
                return (
                  <div className='PdSp-2' key={product._id || index}>
                    {imageUrl && <img src={imageUrl} alt="Product" onError={(e) => {
                      console.log('Image failed to load:', imageUrl);
                      e.target.style.display = 'none';
                    }} />}
                    <div className='PdSp-3'>
                      <div className='PdSp-4'>
                        <h4>{ product.productId?.price}TND</h4>
                        <Edit2 size={19} onClick={()=>(setShowBagEdit(true),setquantity(product.quantity),GetPById(product.productId._id))} style={{cursor:"pointer"}} />
                        <Trash2 size={19} style={{cursor:"pointer"}} onClick={() => DeletePrdCart(product)} />
                      </div>
                      <p>{product.productId?.name}</p>
                      <p>Size: {product.size}</p>
                      <p>Color: {product.color}</p>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                  </div>
                );
              })}
              </div>
              <div className='total' style={{display: showBag ?"":"none"}}>
                <h2>Total</h2>
                <h2>{total} TND</h2>
              </div>
              <button style={{display: showBag ?"":"none"}} className='PdSb-bt' onClick={()=>navigate('/Commande')}>Passer Commande</button>
            </div>
          )}
        </div>
        <div className='ShoppingBag-Edit' style={{width: showBagEdit === true ?'29%':"0",overflow: "hidden",
              transition: showBag
                ? "width 0.5s ease, padding-bottom 0.5s ease" // slow open
                : "width 0.15s ease, padding-bottom 0.15s ease" // fast close
            }}>
          <X onClick={()=>setShowBagEdit(false)} style={{display: showBagEdit ?"":"none",cursor:"pointer", marginLeft:"90%"}}/>
          <h3 style={{display: showBagEdit ?"":"none",margin:"0"}}>{name}</h3>
          {image && <img src={image} alt="Product" />}
          <div className="colorSwatches">
            {colors.map((color, index) => {
              const imgUrl = getImageByColor(product, color);
              return (
                <div
                  key={index}
                  className='color'
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '24px',
                    height: '24px',
                    margin: '5px',
                    display: showBagEdit ?"":"none",
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: color === selectedColor ? '2px solid #303030ff' : '2px solid black',
                    backgroundColor: color,
                    backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    boxShadow: '0 0 0 2px #fff inset',
                  }}
                  title={color}
              />
              );
            })}
                </div>
          <div className="sizeOptions-ShopingBag">
            {sizes.map((size, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSize(size)}
                style={{
                  backgroundColor: selectedSize === size ? 'black' : '',
                  display: showBagEdit ?"":"none",
                  color: selectedSize === size ? 'white' : ''
                }}
                className="sizeBtn-ShopingBag"
              >
                {size}
              </button>
            ))}
          </div>
          <div className='HeaderBar-4' style={{display: showBagEdit ?"":"none"}}>
            <button className='Update' onClick={updateCartItem} >Update</button>
          </div>
        </div>


        {user && ShowUser && (
              <div className="user-menu">
                <div className='user-header'>
                  <div className="user-info">
                    <div className="user-name">{user?.firstName} {user?.lastName}</div>
                    <div className="user-email">{user?.email}</div>
                    <div className="user-role">
                      {user?.role === 'Admin' && 'Administrateur'}
                      {user?.role === 'Technician' && 'Technicien'}
                      {user?.role === 'client' && 'Client'}
                    </div>
                  </div>
                  
                </div>
                <Link to="/profile" onClick={()=>(setIsDropdownOpen(false),setShowUser(false))} className="dropdown-item"><User size={16} /> Mon Profil</Link>
                {(user?.role === 'Admin' || user?.role === 'Owner') && (
                  <Link
                    to="/ManagementDashboard"
                    onClick={() => (setIsDropdownOpen(false),setShowUser(false))}
                    className="dropdown-item"
                  >
                    <ShieldUser size={16} /> Administration
                  </Link>
                )}
                  <button onClick={handleLogout} className="dropdown-item"><LogOut size={16} /> Déconnexion</button>
              </div>
            )}
      </div>
    </div>

  )
}

export default HeaderBar