import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditEventPage() {
  const { id } = useParams(); // Mengambil ID event dari URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    price: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect untuk mengambil data event yang akan diedit saat halaman dimuat
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
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
        setError('Failed to fetch event data.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, formData, config);
      setSuccess('Event updated successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to update event.');
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
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Update Event</Button>
      </Form>
    </Container>
  );
}

export default EditEventPage;