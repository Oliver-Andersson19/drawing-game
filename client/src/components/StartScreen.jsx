import React, { useState } from 'react'
import './StartScreen.css'
import useSocket from "../hooks/useSocket.js";

function StartScreen() {

  const [username, setUsername] = useState(null)

  const socket = useSocket();


  const handleUpdateUsername = () => {
    if (username) {
      socket.updateUsername(username)
    }
  }

  console.log(username)

  return (
    <div className='name-selection-container'>
      <input type="text" onChange={(e) => setUsername(e.target.value)}/>
      <button onClick={handleUpdateUsername}>JOIN</button>
    </div>
  )
}

export default StartScreen