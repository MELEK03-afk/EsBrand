import React,{useState,useEffect,useMemo} from 'react'
import { Menu,Search,UserRound ,X ,LogOut,User,ShoppingBag,ShieldUser,Edit2,Trash2  } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
function HeaderBar({showBag,setShowBag}   ) {
  const [categorySelected,setCategorySelected]=useState('')
  const [showMenu,setShowMenu]=useState(false)
  const [genre,setGenre]=useState('men')
  const user=JSON.parse(localStorage.getItem('user'))
  const [ShowUser,setShowUser] =useState(false)
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
    if (showBag || showBagEdit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showBag, showBagEdit]);

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

  return (
    <div   className='HeaderBar slide-down'>
      <Toaster/>
      <div className='HeaderBar-1'>
        <Menu onClick={()=>(setShowMenu(!showMenu),setShowUser(false),setShowBag(false))} size={25} strokeWidth={3} style={{color:"black",marginLeft:"1%",cursor:"pointer"}}/>
        <Link className='h1' to='/' style={{textDecoration:"none"}}>
          <h1 onClick={()=>(setShowMenu(false),setShowBag(false))}>Es</h1>
        </Link>
        <div className='recherche'>
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
        </div>
        <div className='HeaderBar-3'> 
          <div className="HeaderBar-4">
            {user ? (
              <User  onClick={()=>(setShowMenu(false),setShowUser(!ShowUser),setIsDropdownOpen(true),setShowBag(false))} style={{cursor:"pointer"}}/> 
            ):(
              <Link to='/Seconnect'onClick={()=>(setShowMenu(false),setShowBag(false))}>
              <button >Se Connect <UserRound size={15} style={{position:"relative",left:"5px",top:"2px"}}/></button>
              </Link>
            )}
          </div>
          <ShoppingBag onClick={()=>(setShowMenu(false),setShowUser(false),setShowBag(!showBag))} style={{cursor:"pointer"}}/>
          {
            productCart.cart?.products?.length === 0 ?(
              ''
            ):(
              <div className='CountPCart' style={{display:!user?'none':''}} onClick={()=>(setShowMenu(false),setShowBag(!showBag))}>{productCart.cart?.products?.length}</div>
            )
          }     
        </div>
      </div> 
      <div className='MenuUser' style={{height : showMenu === true ?'512px':"0px"}}>
        <X onClick={()=>setShowMenu(false)} style={{display: showMenu ?"":"none",cursor:"pointer", marginLeft:"90%"}}/>
        <div className='MenuGenre' style={{display: showMenu ?"":"none"}}>
          <h2 onClick={()=>setGenre('men')} style={{fontWeight: genre === 'men' ?'':'300',textDecoration: genre === "men" ?"underline":''}}>Men</h2>
          <h2 onClick={()=>setGenre('women')}  style={{fontWeight: genre === 'women' ?'':'300',textDecoration: genre === "women" ?"underline":''}}>women</h2>
        </div>
        <div style={{display:"flex",height:"100%",width:"100%"}}>
          <div className="list-1">
            <ul style={{display: showMenu === false ? "none":'',transition: 'all 0.5s'}}>
              {categories.map((category)=>(
                <li key={category._id} style={{fontWeight: category._id === categorySelected ?'700':''}} onClick={(()=>  (getSubCategory(category._id),setCategorySelected(category._id)))}>{category.name}</li>
              ))}
            </ul>
          </div>
          <div className="list-2">
           <ul style={{display: showMenu === false ? "none":''}}>
            {subcategories.filter((subcategory) => subcategory.genre === genre ).map((subcategory) => {
              // Find the parent category for this subcategory
              const parentCategory = categories.find(cat => cat._id === subcategory.categoryId);
              return (
                <li
                  key={subcategory._id}
                  onClick={() => {
                    navigate(`/ProductU/${subcategory.name}`, {
                      state: {
                        parentCategoryId: parentCategory ? parentCategory._id : 'unknown',
                        subcategoryId: subcategory._id,
                        genre: genre,
                      }
                    });
                    setShowMenu(false);
                  }}
                >
                  {subcategory.name}
                </li>
              );
            })}
           </ul>
          </div>
        </div>
      </div>
      <div className='ShoppingBag' style={{width: showBag === true ?'29%':"0"}}>
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
      <div className='ShoppingBag-Edit' style={{width: showBagEdit === true ?'29%':"0"}}>
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
  )
}

export default HeaderBar