import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000; // Change to port 3000

let currentDrawer = null; // The ID of the current drawer
let drawingData = null; // The drawing data URL that will be shared with clients
let users = []; // To keep track of all connected users

// Serve static files (optional: for serving a front-end app)
app.use(express.static('../client/dist'));

// Function to rotate turns between users
const rotateTurns = () => {
  if (users.length > 0) {
    // Rotate the drawer by changing the currentDrawer to the next user in the list
    const currentIndex = users.indexOf(currentDrawer);
    const nextIndex = (currentIndex + 1) % users.length;
    currentDrawer = users[nextIndex];
    io.emit('updateTurn', { currentDrawer });
    console.log("Changing turn to: " + currentDrawer)
  }
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Add the new user to the users list
  if (!users.includes(socket.id)) {
    users.push(socket.id);
  }

  // Send the current turn to the newly connected user
  socket.emit('updateTurn', { currentDrawer });
  // If there is a canvas, send it to the new user
  if (drawingData) {
    socket.emit('receiveDrawing', { url: drawingData });
  }

  // Listen for drawing data from the client and broadcast it to everyone
  socket.on('drawData', (url) => {
    drawingData = url;
    io.emit('receiveDrawing', { url }); // Broadcast drawing data to everyone
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from the list of connected users
    users = users.filter(user => user !== socket.id);

    if (socket.id === currentDrawer) {
      currentDrawer = null; // Reset the drawer if the current one disconnected
      io.emit('updateTurn', { currentDrawer });
    }
  });
});

// Rotate turns every 10 seconds (only once on the server)
setInterval(rotateTurns, 3000); // Change turns every 10 seconds

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
