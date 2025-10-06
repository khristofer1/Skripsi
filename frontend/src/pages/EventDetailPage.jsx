import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';

function EventDetailPage() {
  const { id } = useParams(); // Hook untuk mengambil 'id' dari URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk pesan registrasi
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Cek apakah ada token untuk menentukan status login
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Efek ini akan berjalan lagi jika 'id' di URL berubah

  // Fungsi untuk registrasi event
  const handleRegister = async () => {
    if (!token) {
      navigate('/login'); // Arahkan ke login jika belum login
      return;
    }

    try {
      setRegisterError('');
      setRegisterSuccess('');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const body = { event_id: id };

      // Panggil endpoint registrasi
      await axios.post('http://localhost:5000/api/registrations', body, config);
      setRegisterSuccess('You have successfully registered for this event and earned 10 points!');

    } catch (err) {
      setRegisterError(err.response?.data || 'Registration failed.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {event && (
        <Card>
          <Card.Header as="h2">{event.title}</Card.Header>
          <Card.Body>
            <Card.Text>{event.description}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              <strong>Date:</strong> {new Date(event.event_date).toLocaleString()}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              <strong>Location:</strong> {event.location}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              <strong>Price:</strong> Rp {event.price.toLocaleString('id-ID')}
            </Card.Subtitle>

            {/* Tampilkan pesan sukses/error */}
            {registerSuccess && <Alert variant="success">{registerSuccess}</Alert>}
            {registerError && <Alert variant="danger">{registerError}</Alert>}

            {/* Tombol registrasi hanya muncul jika user sudah login */}
            {token && (
              <Button variant="primary" size ="lg" onClick={handleRegister}>
                Register for this Event
              </Button>
            )}
            {!token && (
              <p className="text-muted">You must be logged in to register for an event.</p>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default EventDetailPage;