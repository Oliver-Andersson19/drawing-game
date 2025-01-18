import React, { useState, useCallback } from "react";
import Canvas from "./Canvas";
import useSocket from "../hooks/useSocket.js";

const GameScreen = () => {
  
  const socket = useSocket();
  

  return (
    <div className="game-screen">
      <h3>
        {socket.currentDrawer
          ? socket.canDraw
            ? "Your turn to draw!"
            : `User ${socket.currentDrawer} is drawing.`
          : "Waiting for turn..."}
      </h3>
      <Canvas/>
    </div>
  );
};

export default GameScreen;
