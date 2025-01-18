// server/server.js
import express from 'express';
import http from 'http';
import { setupSocket } from './socket.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Serve static files (optional: for serving a front-end app)
app.use(express.static('../client/dist'));

// Setup socket.io
setupSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
