import React, { createContext, useReducer } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Estado inicial
const initialState = {
  user: null,
  cart: [],
};

// Reducer para manejar las acciones
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, cart: [] };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    default:
      return state;
  }
};

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, cart: state.cart, login, logout, addToCart }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
