import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductCatalog from './components/ProductCatalog';
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
                <a href="/catalog" className="hover:text-pink-300">Catálogo</a>
              </div>
              <div>
                <button onClick={logout} className="text-white hover:text-pink-300">Cerrar Sesión</button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          {/* Si el usuario está autenticado, redirigir al catálogo, de lo contrario, mostrar el login */}
          <Route path="/" element={!user ? <Login /> : <Navigate to="/catalog" />} />
          {/* Ruta de registro */}
          <Route path="/register" element={<Register />} />
          {/* Ruta del catálogo */}
          <Route path="/catalog" element={user ? <ProductCatalog /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
