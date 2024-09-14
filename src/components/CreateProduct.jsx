// pages/CreateProduct.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products/create', form);
      navigate('/product-management');
    } catch (error) {
      console.error('Error al crear el producto', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Producto</h1>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={form.price}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />
      <button type="submit">Crear</button>
    </form>
  );
};

export default CreateProduct;
