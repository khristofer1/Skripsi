import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Jika tidak ada token, "lempar" pengguna ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang seharusnya
  return children;
}

export default ProtectedRoute;