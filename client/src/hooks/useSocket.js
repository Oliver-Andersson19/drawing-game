import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { limitFPS } from "../utils/limitFPS.js";

// Create a singleton socket instance
let socket;

const useSocket = () => {
  const [currentServerDataUrl, setCurrentServerDataUrl] = useState(null);
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [canDraw, setCanDraw] = useState(false);

  // Initialize socket only once
  if (!socket) {
    socket = io("/"); // Establish connection only once
  }

  // Send data URL to server
  const sendDataURL = useCallback(
    limitFPS((url) => {
      if (socket) {
        socket.emit("drawData", url); // Send the drawing data to the server
      }
    }, 20),
    []
  );

  useEffect(() => {
    // Listen for events
    const handleReceiveDrawing = (data) => setCurrentServerDataUrl(data.url);
    const handleUpdateTurn = (turnInfo) => {
      setCurrentDrawer(turnInfo.currentDrawer);
      setCanDraw(turnInfo.currentDrawer === socket.id);
    };

    socket.on("receiveDrawing", handleReceiveDrawing);
    socket.on("updateTurn", handleUpdateTurn);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("receiveDrawing", handleReceiveDrawing);
      socket.off("updateTurn", handleUpdateTurn);
    };
  }, []);

  return { socket, currentServerDataUrl, currentDrawer, canDraw, sendDataURL };
};

export default useSocket;
