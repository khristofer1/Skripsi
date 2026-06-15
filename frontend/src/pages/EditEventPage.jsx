import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import API, { getErrorMessage } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function EditEventPage() {
  const { id } = useParams(); // Mengambil ID event dari URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

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

  // useEffect untuk mengambil data event yang akan diedit saat halaman dimuat
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await API.get(`/api/events/${id}`);
        const eventData = response.data;
        // Format tanggal agar sesuai dengan input type="datetime-local"
        const formattedDate = new Date(eventData.event_date).toISOString().slice(0, 16);
        setFormData({
          title: eventData.title,
          description: eventData.description,
          event_date: formattedDate,
          location: eventData.location,
          price: eventData.price,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event data.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    // Bersihkan nilai price jika kosong menjadi 0
    const submissionData = {
      ...formData,
      price: formData.price === '' ? 0 : formData.price
    };

    try {
      await API.put(`/api/events/${id}`, submissionData, config);
      setSuccess('Event updated successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update event.'));
    }
  };

  if (loading) return <Container className="mt-5 text-center">Loading event data...</Container>;

  return (
    <Container className="mt-5">
      <h2>Edit Event</h2>
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
        <Button variant="primary" type="submit">Update Event</Button>
      </Form>
    </Container>
  );
}

export default EditEventPage;