import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { limitFPS } from "../utils/limitFPS.js";

// Create socket instance
let socket;

const useSocket = () => {

  const [currentServerDataUrl, setCurrentServerDataUrl] = useState(null);
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [canDraw, setCanDraw] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [userList, setUserList] = useState([])
  const [gameState, setGameState] = useState("start")

  // Initialize socket only once
  if (!socket) {
    socket = io("/");
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

  const updateUsername = (username) => {
    socket.emit("setUsername", username)
  }

  useEffect(() => {
    // Listen for events
    const handleConnect = () => setIsConnected(true); // Set connection status to true
    const handleDisconnect = () => setIsConnected(false); // Set connection status to false
    const handleUpdateUsers = (users) => setUserList(users);

    const handleReceiveDrawing = (data) => setCurrentServerDataUrl(data.url);

    const handleUpdateTurn = (turnInfo) => {
      setCurrentDrawer(turnInfo.currentDrawer);
      setCanDraw(turnInfo.currentDrawer === socket.id);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receiveDrawing", handleReceiveDrawing);
    socket.on("updateTurn", handleUpdateTurn);
    socket.on("updateUsers", handleUpdateUsers);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receiveDrawing", handleReceiveDrawing);
      socket.off("updateTurn", handleUpdateTurn);
    };
  }, []);

  return { updateUsername, socket, currentServerDataUrl, currentDrawer, canDraw, isConnected, sendDataURL, gameState, userList };
};

export default useSocket;
