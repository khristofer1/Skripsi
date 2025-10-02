import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar'; // Impor Navbar
import HomePage from './pages/HomePage';     // Impor halaman
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Container } from 'react-bootstrap';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import EventDetailPage from './pages/EventDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';

function App() {
  return (
    <>
      <AppNavbar /> {/* Navbar akan selalu tampil di atas */}
      <Container className="mt-4"> {/* Tambahkan Container Bootstrap */}
        <Routes>
          {/* Definisikan setiap rute */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route 
            path="/events/create" 
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/edit/:id" 
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;