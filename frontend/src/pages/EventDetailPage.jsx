import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

function EventDetailPage() {
  const { id } = useParams(); // Hook untuk mengambil 'id' dari URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default EventDetailPage;