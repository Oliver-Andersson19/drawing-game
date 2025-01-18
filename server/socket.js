import { Server } from 'socket.io';

export const setupSocket = (server) => {
  
    const io = new Server(server);
  
    let currentDrawer = null; // The ID of the current drawer
    let drawingData = null; // The drawing data URL that will be shared with clients
    let users = []; // To keep track of all connected users
  
    // Function to rotate turns between users
    const rotateTurns = () => {
      if (users.length > 0) {
        const currentIndex = users.indexOf(currentDrawer);
        const nextIndex = (currentIndex + 1) % users.length;
        currentDrawer = users[nextIndex];
        io.emit('updateTurn', { currentDrawer });
        console.log('USER LIST', users);
      }
    };
  
    // Handle socket connections
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
      
      socket.on('setUsername', (username) => {
        
        const user = users.find(user => user.id === socket.id);
        if (user) {
          user.username = username; // Update the username for the specific user
          console.log(`${socket.id} is now known as ${username}`);
          // Emit the updated users list to all clients
          io.emit('updateUsers', users);
        }
        
      });
      
      // Add the new user to the users list
      if (!users.includes(socket.id)) {
        users.push({
          id: socket.id,
          username: null
        });
      }

      io.emit('updateUsers', users);
  
      // Send the current turn to the newly connected user
      socket.emit('updateTurn', { currentDrawer });
  
      // If there is a canvas, send it to the new user
      if (drawingData) {
        socket.emit('receiveDrawing', { url: drawingData });
      }
  
      // Listen for drawing data from the client and broadcast it to everyone
      socket.on('drawData', (url) => {
        drawingData = url;
        io.emit('receiveDrawing', { url });
      });
  
      // Handle disconnections
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
  
        // Remove user from the list of connected users
        users = users.filter((user) => user.id !== socket.id);
  
        if (socket.id === currentDrawer) {
          currentDrawer = null; // Reset the drawer if the current one disconnected
          io.emit('updateTurn', { currentDrawer });
        }

        io.emit('updateUsers', users)
      });
    });
  
    // Rotate turns every 10 seconds
    setInterval(rotateTurns, 3000); // Change turns every 10 seconds
  };
  