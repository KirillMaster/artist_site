import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PaintingCard from '../components/PaintingCard';
import PaintingModal from '../components/PaintingModal';
import Head from 'next/head';

export async function getServerSideProps() {
    try {
        const paintingsResponse = await axios.get(`${process.env.API_URL}/api/paintings`);
        console.log('Paintings data from API:', paintingsResponse.data);
        const groupOrderResponse = await axios.get(`${process.env.API_URL}/api/grouporder`);

        let orderedGroupKeys = [];
        if (groupOrderResponse.data && groupOrderResponse.data.orderedGroupKeys) {
            orderedGroupKeys = JSON.parse(groupOrderResponse.data.orderedGroupKeys);
        }

        return {
            props: {
                paintings: paintingsResponse.data.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    year: p.year,
                    theme: p.theme,
                    sortOrder: p.sortOrder,
                    imageData: p.imageData, // Добавляем imageData
                    imageMimeType: p.imageMimeType // Добавляем imageMimeType
                })),
                orderedGroupKeys: orderedGroupKeys,
            },
        };
    } catch (error) {
        console.error('Error fetching data for SSR:', error);
        return {
            props: {
                paintings: [],
                orderedGroupKeys: [],
            },
        };
    }
}

const GalleryPage = ({ paintings, orderedGroupKeys }) => {
    console.log('Paintings received by GalleryPage:', paintings);
    const [showModal, setShowModal] = useState(false);
    const [selectedPainting, setSelectedPainting] = useState(null);

    const handleCardClick = (painting) => {
        setSelectedPainting(painting);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPainting(null);
    };

    const renderPlaceholders = () => {
        const placeholders = [];
        for (let i = 0; i < 6; i++) {
            placeholders.push(
                <Col key={i} sm={12} md={6} lg={4} className="mb-4">
                    <Card className="placeholder-card">
                        <h5>Будущий Шедевр</h5>
                        <p>Это место зарезервировано для предстоящего произведения искусства.</p>
                    </Card>
                </Col>
            );
        }
        return placeholders;
    };

    // Sort paintings by SortOrder first
    const sortedPaintings = [...paintings].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    // Group paintings by theme or year
    const groupedPaintings = sortedPaintings.reduce((acc, painting) => {
        const groupKey = painting.theme && painting.theme !== "" ? painting.theme : (painting.year ? painting.year.toString() : 'Uncategorized');
        console.log('Generated groupKey:', groupKey);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(painting);
        return acc;
    }, {});

    // Sort paintings within each group by SortOrder
    for (const groupKey in groupedPaintings) {
        groupedPaintings[groupKey].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    let finalSortedGroups = orderedGroupKeys.length > 0
        ? orderedGroupKeys.filter(key => groupedPaintings[key])
        : [];

    if (finalSortedGroups.length === 0) {
        finalSortedGroups = Object.keys(groupedPaintings).sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numB - numA;
            }
            return a.localeCompare(b);
        });
    }
    console.log('Final Sorted Groups:', finalSortedGroups);

    return (
        <>
            <Head>
                <title>Галерея картин Анжела Моисеенко - [Тема/Стиль]</title>
                <meta name="description" content="Посмотрите полную коллекцию картин Анжела Моисеенко, включая [Тема 1], [Тема 2] и многое другое." />
            </Head>
            <Container className="mt-5">
                <h1 className="text-center mb-5">Gallery of Works</h1>
                {
                    paintings.length > 0 ? (
                        finalSortedGroups.map(groupKey => (
                            <section key={groupKey} className="mb-5">
                                <h2 className="text-center mb-4">{groupKey}</h2>
                                <Row>
                                    {groupedPaintings[groupKey].map(painting => (
                                        <Col key={painting.id} sm={12} md={6} lg={4} className="mb-4">
                                            <PaintingCard painting={painting} onClick={() => handleCardClick(painting)} />
                                        </Col>
                                    ))}
                                </Row>
                            </section>
                        ))
                    ) : (
                        <Row>
                            {renderPlaceholders()}
                        </Row>
                    )
                }

                <PaintingModal show={showModal} onHide={handleCloseModal} painting={selectedPainting} />
            </Container>
        </>
    );
};

export default GalleryPage;
