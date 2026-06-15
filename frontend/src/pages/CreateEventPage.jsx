import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import API, { getErrorMessage } from '../api';
import { useNavigate } from 'react-router-dom';

function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Helper untuk memformat ribuan dengan titik (contoh: 150000 -> "150.000")
  const formatRibuan = (value) => {
    if (value === '') return '';
    if (value === 0 || value === '0') return '0';
    const numberString = value.toString().replace(/[^0-9]/g, '');
    if (!numberString) return '';
    return parseInt(numberString, 10).toLocaleString('id-ID');
  };

  // Menghilangkan titik sebelum disimpan ke state asli
  const parseRibuan = (value) => {
    if (value === '') return '';
    const rawValue = value.replace(/\./g, '');
    return parseInt(rawValue, 10) || 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData({ ...formData, price: parseRibuan(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create an event.');
      return;
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Bersihkan nilai price jika kosong menjadi 0
    const submissionData = {
      ...formData,
      price: formData.price === '' ? 0 : formData.price
    };

    try {
      await API.post('/api/events', submissionData, config);
      setSuccess('Event created successfully! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create event.'));
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create New Event</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date and Time</Form.Label>
          <Form.Control type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="text" name="price" value={formatRibuan(formData.price)} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Create Event</Button>
      </Form>
    </Container>
  );
}

export default CreateEventPage;