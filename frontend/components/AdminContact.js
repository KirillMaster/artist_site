import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AdminContact = ({ token }) => {
    const [contactInfo, setContactInfo] = useState({
        instagram: '',
        vk: '',
        youtube: '',
        telegram: ''
    });

    useEffect(() => {
        axios.get('/api/contact')
            .then(response => {
                setContactInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching contact info:', error);
            });
    }, []);

    const handleChange = (e) => {
        setContactInfo({
            ...contactInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/contact', contactInfo, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            alert('Contact info updated successfully!');
        })
        .catch(error => {
            console.error('Ошибка обновления контактной информации:', error);
        });
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h3>Edit Contact Information</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Instagram URL</Form.Label>
                            <Form.Control type="text" name="instagram" value={contactInfo.instagram} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>VK URL</Form.Label>
                            <Form.Control type="text" name="vk" value={contactInfo.vk} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>YouTube URL</Form.Label>
                            <Form.Control type="text" name="youtube" value={contactInfo.youtube} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Telegram URL</Form.Label>
                            <Form.Control type="text" name="telegram" value={contactInfo.telegram} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Contact Info
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminContact;
