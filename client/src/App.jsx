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
  const [gameState, setGameState] = useState("game")


  // console.log()

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
