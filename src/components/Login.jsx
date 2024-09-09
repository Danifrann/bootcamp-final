import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const loginData = await response.json();
      localStorage.setItem('token', loginData.token);

      // Verificar el token y obtener datos del usuario
      const userResponse = await fetch('http://localhost:3000/api/user/verifytoken', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Error al verificar el token');
      }

      const userData = await userResponse.json();
      login(userData);
      navigate('/catalog');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-700">Iniciar Sesión</h1>
        <form onSubmit={loginUser}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <button type="submit" className="bg-pink-500 text-white font-bold py-2 px-4 rounded hover:bg-pink-600 w-full">
            Iniciar Sesión
          </button>
        </form>
        {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
        <div className="text-center mt-4">
          <button onClick={() => navigate('/register')} className="text-pink-500 hover:text-pink-700">Registrarme</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
