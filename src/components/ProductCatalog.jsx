import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

function ProductCatalog() {
  const { cart, addToCart } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product/readall');
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

    fetchProducts();
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <div className="product-catalog bg-pink-50 min-h-screen p-8 font-sans">
      <h1 className="text-4xl font-bold text-pink-700 text-center mb-8">Catálogo de Productos</h1>

      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">Carrito de Compras</h2>
        <div>{cart.length === 0 ? 'El carrito está vacío.' : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - {formatPrice(item.price)}</li>
            ))}
          </ul>
        )}
        </div>
        <p className="text-lg font-bold mt-4">
          Total: {formatPrice(cart.reduce((total, product) => total + product.price, 0))}
        </p>
        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => setShowModal(true)}>
          Ir a pagar
        </button>
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
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => addToCart(product)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold text-pink-700 mb-4">Lo siento</h2>
            <p>Lo siento, no logré integrar un método de pago :(</p>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;
