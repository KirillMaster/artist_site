import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Head from 'next/head';

export async function getServerSideProps() {
    try {
        const response = await axios.get(`${process.env.API_URL}/api/videos`);
        return {
            props: {
                videos: response.data.map(v => ({
                    id: v.id,
                    title: v.title,
                    description: v.description,
                    sortOrder: v.sortOrder,
                })),
            },
        };
    } catch (error) {
        console.error('Error fetching videos for SSR:', error);
        return {
            props: {
                videos: [],
            },
        };
    }
}

const VideosPage = ({ videos }) => {
    const renderPlaceholders = () => {
        const placeholders = [];
        for (let i = 0; i < 3; i++) {
            placeholders.push(
                <Col key={i} sm={12} md={6} lg={4} className="mb-4">
                    <Card className="placeholder-card">
                        <h5>Будущее видео</h5>
                        <p>Это место зарезервировано для предстоящего видео.</p>
                    </Card>
                </Col>
            );
        }
        return placeholders;
    };

    return (
        <>
            <Head>
                <title>Видео Анжелы Моисеенко - Галерея видео</title>
                <meta name="description" content="Посмотрите коллекцию видео Анжелы Моисеенко." />
            </Head>
            <Container className="mt-5">
                <h1 className="text-center mb-5">Видео Галерея</h1>
                {
                    videos.length > 0 ? (
                        <Row>
                            {videos.map(video => (
                                <Col key={video.id} sm={12} md={6} lg={4} className="mb-4">
                                    <Card>
                                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                            <video controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} src={`/api/videos/${video.id}/data`}>
                                                Ваш браузер не поддерживает тег video.
                                            </video>
                                        </div>
                                        <Card.Body>
                                            <Card.Title>{video.title}</Card.Title>
                                            <Card.Text>{video.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Row>
                            {renderPlaceholders()}
                        </Row>
                    )
                }
            </Container>
        </>
    );
};

export default VideosPage;