import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; 

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado y su token

  const token = user?.token || localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://proyecto-6-94j0.onrender.com/api/product/readall', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('https://proyecto-6-94j0.onrender.com/api/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', price: '', description: '', stock: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock
    });
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`https://proyecto-6-94j0.onrender.com/api/product/update/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          throw new Error('No puede editar este producto');
        }
        throw new Error('Error al actualizar el producto');
      }

      const updatedProduct = await response.json();
      setProducts(products.map((product) => (product._id === updatedProduct._id ? updatedProduct : product)));
      setNewProduct({ name: '', price: '', description: '', stock: '' });
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`https://proyecto-6-94j0.onrender.com/api/product/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          throw new Error('No puede eliminar este producto');
        }
        throw new Error('Error al eliminar el producto');
      }

      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <div className="product-management bg-pink-50 min-h-screen p-8 font-sans">
      <h1 className="text-4xl font-bold text-pink-700 text-center mb-8">Gestión de Productos</h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Nombre del Producto"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Precio"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            placeholder="Descripción"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </div>

      {loading && <div className="text-center">Cargando productos...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-6 rounded-lg shadow-lg border border-pink-200">
            <h2 className="text-2xl font-semibold text-pink-700 mb-2">{product.name}</h2>
            <p className="text-pink-accent mb-4">Precio: {formatPrice(product.price)}</p>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-sm text-pink-500 mt-2">Stock: {product.stock}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleEditProduct(product)}
            >
              Editar
            </button>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteProduct(product._id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductManagement;
