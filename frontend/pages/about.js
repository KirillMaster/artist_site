import React from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Image from 'next/image';

export async function getServerSideProps() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
        return {
            props: {
                aboutInfo: response.data,
            },
        };
    } catch (error) {
        console.error('Error fetching about info for SSR:', error);
        return {
            props: {
                aboutInfo: { biography: 'Failed to load biography.', photoMimeType: '', landingPagePhotoMimeType: '', welcomeTitle: '', welcomeSubtitle: '' },
            },
        };
    }
}

const AboutPage = ({ aboutInfo }) => {
    return (
        <>
            <Head>
                <title>Об Анжела Моисеенко - Биография и творческий путь</title>
                <meta name="description" content="Узнайте больше о Анжела Моисеенко, его биографии, вдохновении и художественном стиле." />
            </Head>
            <Container className="mt-5">
                <script type="application/ld+json">
                {`
                    {
                        "@context": "http://schema.org",
                        "@type": "Person",
                        "name": "[Artist's Name]", // Placeholder for artist's name
                        "url": "[Artist's Website URL]", // Placeholder for artist's website URL
                        "image": "/api/about/photo",
                        "description": "${aboutInfo.biography}",
                        "sameAs": [
                            "[Instagram URL]", // Placeholder for Instagram
                            "[VK URL]",        // Placeholder for VK
                            "[YouTube URL]",   // Placeholder for YouTube
                            "[Telegram URL]"   // Placeholder for Telegram
                        ]
                    }
                `}
                </script>
                <Row className="justify-content-center">
                    <Col md={8} className="text-center">
                        <h1 className="mb-4">About the Artist</h1>
                        {aboutInfo.photoMimeType && aboutInfo.photoMimeType.length > 0 && (
                            <Image
                                src={`/api/about/photo?t=${Date.now()}`}
                                alt="Портрет Анжелы Моисеенко"
                                width={200} // Примерная ширина
                                height={200} // Примерная высота
                                layout="fixed"
                                className="roundedCircle img-fluid"
                            />
                        )}
                        <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{aboutInfo.biography}</p>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AboutPage;
