import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get('/api/testimonials');
            setTestimonials(response.data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            setError('Не удалось загрузить отзывы.');
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Вы не авторизованы.');
            return;
        }

        try {
            await axios.post('/api/testimonials', { author, text, rating: parseInt(rating) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Отзыв успешно добавлен!');
            setAuthor('');
            setText('');
            setRating('');
            fetchTestimonials();
        } catch (err) {
            console.error('Error adding testimonial:', err);
            setError('Не удалось добавить отзыв.');
        }
    };

    const handleDelete = async (id) => {
        setError(null);
        setSuccess(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Вы не авторизованы.');
            return;
        }

        try {
            await axios.delete(`/api/testimonials/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Отзыв успешно удален!');
            fetchTestimonials();
        } catch (err) {
            console.error('Error deleting testimonial:', err);
            setError('Не удалось удалить отзыв.');
        }
    };

    return (
        <div>
            <h3>Управление Отзывами</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group controlId="formAuthor" className="mb-3">
                    <Form.Label>Автор</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите имя автора"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formText" className="mb-3">
                    <Form.Label>Текст отзыва</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Введите текст отзыва"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formRating" className="mb-3">
                    <Form.Label>Рейтинг (1-5)</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Введите рейтинг (необязательно)"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Добавить Отзыв
                </Button>
            </Form>

            <h4>Существующие Отзывы</h4>
            {testimonials.length === 0 ? (
                <p>Отзывов пока нет.</p>
            ) : (
                <ListGroup>
                    {testimonials.map((testimonial) => (
                        <ListGroup.Item key={testimonial.id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{testimonial.author}</h5>
                                <p>"{testimonial.text}"</p>
                                {testimonial.rating && <p>Рейтинг: {testimonial.rating}/5</p>}
                            </div>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(testimonial.id)}>
                                Удалить
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default AdminTestimonials;
