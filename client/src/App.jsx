import React, { useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import EndScreen from "./components/EndScreen.jsx";
import useSocket from "./hooks/useSocket.js";

import "./App.css";


const App = () => {
  //socket hook
  const socket = useSocket();

  //Game states etc..


  console.log(socket.userList)



  return (
    <div className="App">
      <div className="page-wrapper">
        {socket.gameState === "start" && <StartScreen />}
        {socket.gameState === "game" && <GameScreen />}
        {socket.gameState === "end" && <EndScreen />}
      </div>
    </div>
  );
};

export default App;
