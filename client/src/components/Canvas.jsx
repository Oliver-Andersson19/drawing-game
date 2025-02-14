import React, { useRef, useEffect } from "react";
import useSocket from "../hooks/useSocket.js";

import "./Canvas.css";

const Canvas = ({ sendDataURL, currentServerDataUrl, canDraw }) => {

  //get socket
  const socket = useSocket();

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    // Create a temporary canvas to save the current content
    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");

    // Backup current canvas content
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempContext.drawImage(canvas, 0, 0);

    // Resize the canvas
    canvas.width = container.offsetWidth;
    canvas.height = (container.offsetWidth * 2) / 3; // Maintain 3:2 aspect ratio

    // Set up the drawing context
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    contextRef.current = context;

    // Restore the saved content
    if (tempCanvas.width && tempCanvas.height) {
      context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }

    // If not the user's turn, ensure drawing is disabled
    if (!socket.canDraw) {
      isDrawingRef.current = false;
    }

  }, [socket.canDraw]);

  useEffect(() => {
    //Stop recieving server canvas if user is the drawer
    if (socket.canDraw) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = (container.offsetWidth * 2) / 3; // Maintain 3:2 aspect ratio
    const context = canvas.getContext("2d");
    
    if (socket.currentServerDataUrl) {
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
          context.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
        }, 0); // Add a small delay to avoid the flicker
      };
      img.src = socket.currentServerDataUrl; // Set image source to the server's data URL
    }
  }, [socket.currentServerDataUrl, socket.canDraw])
  

  const startDrawing = (e) => {
    if (!socket.canDraw) return; // Prevent drawing if it's not the user's turn
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawingRef.current = true; // Start drawing
  };

  const draw = (e) => {
    if (!socket.canDraw || !isDrawingRef.current) return; // Prevent drawing if not allowed
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Send the drawing to the server
    const dataURL = canvasRef.current.toDataURL();
    socket.sendDataURL(dataURL);
  };

  const stopDrawing = () => {
    if (!socket.canDraw) return;
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      contextRef.current.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    socket.sendDataURL(canvas.toDataURL()); // Update the server with the cleared canvas
  };

  return (
    <>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ cursor: socket.canDraw ? "crosshair" : "not-allowed" }}
          />
      </div>
      <button onClick={clearCanvas} disabled={!socket.canDraw} >
        CLEAR
      </button>
    </>
  );
};

export default Canvas;
