import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ProductsU = () => {
  const { subcategoryName } = useParams();
  const location = useLocation();
  const { parentCategoryId, subcategoryId, genre } = location.state || {};
  const [products, setProducts] = useState([]);
  const [subCatSelected, setSubcatSelected] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories only once on mount
  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get('http://localhost:2025/api/Admin/Get-category');
        setCategories(res.data);
      } catch (error) {
        if (error.response?.status !== 200) {
          toast.error(error.response?.data?.message);
        }
      }
    };
    getCategory();
  }, []);

  // Fetch subcategories when parentCategoryId changes
  useEffect(() => {
    if (!parentCategoryId) return;
    const getSubCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:2025/api/Admin/Get-Subcategory/${parentCategoryId}`);
        setSubcategories(res.data);
      } catch (error) {
        if (error.response?.status !== 200) {
          toast.error(error.response?.data?.message);
        }
      }
    };
    getSubCategory();
  }, [parentCategoryId]);

  // Fetch products only once on mount
  useEffect(() => {
  const getProducts = async () => {
    try {
      const res = await axios.get('http://localhost:2025/api/Admin/Get-products');
      setProducts(res.data);
    } catch (error) {
      // Optionally add toast here
    }
  };
  getProducts();
  }, []);

  useEffect(() => {
    // If subcategoryId is provided, set it; otherwise, keep it as null for "See-All"
    setSubcatSelected(subcategoryId || null);
  }, [subcategoryId]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (parentCategoryId) {
      filtered = filtered.filter(product => product.categoryId === parentCategoryId);
    }
    // Only filter by subcategory if a specific subcategory is selected (not "See-All")
    if (subCatSelected) {
      filtered = filtered.filter(product => product.subcategoryId === subCatSelected);
    }
    if (genre) {
      filtered = filtered.filter(product => product.genre === genre);
    }
    return filtered;
  }, [products, parentCategoryId, subCatSelected, genre]);

  // Unified image getter
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

  return (
    <div style={{ width: '100%' }}>
      <div className='CategoriesPU'>
        {!subCatSelected ? (
          // Show parent category name when "See-All" is selected
          <h1>{categories.find(cat => cat._id === parentCategoryId)?.name}</h1>
        ) : (
          subcategories.filter(subcat => subcat._id === subCatSelected && subcat.genre === genre).map(Subcat => (
            <h1 key={Subcat._id}>{Subcat.name}</h1>
          ))
        )}
        <div className='SubcategorisPU'>
          {/* See-All button */}
          <div
            style={{
              backgroundColor: !subCatSelected ? 'white' : '',
              color: !subCatSelected ? 'black' : '',
            }}
            onClick={() => setSubcatSelected(null)}
            className='subcatPU'
          >
            See-All
          </div>
          {subcategories.filter(subcat => subcat.genre === genre).map(Subcat => (
            <div
              style={{
                backgroundColor: Subcat._id === subCatSelected ? 'white' : '',
                color: Subcat._id === subCatSelected ? 'black' : '',
              }}
              onClick={() => setSubcatSelected(Subcat._id)}
              className='subcatPU'
              key={Subcat._id}
            >
              {Subcat.name}
            </div>
          ))}
        </div>
      </div>
      <div className='ProductsU'>
        {filteredProducts.map(product => {
          const color = selectedColors[product._id];
          const mainImg = getImageByColor(product, color);
          const secondImg = getImageByColor(product, color, 1);
          const isHovered = hoveredProductId === product._id;
          let sizes = [];
          try {
            const raw = Array.isArray(product.size) ? product.size[0] : product.size;
            sizes = JSON.parse(raw);
          } catch (err) {
            console.error("Size parsing failed:", err, product.size);
          }
          return (
            <div className='productU' onClick={()=>navigate(`/PorductSelecte/${product._id}`, {
                      state: {
                        parentCategoryId: product.categoryId,
                        subcategoryId: product.subcategoryId,
                        genre: product.genre,
                      }})} key={product._id}>
              <div className='hoverImg' 
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}>
                <img
                  src={isHovered && secondImg ? secondImg : mainImg}
                  alt={product.name}
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/default.png';
                  }}
                />
                {isHovered && (
                <div className="sizesPU" onMouseEnter={() => setHoveredProductId(product._id)} key={product._id} style={{height: isHovered === true ?'100px':'0px'}}>
                    <h4>Select size</h4>
                    <div className="sizes-container">
                      {sizes.map((s, indx) => (
                        <div key={indx} className="size-box">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p>{product.name}</p>
              <div style={{width:"100%",display:"flex",justifyContent:"space-around",alignItems:"center"}}>

              <h3>{product.price}TND</h3>
              <div className='sizes'>{/* Implement sizes if needed */}</div>
              <div className='Colors'>
                {product.color.map((color, index) => {
                  const imgUrl = getImageByColor(product, color);
                  const safeImgUrl = imgUrl ? imgUrl.replace(/\\/g, '/') : undefined;
                  return (
                    <div
                      key={index}
                      className='color'
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedColors(prev => ({
                          ...prev,
                          [product._id]: color,
                        }));
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        margin: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: '2px solid black',
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

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsU;