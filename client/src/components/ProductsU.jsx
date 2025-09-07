import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation,useSearchParams  } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

const ProductsU = () => {
  const { subcategoryName } = useParams();
  const location = useLocation();
  const { parentCategoryId, subcategoryId, genre } = location.state || {};
  const [searchParams] = useSearchParams();
  const subcategoryIdI = searchParams.get("subcategoryId");
  const genreI = searchParams.get("genre");
  const [products, setProducts] = useState([]);
  const [subCatSelected, setSubcatSelected] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();
  const [value, setValue] = React.useState([0, 300]);
  const [availableFilters, setAvailableFilters] = useState({ colors: [], sizes: [] });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  


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
    const getFilters = async () => {
      try {
        const res = await axios.get("http://localhost:2025/api/filters", {
          params: {
            subcategoryId: subCatSelected, // ✅ use selected subcategory
            genre,
          },
        });
        setAvailableFilters({
          colors: res.data.colors,
          sizes: res.data.sizes.flatMap(s => {
            try {
              return JSON.parse(s._id).map(sz => ({ _id: sz, count: s.count }));
            } catch {
              return [{ _id: s._id, count: s.count }];
            }
          }),
        });        console.log("Filters:", res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getFilters();
  }, [parentCategoryId, subCatSelected, genre]);



  useEffect(() => {
    // If subcategoryId is provided, set it; otherwise, keep it as null for "See-All"
    setSubcatSelected(subcategoryIdI);
  }, [subcategoryId]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    console.log(selectedColor);
    console.log(filtered);
    

    if (subCatSelected) {
      filtered = filtered.filter(p => p.subcategoryId === subCatSelected);
    }
    if (genre) {
      filtered = filtered.filter(p => p.genre === genre);
    }
    filtered = filtered.filter(
      p => value[0] <= p.price && p.price <= value[1]
    );

    if (selectedColor) {
      filtered = filtered.filter(p => p.color.includes(selectedColor));
    }
    if (selectedSize) {
      filtered = filtered.filter(p => p.size.includes(selectedSize));
    }

    return filtered;
  }, [products, parentCategoryId, subCatSelected, genre, value, selectedColor, selectedSize]);

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
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
      <div className='AllProduct-1'>
        <div className='FilterdPrd'>
          <div className='prixFilter'>
            <h3>Filtrer par Prix</h3>
            <Box sx={{ width: 250 }}>
            <Slider
              step={10}
              getAriaLabel={() => 'Temperature range'}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              color='black'
              max={300}
              getAriaValueText={valuetext}
            />
            </Box>  
            <div className='prixBetween'>
              <h5>{value[0]}DT</h5>
              <h5>{value[1]}DT</h5>
            </div>
          </div>
          <div className='border'></div>
          <div className="filter-section">
            <h3>Filtrer par Couleur</h3>
            <div className='ColorsproductU'>
              {availableFilters.colors.map(c => (
                <div
                  key={c._id}
                  className='SelectedColor'
                  onClick={() => setSelectedColor(c._id)}
                  style={{
                    cursor: "pointer",
                    display:"flex",
                    fontWeight: selectedColor === c._id ? "bold" : "normal",
                  }}
                >
                <div className="colorItem">
                  <div style={{display:"flex",width:"70%",alignItems:"center"}}>
                    <span style={{
                        width: '24px',
                        height: '24px',
                        margin: '5px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: '2px solid black',
                        backgroundColor: c._id,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0 0 0 2px #fff inset',
                      }} 
                    />
                    <h4>{c._id}</h4>
                  </div>
                  <div className="countColors">{c.count}</div>
                </div>

                </div>
              ))}
            </div>
          </div>
          <div className='border'></div>
          <div className="filter-section">
            <h3>Filtrer par Taille</h3>
            {availableFilters.sizes.map(s => (

              <div key={s._id}  onClick={() => setSelectedSize(s._id)}  className='SizesF'>
                <h4 id='filterColor' style={{borderRadius:"50%",padding:"5px 7px"}}>{s._id} </h4>
                <div className='countColors'>{s.count}</div>
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

    </div>
  );
};

export default ProductsU;