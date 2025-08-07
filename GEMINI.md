# Mom's Art Portfolio Website - Project Overview

This document summarizes the current state and functionalities of the Mom's Art Portfolio website.

## 1. Project Structure

The project is structured into two main parts:
-   `backend`: Contains the C# .NET Web API.
-   `frontend`: Contains the Next.js application.

Both parts are containerized using Docker and managed with `docker-compose`.

## 2. Backend (C# .NET Web API)

**Technology Stack:**
-   C# .NET 8.0
-   ASP.NET Core Web API
-   JWT (JSON Web Token) for authentication
-   PostgreSQL for persistent data storage
-   Entity Framework Core for ORM

**Data Models (Persisted in PostgreSQL):**
-   `Painting`: Represents an artwork with properties:
    -   `Id` (int)
    -   `Title` (string)
    -   `Description` (string)
    -   `ImagePath` (string - path to the image file, now served via `/api/uploads`)
    -   `Year` (int - year of creation)
    -   `Theme` (string - thematic grouping or cycle)
-   `ContactInfo`: Stores social media links:
    -   `Instagram` (string)
    -   `VK` (string)
    -   `YouTube` (string)
    -   `Telegram` (string)
-   `AboutInfo`: Stores artist's biography and photo path:
    -   `Biography` (string)
    -   `PhotoPath` (string - path to the artist's photo, now served via `/api/uploads`)

**API Endpoints:**
-   `/api/paintings` (GET): Retrieves a list of all paintings from PostgreSQL.
-   `/api/paintings` (POST, **Authorized**): Uploads a new painting (requires `title`, `description`, `year`, `theme`, `image` file). Data is now saved to PostgreSQL.
-   `/api/auth/login` (POST): Authenticates a user (`admin`/`admin`) and returns a JWT token.
-   `/api/contact` (GET): Retrieves current contact information.
-   `/api/contact` (POST, **Authorized**): Updates contact information.
-   `/api/about` (GET): Retrieves artist's biography and photo path.
-   `/api/about` (POST, **Authorized**): Updates artist's biography and uploads a new photo. Data is now saved to PostgreSQL.

**File Storage:**
-   Uploaded painting images and artist photos are stored locally in the `backend/uploads` directory. Served via `/api/uploads` endpoint.

## 3. Frontend (Next.js Application)

**Technology Stack:**
-   Next.js (for Server-Side Rendering and static site generation capabilities)
-   React.js
-   React-Bootstrap for UI components and responsive design
-   Axios for HTTP requests
-   `next/image` for optimized image handling
-   `next/head` for dynamic SEO meta tags
-   Custom CSS for impressionistic styling and animations.

**Pages:**
-   **Home Page (`/`):** The main entry point, designed in an impressionistic style with subtle animations. It features a welcome message and a call to action to view the gallery. Now uses dynamic meta tags.
-   **Gallery Page (`/gallery`):** Displays all artworks, grouped by year or theme. Each painting is shown as a card. Clicking on a card opens a modal window to view the painting in full resolution with its details. Uses `getServerSideProps` for SSR and dynamic meta tags.
-   **About Page (`/about`):** Dedicated page for the artist's biography and photo. Uses `getServerSideProps` for SSR and dynamic meta tags.
-   **Contact Page (`/contact`):** Displays social media links. Uses `getServerSideProps` for SSR and dynamic meta tags.
-   **Admin Page (`/admin`):** A protected route accessible only via direct URL.
    -   **Login Form:** Requires `admin`/`admin` credentials.
    -   **Admin Panel (after login):** Features a tabbed interface for:
        -   **Paintings:** Upload new paintings (title, description, year, theme, image file). Now redirects to gallery on success.
        -   **Contact Info:** Edit Instagram, VK, YouTube, and Telegram links.
        -   **About Artist:** Edit biography text and upload a new artist photo.

**Design Principles:**
-   **Impressionistic Style:** Achieved through soft color palettes, elegant typography (Lora, Playfair Display, Open Sans), and subtle background animations on the landing page.
-   **Responsiveness:** Built with Bootstrap for optimal viewing across devices.
-   **User Experience:** Clear navigation, interactive gallery with modal view for detailed artwork inspection, and a streamlined admin interface.

**SEO Enhancements:**
-   **Server-Side Rendering (SSR):** Implemented for core content pages (`/`, `/gallery`, `/about`, `/contact`) using Next.js `getServerSideProps` for improved crawlability and initial page load performance.
-   **Dynamic Meta Tags:** Utilized `next/head` to provide unique and descriptive `title` and `meta description` tags for each main content page.
-   **Image Optimization:** Integrated `next/image` component for automatic image optimization (resizing, compression, lazy loading) to improve page load speed and Core Web Vitals.
-   **API Proxying:** All frontend API calls and image requests are now proxied through the Next.js server (`/api/*`) to resolve cross-origin issues and simplify deployment.

## 4. Deployment

The entire application (backend, frontend, and PostgreSQL database) is designed to be built and run using Docker and `docker-compose`, ensuring consistent deployment across different environments.