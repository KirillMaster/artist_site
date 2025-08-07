import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'next/image';

const PaintingCard = ({ painting, onClick }) => {
    return (
        <Card onClick={onClick} style={{ cursor: 'pointer' }}>
            <script type="application/ld+json">
            {`
                {
                    "@context": "http://schema.org",
                    "@type": "CreativeWork",
                    "name": "${painting.title}",
                    "description": "${painting.description}",
                    "image": "/api/paintings/${painting.id}/image",
                    "dateCreated": "${painting.year}",
                    "genre": "${painting.theme}",
                    "creator": {
                        "@type": "Person",
                        "name": "Анжела Моисеенко" // Placeholder for artist's name
                    }
                }
            `}
            </script>
            <Image
                src={`data:${painting.imageMimeType};base64,${painting.imageData}`}
                alt={`${painting.title} - ${painting.description}`}
                width={300} // Примерная ширина
                height={200} // Примерная высота
                layout="responsive"
                objectFit="cover"
                className="card-img-top"
            />
            <Card.Body>
                <Card.Title>{painting.title}</Card.Title>
                <Card.Text>{painting.description}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default PaintingCard;
