import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!token) {
      // Jalankan hitung mundur setiap 1 detik
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Arahkan ke login setelah 3 detik
      const timeout = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <Container className="mt-5 text-center" style={{ maxWidth: '600px' }}>
        <Alert variant="warning" className="shadow-sm">
          <Alert.Heading className="fw-bold">Akses Terbatas 🔒</Alert.Heading>
          <p>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
          <hr />
          <div className="d-flex align-items-center justify-content-center gap-3">
            <Spinner animation="border" size="sm" variant="warning" />
            <span className="mb-0">
              Mengarahkan ke halaman login dalam <strong>{countdown} detik</strong>...
            </span>
          </div>
        </Alert>
      </Container>
    );
  }

  // Jika ada token, tampilkan halaman yang seharusnya
  return children;
}

export default ProtectedRoute;