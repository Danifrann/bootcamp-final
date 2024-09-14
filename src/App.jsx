import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductCatalog from './components/ProductCatalog';
import ProductManagement from './components/ProductManagement';  // Importa el nuevo componente
import AuthContext from './context/AuthContext';

function App() {
  const { user, login, logout } = useContext(AuthContext);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
  }, [login]);

  return (
    <Router>
      <div>
        {/* Mostrar el menú solo si el usuario está autenticado */}
        {user && (
          <nav className="bg-pink-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-white font-bold text-xl">
                {/* Usa Link en lugar de <a> */}
                <Link to="/catalog" className="hover:text-pink-300">Catálogo</Link>
                <Link to="/product-management" className="hover:text-pink-300 ml-4">Gestión de Productos</Link> {}
              </div>
              <div>
                <button onClick={logout} className="text-white hover:text-pink-300">Cerrar Sesión</button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          {}
          <Route path="/" element={!user ? <Login /> : <Navigate to="/catalog" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={user ? <ProductCatalog /> : <Navigate to="/" />} />
          <Route path="/product-management" element={user ? <ProductManagement /> : <Navigate to="/" />} /> {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
