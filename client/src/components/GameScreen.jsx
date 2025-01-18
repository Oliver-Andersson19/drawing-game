import React, { useState, useCallback } from "react";
import Canvas from "./Canvas";
import useSocket from "../hooks/useSocket.js";
import { limitFPS } from "../utils/limitFPS.js";

const GameScreen = () => {
  const { socket, serverDataUrl, currentDrawer, canDraw } = useSocket();

  const updateDataURL = useCallback(
    limitFPS((url) => {
      if (socket) {
        socket.emit("drawData", url); // Send the drawing data to the server
      }
    }, 20),
    [socket]
  )

  return (
    <div className="game-screen">
      <h3>
        {currentDrawer
          ? canDraw
            ? "Your turn to draw!"
            : `User ${currentDrawer} is drawing.`
          : "Waiting for turn..."}
      </h3>
      <Canvas updateDataURL={updateDataURL} serverDataUrl={serverDataUrl} canDraw={canDraw} />
    </div>
  );
};

export default GameScreen;
