import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

const AdminPaintings = ({ token, onLogout }) => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [theme, setTheme] = useState('');
    const [image, setImage] = useState(null);
    const [paintings, setPaintings] = useState([]);
    const [groupOrder, setGroupOrder] = useState([]);

    useEffect(() => {
        fetchPaintings();
        fetchGroupOrder();
    }, []);

    const fetchPaintings = () => {
        axios.get('/api/paintings')
            .then(response => {
                setPaintings(response.data);
                // Generate group keys from fetched paintings
                const uniqueGroupKeys = [...new Set(response.data.map(p => p.theme || p.year.toString()))];
                // Only update groupOrder if it's empty or if the fetched order is empty
                if (groupOrder.length === 0 || (response.data.orderedGroupKeys && JSON.parse(response.data.orderedGroupKeys).length === 0)) {
                    setGroupOrder(uniqueGroupKeys);
                }
            })
            .catch(error => {
                console.error('Error fetching paintings:', error);
            });
    };

    const fetchGroupOrder = () => {
        axios.get('/api/grouporder')
            .then(response => {
                if (response.data && response.data.orderedGroupKeys) {
                    const fetchedOrder = JSON.parse(response.data.orderedGroupKeys);
                    if (fetchedOrder.length > 0) {
                        setGroupOrder(fetchedOrder);
                    } else {
                        // If fetched order is empty, generate from paintings
                        axios.get('/api/paintings')
                            .then(paintingsResponse => {
                                const uniqueGroupKeys = [...new Set(paintingsResponse.data.map(p => p.theme || p.year.toString()))];
                                setGroupOrder(uniqueGroupKeys);
                            })
                            .catch(error => {
                                console.error('Error fetching paintings for group order generation:', error);
                            });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching group order:', error);
            });
    };

    const handleGroupReorder = async (groupKey, direction) => {
        const index = groupOrder.indexOf(groupKey);
        if (index === -1) return;

        const newGroupOrder = [...groupOrder];
        const [removed] = newGroupOrder.splice(index, 1);

        if (direction === 'up') {
            if (index === 0) return;
            newGroupOrder.splice(index - 1, 0, removed);
        } else if (direction === 'down') {
            if (index === newGroupOrder.length - 1) return;
            newGroupOrder.splice(index + 1, 0, removed);
        }

        setGroupOrder(newGroupOrder); // Optimistic update

        try {
            await axios.post('/api/grouporder', newGroupOrder, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Group order updated successfully!');
        } catch (error) {
            console.error('Group reorder failed!', error);
            alert('Не удалось обновить порядок. Пожалуйста, обновите страницу и попробуйте снова.');
            fetchGroupOrder(); // Revert on error
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('year', year);
        formData.append('theme', theme);
        formData.append('image', image);

        axios.post('/api/paintings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            alert('Painting uploaded successfully!');
            setTitle('');
            setDescription('');
            setYear('');
            setTheme('');
            setImage(null);
            fetchPaintings(); // Refresh the list of paintings
            router.push('/gallery'); // Redirect to gallery page
        })
        .catch(error => {
            console.error('Upload failed!', error);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this painting?')) {
            axios.delete(`/api/paintings/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                alert('Painting deleted successfully!');
                fetchPaintings(); // Refresh the list of paintings
            })
            .catch(error => {
                console.error('Delete failed!', error);
            });
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h3>Upload New Painting</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Theme/Cycle</Form.Label>
                            <Form.Control
                                type="text"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Upload Painting
                        </Button>
                        <Button variant="secondary" onClick={onLogout} className="mt-3 ms-2">
                            Logout
                        </Button>
                    </Form>

                    <h3 className="mt-5">Manage Existing Paintings</h3>
                    <ListGroup>
                        {paintings.map(painting => (
                            <ListGroup.Item key={painting.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    {painting.title} ({painting.year})
                                </div>
                                <div>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleReorder(painting.id, 'up')}>
                                        Up
                                    </Button>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleReorder(painting.id, 'down')}>
                                        Down
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(painting.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <h3 className="mt-5">Manage Group Order</h3>
                    <ListGroup>
                        {groupOrder.length > 0 ? (
                            groupOrder.map(groupKey => (
                                <ListGroup.Item key={groupKey} className="d-flex justify-content-between align-items-center">
                                    {groupKey}
                                    <div>
                                        <Button variant="info" size="sm" className="me-2" onClick={() => handleGroupReorder(groupKey, 'up')}>
                                            Up
                                        </Button>
                                        <Button variant="info" size="sm" onClick={() => handleGroupReorder(groupKey, 'down')}>
                                            Down
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>No groups to reorder. Upload some paintings first.</ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminPaintings;
