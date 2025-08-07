import React from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faVk, faYoutube, faTelegram } from '@fortawesome/free-brands-svg-icons';

export async function getServerSideProps() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`);
        return {
            props: {
                contactInfo: response.data,
            },
        };
    } catch (error) {
        console.error('Error fetching contact info for SSR:', error);
        return {
            props: {
                contactInfo: { instagram: '#', vk: '#', youtube: '#', telegram: '#' },
            },
        };
    }
}

const ContactPage = ({ contactInfo }) => {
    return (
        <>
            <Head>
                <title>Контакты Анжелы Моисеенко - Свяжитесь со мной</title>
                <meta name="description" content="Свяжитесь с Анжелой Моисеенко через социальные сети: Instagram, VK, YouTube, Telegram." />
            </Head>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h1 className="mb-4 text-center">Свяжитесь со мной</h1>
                        <ListGroup variant="flush">
                            {contactInfo.instagram && contactInfo.instagram !== '#' && (
                                <ListGroupItem className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faInstagram} size="2x" className="me-3" />
                                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                                </ListGroupItem>
                            )}
                            {contactInfo.vk && contactInfo.vk !== '#' && (
                                <ListGroupItem className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faVk} size="2x" className="me-3" />
                                    <a href={contactInfo.vk} target="_blank" rel="noopener noreferrer">VK</a>
                                </ListGroupItem>
                            )}
                            {contactInfo.youtube && contactInfo.youtube !== '#' && (
                                <ListGroupItem className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faYoutube} size="2x" className="me-3" />
                                    <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
                                </ListGroupItem>
                            )}
                            {contactInfo.telegram && contactInfo.telegram !== '#' && (
                                <ListGroupItem className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={faTelegram} size="2x" className="me-3" />
                                    <a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
                                </ListGroupItem>
                            )}
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ContactPage;
