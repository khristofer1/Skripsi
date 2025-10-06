import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        setLoading(false);
        return;
      }
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      try {
        setLoading(true);
        // Ambil data user dan data event secara bersamaan
        const [userResponse, eventsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users/me', config),
          axios.get('http://localhost:5000/api/events/my-events/all', config)
        ]);
        
        setUser(userResponse.data);
        setMyEvents(eventsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk delete
  const handleDelete = async (eventId) => {
    // Tampilkan konfirmasi sebelum menghapus
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        // Kirim permintaan DELETE ke backend
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, config);
        
        setSuccess('Event deleted successfully.');
        
        // Perbarui daftar event di UI tanpa perlu refresh halaman
        setMyEvents(myEvents.filter(event => event.id !== eventId));

      } catch (err) {
        setError('Failed to delete the event.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border"/>
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>My Dashboard</h1>
        <Button as={Link} to="/events/create">Create New Event</Button>
      </div>
      {user && (
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>My Points</Card.Title>
                <Card.Text className="fs-2 fw-bold">{user.points}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>My Referral Code</Card.Title>
                <Card.Text className="fs-2 fw-bold">{user.id}</Card.Text>
                <Card.Subtitle className="text-muted">Share this code with new users!</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <h3>My Events</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myEvents.length > 0 ? (
            myEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{new Date(event.event_date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <Button as={Link} to={`/events/edit/${event.id}`} variant="info" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(event.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">You have not created any events yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardPage;