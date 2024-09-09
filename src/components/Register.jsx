import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://proyecto-6-94j0.onrender.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      setSuccessMessage('Registro exitoso. Serás redirigido al inicio de sesión en 3 segundos.');
      setErrorMessage('');

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-pink-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-700">Registro de Usuario</h1>
        <form onSubmit={registerUser}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nombre de Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
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
            Registrarme
          </button>
        </form>
        {successMessage && <div className="text-green-500 mt-4 text-center">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Register;
