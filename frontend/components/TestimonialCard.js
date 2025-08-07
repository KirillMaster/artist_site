import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const TestimonialCard = ({ testimonial }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    color={i < rating ? "gold" : "lightgray"}
                />
            );
        }
        return stars;
    };

    return (
        <Card className="testimonial-card">
            <Card.Body>
                <Card.Text>"{testimonial.text}"</Card.Text>
                <Card.Title className="mb-0">- {testimonial.author}</Card.Title>
                {testimonial.rating && (
                    <div className="mt-2">
                        {renderStars(testimonial.rating)}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default TestimonialCard;
