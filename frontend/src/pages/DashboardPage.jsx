import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      // Ambil token dari Local Storage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this page.');
        setLoading(false);
        return;
      }

      // Siapkan header otorisasi untuk request Axios
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        setLoading(true);
        // Panggil endpoint baru yang terproteksi
        const response = await axios.get('http://localhost:5000/api/events/my-events/all', config);
        setMyEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your events.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>My Dashboard</h1>
        <Button as={Link} to="/events/create">Create New Event</Button>
      </div>
      
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
                  <Button variant="info" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm">Delete</Button>
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