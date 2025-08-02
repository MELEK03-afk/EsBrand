import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link ,useNavigate} from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShoppingBag, Mail, Instagram } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ProductSelect = ({ setShowBag }) => {
  const location = useLocation();
  const { parentCategoryId, subcategoryId, genre } = location.state || {};
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [subListStart, setSubListStart] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const getSafeImageUrl = (img) => {
    if (!img) return '/default.png';
    if (typeof img === 'string') return `http://localhost:2025/${img}`;
    if (typeof img === 'object' && img.urls?.length) return `http://localhost:2025/${img.urls[0]}`;
    return '/default.png';
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:2025/api/Admin/Get-products');
      const filtered = res.data.filter(p => p.subcategoryId === subcategoryId && p.genre === genre);
      setAllProducts(filtered);

      const selectedProduct = filtered.find(p => p._id === id);
      if (selectedProduct) {
        setProduct(selectedProduct);
        setName(selectedProduct.name || '');
        setPrice(selectedProduct.price || '');
        setDescription(selectedProduct.description || '');
        setColors(Array.isArray(selectedProduct.color) ? selectedProduct.color : []);
        setSizes(() => {
          try {
            const raw = Array.isArray(selectedProduct.size) ? selectedProduct.size[0] : selectedProduct.size;
            return JSON.parse(raw);
          } catch {
            return [];
          }
        });
        setImages(selectedProduct.images || []);
        if (Array.isArray(selectedProduct.color) && selectedProduct.color.length > 0) {
          setSelectedColor(selectedProduct.color[0]);
        }
        if (Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0) {
          setImage(getSafeImageUrl(selectedProduct.images[0]));
        }
        setCurrentImageIndex(0);
      }
    } catch (error) {
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message || "Failed to fetch products");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (subcategoryId && genre) {
      fetchProducts();
    }
  }, [subcategoryId, genre, id]);

  const getImageByColor = (product, color, index = 0) => {
    if (!product?.images?.length) return '';
    const firstItem = product.images[0];
    if (typeof firstItem === 'string') {
      return `http://localhost:2025/${firstItem}`;
    }
    if (typeof firstItem === 'object') {
      const match = product.images.find(img => img.color?.toLowerCase() === color?.toLowerCase());
      if (match?.urls?.[index]) {
        return `http://localhost:2025/${match.urls[index]}`;
      }
      const fallback = product.images.find(img => img.urls?.[index]);
      if (fallback) {
        return `http://localhost:2025/${fallback.urls[index]}`;
      }
    }
    return '';
  };

  useEffect(() => {
    if (!selectedColor || !images.length) return;
    const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
    if (colorObj?.urls?.length > 0) {
      const idx = Math.max(0, Math.min(currentImageIndex, colorObj.urls.length - 1));
      setImage(`http://localhost:2025/${colorObj.urls[idx]}`);
    } else {
      setImage(getSafeImageUrl(images[0]));
    }
  }, [selectedColor, images, currentImageIndex]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const handleSubPrev = () => {
    setSlideDirection('slide-right');
    setTimeout(() => {
      setSubListStart(prev => (prev > 0 ? prev - 1 : Math.max(allProducts.length - 3, 0)));
    }, 0);
  };

  const handleSubNext = () => {
    setSlideDirection('slide-left');
    setTimeout(() => {
      setSubListStart(prev => (prev < Math.max(allProducts.length - 3, 0) ? prev + 1 : 0));
    }, 0);
  };

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(''), 400);
      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextImage = () => {
    const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
    if (colorObj?.urls?.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % colorObj.urls.length);
    }
  };

  const handlePrevImage = () => {
    const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
    if (colorObj?.urls?.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + colorObj.urls.length) % colorObj.urls.length);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/SeConnect');
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      const cartData = {
        userId: user.id || user._id,
        products: [{ productId: id, quantity: 1, size: selectedSize, color: selectedColor }]
      };

      const res = await axios.post('http://localhost:2025/api/AddToCart', cartData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Product added to cart successfully!");
        setShowBag(true);
      }
    } catch (error) {
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message || "Failed to add product to cart");
      }
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="ProductSelect">
      <div className='HeaderBar-2'>
        <h3 style={{ color: "white", textAlign: "center", padding: "6px", margin: 0 }}>
          Livraison gratuite à partir de 120 DT
        </h3>
      </div>

      {product && (
        <div style={{ display: 'flex', justifyContent: "center", alignItems: "flex-end", width: "100%", gap: "48px" }}>
          <div className="gallery">
            <ArrowLeft style={{ cursor: "pointer" }} onClick={handlePrevImage} />
            <img src={image} alt={name} className="mainImage" />
            <ArrowRight style={{ cursor: "pointer" }} onClick={handleNextImage} />
          </div>

          <div className="details">
            <h1 className="name">{name}</h1>
            <p className="price">{price} TND</p>

            <div className="colorSection">
              <span>Couleur:</span>
              <div className="colorSwatches">
                {colors.map((color, index) => {
                  const imgUrl = getImageByColor(product, color);
                  const safeImgUrl = imgUrl ? imgUrl.replace(/\\/g, '/') : undefined;
                  return (
                    <div
                      key={index}
                      className='color'
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        margin: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: color === selectedColor ? '2px solid #7c2232' : '2px solid black',
                        backgroundColor: color,
                        backgroundImage: safeImgUrl ? `url(${safeImgUrl})` : undefined,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0 0 0 2px #fff inset',
                      }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            <div className="sizeSection">
              <span>Taille:</span>
              <div className="sizeOptions">
                {sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      backgroundColor: selectedSize === size ? 'black' : '',
                      color: selectedSize === size ? 'white' : ''
                    }}
                    className="sizeBtn"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button className="addToCartBtn" onClick={handleAddToCart}>
              AJOUTER AU PANIER <ShoppingBag />
            </button>

            <div className="description">
              <h3>Description</h3>
              <p>{description}</p>
            </div>
          </div>
        </div>
      )}

      <div className='SubcategoryProduct' style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
        <ArrowLeft size={30} onClick={handleSubPrev} style={{ cursor: 'pointer' }} />
        <div className={`productsSub${slideDirection ? ' ' + slideDirection : ''}`}>
          {allProducts.slice(subListStart, subListStart + 3).map((prod) => {
            const imgUrl = getSafeImageUrl(prod.images[0]);
            return (
              <div key={prod._id} onClick={() => {navigate(`/PorductSelecte/${prod._id}`, {
                      state: {
                        parentCategoryId: product.categoryId,
                        subcategoryId: product.subcategoryId,
                        genre: product.genre,
                      }});
                       scrollToTop(); }} className='PS'>
                <img src={imgUrl} alt={prod.name} style={{ width: "100%", height: '80%', objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ fontSize: 12, marginTop: '8%' }}>{prod.name}</div>
              </div>
            );
          })}
        </div>
        <ArrowRight size={30} onClick={handleSubNext} style={{ cursor: 'pointer' }} />
      </div>

      <div className='footer'>
        <div className="footer-1">
          <h2>Es</h2>
          <p>Redefining streetwear with effortless elegance. Designed for bold, modern women.</p>
        </div>
        <div className="footer-1">
          <h3>Quick Links</h3>
          <Link className='footerLinks'>Shop</Link>
        </div>
        <div className="footer-1">
          <h3>Get in Touch</h3>
          <p className='getintouch'><Mail size={20} style={{ position: "relative", top: "5px", right: "5px" }} /> meleksaket2003@gmail.com</p>
          <p className='getintouch'><Instagram size={20} style={{ position: "relative", top: "5px", right: "5px" }} /> esseketmelek</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSelect;



























































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useLocation, Link } from 'react-router-dom';
// import { ArrowRight, ArrowLeft, ShoppingBag, Mail, Instagram } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// const ProductSelect = ({ setShowBag }) => {
//   const location = useLocation();
//   const { parentCategoryId, subcategoryId, genre } = location.state || {};
//   const { id } = useParams();
//   const [productc, setProduct] = useState([]);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [sizes, setSizes] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState('');
//   const [images, setImages] = useState([]);
//   const [selectedColor, setSelectedColor] = useState('');
//   const [selectedSize, setSelectedSize] = useState('');
//   const [allProducts, setAllProducts] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [subListStart, setSubListStart] = useState(0);
//   const [slideDirection, setSlideDirection] = useState('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const user = JSON.parse(localStorage.getItem('user'));

//   const getSafeImageUrl = (img) => {
//     if (!img) return '/default.png';
//     if (typeof img === 'string') return `http://localhost:2025/${img}`;
//     if (typeof img === 'object' && img.urls?.length) return `http://localhost:2025/${img.urls[0]}`;
//     return '/default.png';
//   };

//   useEffect(() => {
//     if (!subcategoryId || !genre) return;
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get('http://localhost:2025/api/Admin/Get-products');
//         const filtered = res.data.filter(p => p.subcategoryId === subcategoryId && p.genre === genre);
//         setAllProducts(filtered);
//         const idx = filtered.findIndex(p => p._id === id);
//         setCurrentIndex(idx !== -1 ? idx : 0);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchProducts();
//   }, [subcategoryId, genre, id]);

//   useEffect(() => {
//     if (allProducts.length && allProducts[currentIndex]) {
//       const prod = allProducts[currentIndex];
//       setName(prod.name || '');
//       setProduct(prod);
//       setPrice(prod.price || '');
//       setDescription(prod.description || '');
//       setColors(Array.isArray(prod.color) ? prod.color : []);
//       setSizes(() => {
//         try {
//           const raw = Array.isArray(prod.size) ? prod.size[0] : prod.size;
//           return JSON.parse(raw);
//         } catch {
//           return [];
//         }
//       });
//       setImages(prod.images || []);
//       if (Array.isArray(prod.color) && prod.color.length > 0) {
//         setSelectedColor(prod.color[0]);
//       }
//       if (Array.isArray(prod.images) && prod.images.length > 0) {
//         setImage(getSafeImageUrl(prod.images[0]));
//       }
//       setCurrentImageIndex(0);
//     }
//   }, [currentIndex, allProducts]);

//   const getImageByColor = (product, color, index = 0) => {
//     if (!product?.images?.length) return '';
//     const firstItem = product.images[0];
//     if (typeof firstItem === 'string') {
//       return `http://localhost:2025/${firstItem}`;
//     }
//     if (typeof firstItem === 'object') {
//       const match = product.images.find(img => img.color?.toLowerCase() === color?.toLowerCase());
//       if (match?.urls?.[index]) {
//         return `http://localhost:2025/${match.urls[index]}`;
//       }
//       const fallback = product.images.find(img => img.urls?.[index]);
//       if (fallback) {
//         return `http://localhost:2025/${fallback.urls[index]}`;
//       }
//     }
//     return '';
//   };

//   useEffect(() => {
//     if (!selectedColor || !images.length) return;
//     const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
//     if (colorObj?.urls?.length > 0) {
//       const idx = Math.max(0, Math.min(currentImageIndex, colorObj.urls.length - 1));
//       setImage(`http://localhost:2025/${colorObj.urls[idx]}`);
//     } else {
//       setImage(getSafeImageUrl(images[0]));
//     }
//   }, [selectedColor, images, currentImageIndex]);

//   useEffect(() => {
//     setCurrentImageIndex(0);
//   }, [selectedColor]);

//   const handleSubPrev = () => {
//     setSlideDirection('slide-right');
//     setTimeout(() => {
//       setSubListStart(prev => (prev > 0 ? prev - 1 : Math.max(allProducts.length - 3, 0)));
//     }, 0);
//   };

//   const handleSubNext = () => {
//     setSlideDirection('slide-left');
//     setTimeout(() => {
//       setSubListStart(prev => (prev < Math.max(allProducts.length - 3, 0) ? prev + 1 : 0));
//     }, 0);
//   };

//   useEffect(() => {
//     if (slideDirection) {
//       const timer = setTimeout(() => setSlideDirection(''), 400);
//       return () => clearTimeout(timer);
//     }
//   }, [slideDirection]);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleNextImage = () => {
//     const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
//     if (colorObj?.urls?.length > 0) {
//       setCurrentImageIndex(prev => (prev + 1) % colorObj.urls.length);
//     }
//   };

//   const handlePrevImage = () => {
//     const colorObj = images.find(img => img.color?.toLowerCase() === selectedColor?.toLowerCase());
//     if (colorObj?.urls?.length > 0) {
//       setCurrentImageIndex(prev => (prev - 1 + colorObj.urls.length) % colorObj.urls.length);
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       toast.error("Please login to add items to cart");
//       return;
//     }
//     if (!selectedColor) {
//       toast.error("Please select a color");
//       return;
//     }
//     if (!selectedSize) {
//       toast.error("Please select a size");
//       return;
//     }
//     try {
//       const cartData = {
//         userId: user.id || user._id,
//         products: [{ productId: id, quantity: 1, size: selectedSize, color: selectedColor }]
//       };
//       const response = await axios.post('http://localhost:2025/api/AddToCart', cartData, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (response.status === 200 || response.status === 201) {
//         toast.success("Product added to cart successfully!");
//          setShowBag(true);
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error(error.response?.data?.message || "Failed to add product to cart");
//     }
//   };

//   return (
//     <div className="ProductSelect">
//       <div className='HeaderBar-2'>
//         <h3 style={{ color: "white", textAlign: "center", padding: "6px", margin: 0 }}>
//           Livraison gratuite à partir de 120 DT
//         </h3>
//       </div>

//       <div style={{ display: 'flex', justifyContent: "center", alignItems: "flex-end", width: "100%", gap: "48px" }}>
//         <div className="gallery">
//           <ArrowLeft style={{ cursor: "pointer" }} onClick={handlePrevImage} />
//           <img src={image} alt={name} className="mainImage" />
//           <ArrowRight style={{ cursor: "pointer" }} onClick={handleNextImage} />
//         </div>

//         <div className="details">
//           <h1 className="name">{name}</h1>
//           <p className="price">{price} TND</p>

//           <div className="colorSection">
//             <span>Couleur:</span>
//             <div className="colorSwatches">
//               {colors.map((color, index) => {
//                 const imgUrl = getImageByColor(productc, color);
//                 const safeImgUrl = imgUrl ? imgUrl.replace(/\\/g, '/') : undefined;
//                 return (
//                   <div
//                     key={index}
//                     className='color'
//                     onClick={() => setSelectedColor(color)}
//                     style={{
//                       width: '24px',
//                       height: '24px',
//                       margin: '5px',
//                       borderRadius: '50%',
//                       cursor: 'pointer',
//                       border: color === selectedColor ? '2px solid #7c2232' : '2px solid black',
//                       backgroundColor: color,
//                       backgroundImage: safeImgUrl ? `url(${safeImgUrl})` : undefined,
//                       backgroundPosition: 'center',
//                       backgroundRepeat: 'no-repeat',
//                       boxShadow: '0 0 0 2px #fff inset',
//                     }}
//                     title={color}
//                   />
//                 );
//               })}
//             </div>
//           </div>

//           <div className="sizeSection">
//             <span>Taille:</span>
//             <div className="sizeOptions">
//               {sizes.map((size, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedSize(size)}
//                   style={{
//                     backgroundColor: selectedSize === size ? 'black' : '',
//                     color: selectedSize === size ? 'white' : ''
//                   }}
//                   className="sizeBtn"
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button className="addToCartBtn" onClick={() => { handleAddToCart() }}>
//             AJOUTER AU PANIER <ShoppingBag />
//           </button>

//           <div className="description">
//             <h3>Description</h3>
//             <p>{description}</p>
//           </div>
//         </div>
//       </div>

//       <div className='SubcategoryProduct' style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
//         <ArrowLeft size={30} onClick={handleSubPrev} style={{ cursor: 'pointer' }} />
//         <div className={`productsSub${slideDirection ? ' ' + slideDirection : ''}`}>
//           {allProducts.slice(subListStart, subListStart + 3).map((prod, idx) => {
//             const imgUrl = getSafeImageUrl(prod.images[0]);
//             const realIdx = subListStart + idx;
//             return (
//               <div key={prod._id} onClick={() => { setCurrentIndex(realIdx); scrollToTop(); }} className='PS'>
//                 <img src={imgUrl} alt={prod.name} style={{ width: "100%", height: '80%', objectFit: 'cover', borderRadius: 8 }} />
//                 <div style={{ fontSize: 12, marginTop: '8%' }}>{prod.name}</div>
//               </div>
//             );
//           })}
//         </div>
//         <ArrowRight size={30} onClick={handleSubNext} style={{ cursor: 'pointer' }} />
//       </div>

//       <div className='footer'>
//         <div className="footer-1">
//           <h2>Es</h2>
//           <p>Redefining streetwear with effortless elegance. Designed for bold, modern women.</p>
//         </div>
//         <div className="footer-1">
//           <h3>Quick Links</h3>
//           <Link className='footerLinks'>Shop</Link>
//         </div>
//         <div className="footer-1">
//           <h3>Get in Touch</h3>
//           <p className='getintouch'><Mail size={20} style={{ position: "relative", top: "5px", right: "5px" }} /> meleksaket2003@gmail.com</p>
//           <p className='getintouch'><Instagram size={20} style={{ position: "relative", top: "5px", right: "5px" }} /> esseketmelek</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductSelect;
