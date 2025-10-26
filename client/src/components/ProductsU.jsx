import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { SlidersHorizontal, Eraser, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

function valuetext(value) {
  return `${value}°C`;
}

const Index = () => {
  const { subcategoryName } = useParams();
  const location = useLocation();
  const { parentCategoryId, subcategoryId, genre } = location.state || {};
  const [searchParams] = useSearchParams();
  const effectiveSubcategoryId = subcategoryId || searchParams.get("subcategoryId");
  const effectiveGenre = genre || searchParams.get("genre");
  const [products, setProducts] = useState([]);
  const [subCatSelected, setSubcatSelected] = useState(subcategoryId || null);
  const [FunnelIC, setFunnel] = useState(false);
  const [selectedColors, setSelectedColors] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();
  const [value, setValue] = useState([0, 300]);
  const [availableFilters, setAvailableFilters] = useState({ colors: [], sizes: [] });
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Fetch categories only once on mount
  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get('http://192.168.1.17:2025/api/Admin/Get-category');
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
        const res = await axios.get(`http://192.168.1.17:2025/api/Admin/Get-Subcategory/${parentCategoryId}`);
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
        const res = await axios.get('http://192.168.1.17:2025/api/Admin/Get-products');
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
        const res = await axios.get("http://192.168.1.17:2025/api/filters", {
          params: {
            subcategoryId: subCatSelected,
            genre: genre,
          },
        });

        setAvailableFilters({
          colors: res.data.colors || [],
          sizes: (res.data.sizes || []).flatMap((s) => {
            try {
              return JSON.parse(s._id).map((sz) => ({ _id: sz, count: s.count }));
            } catch {
              return [{ _id: s._id, count: s.count }];
            }
          }),
        });
      } catch (error) {
        console.error("❌ Failed to fetch filters:", error);
      }
    };

    if (subcategoryId || genre) {
      getFilters();
    }
  }, [parentCategoryId, subCatSelected, genre]);

  const normalizeSizes = (raw) => {
    if (!raw) return [];
    try {
      if (Array.isArray(raw)) {
        if (typeof raw[0] === "string" && raw[0].startsWith("[")) {
          return JSON.parse(raw[0]);
        }
        return raw;
      }
      if (typeof raw === "string" && raw.startsWith("[")) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("❌ normalizeSizes failed:", err, raw);
    }
    return [];
  };

  useEffect(() => {
    setSubcatSelected(effectiveSubcategoryId);
  }, [subcategoryId]);

  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(products) ? products : [];

    if (subCatSelected) {
      filtered = filtered.filter(p => p?.subcategoryId === subCatSelected);
    } else if (parentCategoryId) {
      filtered = filtered.filter(p => p?.categoryId === parentCategoryId);
    }

    if (genre) {
      filtered = filtered.filter(p => p?.genre === genre);
    }

    if (Array.isArray(value) && value.length === 2) {
      filtered = filtered.filter(
        p => typeof p?.price === "number" && value[0] <= p.price && p.price <= value[1]
      );
    }

    if (selectedColor) {
      filtered = filtered.filter(
        p => Array.isArray(p?.color) && p.color.includes(selectedColor)
      );
    }

    if (selectedSize) {
      filtered = filtered.filter(p => {
        const sizes = normalizeSizes(p.size);
        return sizes.includes(selectedSize);
      });
    }

    return filtered;
  }, [products, parentCategoryId, subCatSelected, genre, value, selectedColor, selectedSize]);

  const getImageByColor = (product, color, index = 0) => {
    if (!product?.images?.length) return '';
    const firstItem = product.images[0];
    if (typeof firstItem === 'string') {
      return `http://192.168.1.17:2025/${firstItem}`;
    }
    if (typeof firstItem === 'object') {
      const match = product.images.find((img) => img.color?.toLowerCase() === color?.toLowerCase());
      if (match?.urls?.[index]) {
        return `http://192.168.1.17:2025/${match.urls[index]}`;
      }
      const fallback = product.images.find((img) => img.urls?.[index]);
      if (fallback) {
        return `http://192.168.1.17:2025/${fallback.urls[index]}`;
      }
    }
    return '';
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: '100%',height:"auto" }}>
      <div className='CategoriesPU'>
        <h1>{categories.find(cat => cat._id === parentCategoryId)?.name}</h1>
        <h3>Discover our latest collection of premium denim</h3>
        <div className='SubcategorisPU'>
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
              onClick={() => { setSubcatSelected(Subcat._id); setSelectedColor(null); }}
              className='subcatPU'
              key={Subcat._id}
            >
              {Subcat.name}
            </div>
          ))}
        </div>
        <div className='FunnelIcon' onClick={() => setFunnel(!FunnelIC)}>
          <SlidersHorizontal size={16} /> Filters
        </div>
      </div>

      <div className='AllProduct-1'>
        <AnimatePresence>
          {FunnelIC && (
            <motion.div
              className="FilterdPrd"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "25%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <X style={{ position: "absolute", right: "5px", cursor: "pointer" }} onClick={() => setFunnel(false)} />
              <h3 style={{ color: "#F5C400" }}>Filters</h3>
              <div>
                <div className='prixFilter'>
                  <h3>Filtrer par Prix</h3>
                  <Box sx={{ width: 250 }}>
                    <Slider
                      step={10}
                      getAriaLabel={() => 'Temperature range'}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      color='primary'
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
                  <motion.div
                    className="filter-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h3>Filtrer par Couleur</h3>
                    <Eraser className='BrushCleaning' size={19} onClick={() => setSelectedColor(null)} />
                    <div className='ColorsproductU'>
                      {availableFilters.colors.map((c) => (
                        <div
                          key={c._id}
                          className='SelectedColor'
                          onClick={() => { setSelectedColor(c._id); setSelectedColors(c._id); }}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            fontWeight: selectedColor === c._id ? "bold" : "normal",
                          }}
                        >
                          <div className="colorItem">
                            <div style={{ display: "flex", width: "70%", alignItems: "center" }}>
                              <span
                                style={{
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
                  </motion.div>
                </div>
                <div className='border'></div>
                <div className="filter-section" style={{ position: "relative" }}>
                  <h3>Filtrer par Taille</h3>
                  <Eraser className='BrushCleaning' size={19} onClick={() => setSelectedSize(null)} />
                  {availableFilters.sizes.map((s) => (
                    <div key={s._id} onClick={() => setSelectedSize(s._id)} className='SizesF'>
                      <h4 className='filterColor' style={{ borderRadius: "20%", padding: "5px 7px" }}>{s._id}</h4>
                      <div className='countColors'>{s.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='ProductsU'>
          {filteredProducts.map(product => {
            const color = selectedColors[product._id];
            const mainImg = getImageByColor(product, color);
            const secondImg = getImageByColor(product, color, 1);
            const isHovered = hoveredProductId === product._id;
            let sizes = [];
            try {
              if (Array.isArray(product.size)) {
                if (typeof product.size[0] === "string") {
                  sizes = JSON.parse(product.size[0]);
                } else {
                  sizes = product.size;
                }
              }
            } catch (err) {
              console.error("❌ Size parsing failed:", err, product.size);
            }
            return (
              <div
                className='productU'
                onClick={() => navigate(`/PorductSelecte/${product._id}`, {
                  state: {
                    parentCategoryId: product.categoryId,
                    subcategoryId: product.subcategoryId,
                    genre: product.genre,
                  }
                })}
                key={product._id}
              >
                <div
                  className='hoverImg'
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <img
                    src={isHovered && secondImg ? secondImg : mainImg}
                    alt={product.name}
                    onMouseEnter={() => setHoveredProductId(product._id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default.png';
                    }}
                  />
                  {isHovered && (
                    <div className="sizesPU" onMouseEnter={() => setHoveredProductId(product._id)} key={product._id} style={{ height: isHovered === true ? '100px' : '0px' }}>
                      <h4>sizes</h4>
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
                <div style={{ width: "95%", display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                  <h3>{product.price}TND</h3>
                  <div className='sizes'></div>
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

      {/* Mobile Section */}
      <div className='MobileAllProduct'>
        <div className='SubCategoryMobilePU'>
          <h1>{categories.find(cat => cat._id === parentCategoryId)?.name}</h1>
          <h3>Discover our latest collection of premium denim</h3>
        </div>

        {/* Mobile Subcategory Filters */}
        <div className='mobile-subcategories'>
          <div
            className={`mobile-subcat-pill ${!subCatSelected ? 'active' : ''}`}
            onClick={() => setSubcatSelected(null)}
          >
            Afficher tout
          </div>
          {subcategories.filter(subcat => subcat.genre === genre).map(Subcat => (
            <div
              key={Subcat._id}
              className={`mobile-subcat-pill ${Subcat._id === subCatSelected ? 'active' : ''}`}
              onClick={() => { setSubcatSelected(Subcat._id); setSelectedColor(null); }}
            >
              {Subcat.name}
            </div>
          ))}
        </div>

        {/* Mobile Controls */}
        <div className='mobile-controls'>
          <span className='results-count'>{filteredProducts.length} résultats</span>
          <div className='filter-icon' onClick={() => setFunnel(!FunnelIC)}>
            <SlidersHorizontal size={20} />
          </div>
        </div>

        {/* Mobile Product Grid */}
        {/* <div className='mobile-products-grid'>
          {filteredProducts.map(product => {
            const color = selectedColors[product._id];
            const mainImg = getImageByColor(product, color);
            const secondImg = getImageByColor(product, color, 1);
            
            return (
              <div
                className='mobile-product-card'
                onClick={() => navigate(`/PorductSelecte/${product._id}`, {
                  state: {
                    parentCategoryId: product.categoryId,
                    subcategoryId: product.subcategoryId,
                    genre: product.genre,
                  }
                })}
                key={product._id}
              >
                <div className='mobile-product-image'>
                  <img
                    src={mainImg}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default.png';
                    }}
                  />
                  {secondImg && (
                    <div className='image-indicators'>
                      <span className='indicator active'></span>
                      <span className='indicator'></span>
                    </div>
                  )}
                </div>
                <div className='mobile-product-info'>
                  <p className='mobile-product-name'>{product.name}</p>
                  <div className='mobile-product-footer'>
                    <h3 className='mobile-product-price'>{product.price} TND</h3>
                    <div className='mobile-add-bag'>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
          <div className='mobile-products-grid'>
          {filteredProducts.map((prod, index) =>
            <div key={prod._id || index} id='FeaturedProductCard' style={{width:"100%"}} className='FeaturedProductCard'
              onClick={() => (navigate(`/PorductSelecte/${prod._id}`, {
                state: {
                  parentCategoryId: prod.categoryId,
                  subcategoryId: prod.subcategoryId,
                  genre: prod.genre,
                }
              }), scrollToTop())}>
              <img src={`http://192.168.1.17:2025/${prod.images[0]?.urls[3]}`} alt="" />
              <h2>{prod.name}</h2>
              <h3>{prod.price} TND</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
