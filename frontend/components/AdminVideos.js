import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';

const AdminVideos = ({ token, onLogout }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = () => {
        axios.get('/api/videos')
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('videoFile', videoFile);

        axios.post('/api/videos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            alert('Видео успешно загружено!');
            setTitle('');
            setDescription('');
            setVideoFile(null);
            fetchVideos(); // Refresh the list of videos
        })
        .catch(error => {
            console.error('Загрузка видео не удалась!', error);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это видео?')) {
            axios.delete(`/api/videos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                alert('Видео успешно удалено!');
                fetchVideos(); // Refresh the list of videos
            })
            .catch(error => {
                console.error('Удаление видео не удалось!', error);
            });
        }
    };

    const handleReorder = async (id, direction) => {
        const index = videos.findIndex(v => v.id === id);
        if (index === -1) return;

        const newVideos = [...videos];
        const [removed] = newVideos.splice(index, 1);

        if (direction === 'up') {
            if (index === 0) return;
            newVideos.splice(index - 1, 0, removed);
        } else if (direction === 'down') {
            if (index === newVideos.length - 1) return;
            newVideos.splice(index + 1, 0, removed);
        }

        setVideos(newVideos); // Optimistic update

        try {
            await axios.post('/api/videos/reorder', newVideos.map(v => v.id), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Порядок видео успешно обновлен!');
        } catch (error) {
            console.error('Не удалось обновить порядок видео!', error);
            alert('Не удалось обновить порядок видео. Пожалуйста, обновите страницу и попробуйте снова.');
            fetchVideos(); // Revert on error
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h3>Загрузить новое видео</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Видеофайл</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Загрузить видео
                        </Button>
                        <Button variant="secondary" onClick={onLogout} className="mt-3 ms-2">
                            Выйти
                        </Button>
                    </Form>

                    <h3 className="mt-5">Управление существующими видео</h3>
                    <ListGroup>
                        {videos.map(video => (
                            <ListGroup.Item key={video.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    {video.title}
                                </div>
                                <div>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleReorder(video.id, 'up')}>
                                        Вверх
                                    </Button>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleReorder(video.id, 'down')}>
                                        Вниз
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(video.id)}>
                                        Удалить
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminVideos;