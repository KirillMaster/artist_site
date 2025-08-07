import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Image from 'next/image';

const PaintingModal = ({ show, onHide, painting }) => {
    if (!painting) {
        return null; // Don't render if no painting is selected
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{painting.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <Image
                    src={`/api/paintings/${painting.id}/image`}
                    alt={painting.title}
                    layout="responsive"
                    width={800} // Примерная ширина
                    height={600} // Примерная высота
                    objectFit="contain"
                />
                <p className="mt-3">{painting.description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaintingModal;
