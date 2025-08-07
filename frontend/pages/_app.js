import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'; // Путь к вашему App.css

import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from 'next/link'; // Используем Link из Next.js
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} href="/" className="artist-name">Анжела Моисеенко</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/">Главная</Nav.Link>
              <Nav.Link as={Link} href="/gallery">Галерея</Nav.Link>
              <Nav.Link as={Link} href="/about">Обо мне</Nav.Link>
              <Nav.Link as={Link} href="/contact">Контакты</Nav.Link>
              <Nav.Link as={Link} href="/videos">Видео</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Component {...pageProps} />
      </Container>
      <Footer />
    </>
  );
}

export default MyApp;