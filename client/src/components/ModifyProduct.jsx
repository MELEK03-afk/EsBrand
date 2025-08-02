import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const ModifyProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [genre, setGenre] = useState('');
  const [size, setSize] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    GetProduct();
    GetCategories();
  }, []);

  const GetCategories = async () => {
    try {
      const res = await axios.get('http://localhost:2025/api/Admin/get-categories');
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const GetProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:2025/api/Admin/Get-OneProduct/${id}`);
      const product = res.data;

      setName(product.name || '');
      setPrice(product.price || '');
      setDescription(product.description || '');
      setColor(Array.isArray(product.color) ? product.color : []);
      setCategoryId(product.categoryId || '');
      setSubCategory(product.subCategory || '');
      setGenre(product.genre || '');
      setSize(Array.isArray(product.size) ? product.size : []);
      setIsFeatured(product.featured || false);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = {
      name,
      price,
      description,
      color,
      categoryId,
      subCategory,
      genre,
      size,
      featured: isFeatured,
    };

    try {
      await axios.put(`http://localhost:2025/api/Admin/UpdateProduct/${id}`, data);
      toast.success('Produit mis à jour avec succès');
      navigate('/admin/allproducts');
    } catch (error) {
      toast.error('Échec de la mise à jour du produit');
      console.error(error);
    }
  };

  return (
    <div className='container'>
      <Toaster />
      <h2>Modifier le produit</h2>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Nom du produit:</label>
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>Prix:</label>
          <input type='number' value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label>Couleurs (séparées par des virgules):</label>
          <input type='text' value={color.join(',')} onChange={(e) => setColor(e.target.value.split(','))} />
        </div>

        <div>
          <label>Catégorie:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value=''>Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Sous-catégorie:</label>
          <input type='text' value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
        </div>

        <div>
          <label>Genre:</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value=''>Sélectionner un genre</option>
            <option value='Homme'>Homme</option>
            <option value='Femme'>Femme</option>
            <option value='Mixte'>Mixte</option>
          </select>
        </div>

        <div>
          <label>Tailles (séparées par des virgules):</label>
          <input type='text' value={size.join(',')} onChange={(e) => setSize(e.target.value.split(','))} />
        </div>

        <div>
          <label>Produit en vedette:</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label>
              <input
                type='radio'
                value='yes'
                checked={isFeatured === true}
                onChange={() => setIsFeatured(true)}
              />
              Oui
            </label>
            <label>
              <input
                type='radio'
                value='no'
                checked={isFeatured === false}
                onChange={() => setIsFeatured(false)}
              />
              Non
            </label>
          </div>
        </div>

        <button type='submit'>Mettre à jour</button>
      </form>
    </div>
  );
};

export default ModifyProduct;
