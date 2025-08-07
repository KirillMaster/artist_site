import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import TestimonialCard from '../components/TestimonialCard';

export async function getServerSideProps() {
    try {
        const aboutResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
        const testimonialsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
        console.log('Fetched aboutInfo for LandingPage:', aboutResponse.data);
        return {
            props: {
                aboutInfo: aboutResponse.data,
                testimonials: testimonialsResponse.data,
            },
        };
    } catch (error) {
        console.error('Error fetching landing page info for SSR:', error);
        return {
            props: {
                aboutInfo: { biography: '', photoMimeType: '', landingPagePhotoMimeType: '', welcomeTitle: 'Welcome to the Art of [Artist Name]', welcomeSubtitle: 'Discover a world of vibrant colors and captivating still life impressionism.' },
                testimonials: [],
            },
        };
    }
}

const LandingPage = ({ aboutInfo, testimonials }) => {
    return (
        <>
            <Head>
                <title>Анжела Моисеенко Арт Портфолио - Главная страница</title>
                <meta name="description" content="Официальный сайт-портфолио Анжелы Моисеенко. Откройте для себя уникальные картины и погрузитесь в мир искусства." />
            </Head>
            <div className="landing-page d-flex align-items-center justify-content-center text-center text-white"
                 style={aboutInfo.landingPagePhotoMimeType && aboutInfo.landingPagePhotoMimeType.length > 0 ? { backgroundImage: `url(/api/about/landingphoto)` } : {}}>
                <Container>
                    <h1 className="display-3 mb-4" style={{ color: '#FFFFFF', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)' }}>{aboutInfo.welcomeTitle}</h1>
                    <p className="lead mb-5" style={{ color: '#FFFFFF', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>{aboutInfo.welcomeSubtitle}</p>
                    <Button variant="light" size="lg" as={Link} href="/gallery">
                        Посмотреть Галерею
                    </Button>
                </Container>
            </div>

            {testimonials.length > 0 && (
                <Container className="mt-5 mb-5">
                    <h2 className="text-center mb-4">Отзывы</h2>
                    <Carousel
                        showArrows={true}
                        infiniteLoop={true}
                        showThumbs={false}
                        showStatus={false}
                        autoPlay={true}
                        interval={5000}
                    >
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id}>
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </Carousel>
                </Container>
            )}
        </>
    );
};

export default LandingPage;
