import React, { useState, useEffect, useCallback } from "react";
import Canvas from "./components/Canvas.jsx";
import { throttle } from "./utils/throttle.js";
import { limitFPS } from './utils/limitFPS.js';

import io from "socket.io-client";
import "./App.css";
import StartScreen from "./components/StartScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import EndScreen from "./components/EndScreen.jsx";

const App = () => {
  // const [dataURL, setDataURL] = useState(null); // Holds the dataURL for the client's canvas
  // const [serverDataUrl, setServerDataUrl] = useState(null) // Holds the data URL of the server canvas
  // const [socket, setSocket] = useState(null);
  
  //Game states etc..
  const [gameState, setGameState] = useState("game")
  // const [currentDrawer, setCurrentDrawer] = useState(null);
  // const [canDraw, setCanDraw] = useState(false); // Tracks if the current user can draw
  

  // const updateDataURL = useCallback(
  //   limitFPS((url) => {
  //     setDataURL(url); // Update the drawing data URL
  //     if (socket) {
  //       socket.emit("drawData", url); // Send the drawing data to the server
  //     }
  //   }, 20),
  //   [socket]
  // )

  // useEffect(() => {
  //   const socketInstance = io("/"); // Connect to the socket server

  //   setSocket(socketInstance);

  //   // Listen for the drawing data from other users
  //   socketInstance.on("receiveDrawing", (data) => {
  //     setServerDataUrl(data.url); // Update the canvas with the received drawing
  //   });

  //   // Listen for the turn updates
  //   socketInstance.on("updateTurn", (turnInfo) => {
  //     setCurrentDrawer(turnInfo.currentDrawer);
  //     setCanDraw(turnInfo.currentDrawer === socketInstance.id); // Only allow drawing if it's the user's turn
  //   });

  //   // Disconnect from socket when the component unmounts
  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, []);

  console.log(gameState)

  return (
    <div className="App">
      <div className="page-wrapper">
        {gameState === "start" && <StartScreen />}
        {gameState === "game" && <GameScreen />}
        {gameState === "end" && <EndScreen />}
      </div>
    </div>
  );
};

export default App;
