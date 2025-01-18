import { useState, useEffect } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [serverDataUrl, setServerDataUrl] = useState(null);
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [canDraw, setCanDraw] = useState(false);

  useEffect(() => {
    const socketInstance = io("/"); // Connect to the socket server
    setSocket(socketInstance);

    // Listen for events
    socketInstance.on("receiveDrawing", (data) => {
      setServerDataUrl(data.url);
    });

    socketInstance.on("updateTurn", (turnInfo) => {
      setCurrentDrawer(turnInfo.currentDrawer);
      setCanDraw(turnInfo.currentDrawer === socketInstance.id);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, serverDataUrl, currentDrawer, canDraw };
};

export default useSocket;
