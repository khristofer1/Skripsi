import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  // State untuk menyimpan daftar event
  const [events, setEvents] = useState([]);
  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(true);

  // useEffect akan berjalan satu kali saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Panggil API untuk mendapatkan semua event
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data); // Simpan data event ke state
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading events...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1>Upcoming Events</h1>
      <Row>
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(event.event_date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Link as={Link} to={`/events/${event.id}`}>
                    View Details
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </Row>
    </Container>
  );
}

export default HomePage;