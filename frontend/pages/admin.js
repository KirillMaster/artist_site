import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import AdminPaintings from '../components/AdminPaintings';
import AdminContact from '../components/AdminContact';
import AdminAbout from '../components/AdminAbout';
import AdminVideos from '../components/AdminVideos';
import AdminTestimonials from '../components/AdminTestimonials';

const AdminPage = () => {
    const [token, setToken] = useState(null);
    const [key, setKey] = useState('paintings');

    useEffect(() => {
        // Access localStorage only on the client side
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    const handleLogin = (newToken) => {
        setToken(newToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', newToken);
        }
    };

    const handleLogout = () => {
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    };

    return (
        <Container className="mt-5">
            {token ? (
                <>
                    <h2 className="text-center mb-4">Панель Администратора</h2>
                    <Tabs
                        id="admin-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="paintings" title="Картины">
                            <AdminPaintings token={token} onLogout={handleLogout} />
                        </Tab>
                        <Tab eventKey="contact" title="Контактная информация">
                            <AdminContact token={token} />
                        </Tab>
                        <Tab eventKey="about" title="Обо мне">
                            <AdminAbout token={token} />
                        </Tab>
                        <Tab eventKey="videos" title="Видео">
                            <AdminVideos token={token} onLogout={handleLogout} />
                        </Tab>
                        <Tab eventKey="testimonials" title="Отзывы">
                            <AdminTestimonials token={token} onLogout={handleLogout} />
                        </Tab>
                    </Tabs>
                </>
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </Container>
    );
};

export default AdminPage;
