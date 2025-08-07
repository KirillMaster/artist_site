import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    const [contactInfo, setContactInfo] = useState({
        instagram: '#',
        vk: '#',
        youtube: '#',
        telegram: '#'
    });

    useEffect(() => {
        axios.get('/api/contact')
            .then(response => {
                setContactInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching contact info for footer:', error);
            });
    }, []);

    return (
        <footer className="footer mt-auto py-3">
            <Container>
                <Row>
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>Анжела Моисеенко</h5>
                        <p>Художник-импрессионист, создающий яркие и эмоциональные картины.</p>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>Контакты</h5>
                        <ul className="list-unstyled">
                            {contactInfo.instagram && <li><a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
                            {contactInfo.vk && <li><a href={contactInfo.vk} target="_blank" rel="noopener noreferrer">VK</a></li>}
                            {contactInfo.youtube && <li><a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>}
                            {contactInfo.telegram && <li><a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer">Telegram</a></li>}
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h5>Навигация</h5>
                        <ul className="list-unstyled">
                            <li><a href="/">Главная</a></li>
                            <li><a href="/gallery">Галерея</a></li>
                            <li><a href="/about">Обо мне</a></li>
                            <li><a href="/contact">Контакты</a></li>
                            <li><a href="/videos">Видео</a></li>
                        </ul>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className="text-center">
                        <p>&copy; {new Date().getFullYear()} Анжела Моисеенко. Все права защищены.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;