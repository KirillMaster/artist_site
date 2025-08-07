import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

const AdminAbout = ({ token }) => {
    const [biography, setBiography] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentPhotoPath, setCurrentPhotoPath] = useState('');
    const [landingPagePhoto, setLandingPagePhoto] = useState(null);
    const [currentLandingPagePhotoPath, setCurrentLandingPagePhotoPath] = useState('');
    const [welcomeTitle, setWelcomeTitle] = useState('');
    const [welcomeSubtitle, setWelcomeSubtitle] = useState('');

    useEffect(() => {
        axios.get('/api/about')
            .then(response => {
                setBiography(response.data.biography);
                setCurrentPhotoPath(response.data.photoPath);
                setCurrentLandingPagePhotoPath(response.data.landingPagePhotoPath);
                setWelcomeTitle(response.data.welcomeTitle);
                setWelcomeSubtitle(response.data.welcomeSubtitle);
            })
            .catch(error => {
                console.error('Error fetching about info:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('biography', biography);
        formData.append('welcomeTitle', welcomeTitle);
        formData.append('welcomeSubtitle', welcomeSubtitle);
        if (photo) {
            formData.append('photo', photo);
        }
        if (landingPagePhoto) {
            formData.append('landingPagePhoto', landingPagePhoto);
        }

        axios.post('/api/about', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            alert('About info updated successfully!');
            setCurrentPhotoPath(response.data.photoPath);
            setCurrentLandingPagePhotoPath(response.data.landingPagePhotoPath);
            setWelcomeTitle(response.data.welcomeTitle);
            setWelcomeSubtitle(response.data.welcomeSubtitle);
            setPhoto(null);
            setLandingPagePhoto(null);
        })
        .catch(error => {
            console.error('Ошибка обновления информации "Обо мне":', error);
        });
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h3>Edit About Information</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Biography</Form.Label>
                            <Form.Control as="textarea" rows={10} value={biography} onChange={(e) => setBiography(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Artist Photo</Form.Label>
                            <Form.Control type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                            {currentPhotoPath && (
                                <div className="mt-2">
                                    <p>Current Photo:</p>
                                    <Image src={`/api${currentPhotoPath}`} alt="Current Artist Photo" width={150} height={150} />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Landing Page Background Photo</Form.Label>
                            <Form.Control type="file" onChange={(e) => setLandingPagePhoto(e.target.files[0])} />
                            {currentLandingPagePhotoPath && (
                                <div className="mt-2">
                                    <p>Current Landing Page Background Photo:</p>
                                    <Image src={`/api${currentLandingPagePhotoPath}?t=${Date.now()}`} alt="Current Landing Page Background Photo" width={150} height={150} />
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Welcome Title (Landing Page)</Form.Label>
                            <Form.Control type="text" value={welcomeTitle} onChange={(e) => setWelcomeTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Welcome Subtitle (Landing Page)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={welcomeSubtitle} onChange={(e) => setWelcomeSubtitle(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save About Info
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminAbout;
