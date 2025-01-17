import React, { useState, useEffect, useCallback } from "react";
import Canvas from "./components/Canvas.jsx";
import { throttle } from "./utils/throttle.js";
import { limitFPS } from './utils/limitFPS.js';

import io from "socket.io-client";
import "./App.css";

const App = () => {
  const [dataURL, setDataURL] = useState(null); // Holds the dataURL for the client's canvas
  const [serverDataUrl, setServerDataUrl] = useState(null) // Holds the data URL of the server canvas
  const [socket, setSocket] = useState(null);
  const [canDraw, setCanDraw] = useState(false); // Tracks if the current user can draw
  const [currentDrawer, setCurrentDrawer] = useState(null);

  const updateDataURL = useCallback(
    limitFPS((url) => {
      setDataURL(url); // Update the drawing data URL
      if (socket) {
        socket.emit("drawData", url); // Send the drawing data to the server
      }
    }, 20),
    [socket]
  )

  useEffect(() => {
    const socketInstance = io("/"); // Connect to the socket server

    setSocket(socketInstance);

    // Listen for the drawing data from other users
    socketInstance.on("receiveDrawing", (data) => {
      setServerDataUrl(data.url); // Update the canvas with the received drawing
    });

    // Listen for the turn updates
    socketInstance.on("updateTurn", (turnInfo) => {
      setCurrentDrawer(turnInfo.currentDrawer);
      setCanDraw(turnInfo.currentDrawer === socketInstance.id); // Only allow drawing if it's the user's turn
    });

    // Disconnect from socket when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <div className="page-wrapper">
        
        <h3>
          {currentDrawer
            ? canDraw
              ? "Your turn to draw!"
              : `User ${currentDrawer} is drawing.`
            : "Waiting for turn..."}
        </h3>
        
        <Canvas updateDataURL={updateDataURL} serverDataUrl={serverDataUrl} canDraw={canDraw} />

      </div>
    </div>
  );
};

export default App;
