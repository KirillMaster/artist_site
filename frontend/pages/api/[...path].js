import httpProxy from 'http-proxy';

const API_URL = process.env.API_URL || 'http://backend:8080';
const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parser
  },
};

export default (req, res) => {
  proxy.web(req, res, {
    target: API_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      if (path.startsWith('/api/uploads') || path.startsWith('/api/videos')) {
        return path.replace('/api', ''); // Remove /api for uploads and videos
      }
      return path; // Keep /api for other API calls
    },
  }, (e) => {
    console.error('Proxy error:', e);
    res.status(500).send('Proxy error');
  });
};