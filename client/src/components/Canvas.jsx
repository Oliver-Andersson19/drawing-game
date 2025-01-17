import React, { useRef, useEffect } from "react";
import "./Canvas.css";

const Canvas = ({ updateDataURL, serverDataUrl, canDraw }) => {

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
    if (!canDraw) {
      isDrawingRef.current = false;
    }

  }, [canDraw]);

  useEffect(() => {
    //Stop recieving server canvas if user is the drawer
    if (canDraw) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = (container.offsetWidth * 2) / 3; // Maintain 3:2 aspect ratio
    const context = canvas.getContext("2d");
    
    if (serverDataUrl) {
      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
          context.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the image
        }, 50); // Add a small delay to avoid the flicker
      };
      img.src = serverDataUrl; // Set image source to the server's data URL
    }
  }, [serverDataUrl, canDraw])
  

  const startDrawing = (e) => {
    if (!canDraw) return; // Prevent drawing if it's not the user's turn
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawingRef.current = true; // Start drawing
  };

  const draw = (e) => {
    if (!canDraw || !isDrawingRef.current) return; // Prevent drawing if not allowed
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Send the drawing to the server
    const dataURL = canvasRef.current.toDataURL();
    updateDataURL(dataURL);
  };

  const stopDrawing = () => {
    if (!canDraw) return;
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      contextRef.current.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updateDataURL(canvas.toDataURL()); // Update the server with the cleared canvas
  };

  return (
    <>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing} // Handle mouse leaving the canvas
          onMouseLeave={stopDrawing}
          style={{ cursor: canDraw ? "crosshair" : "not-allowed" }}
          />
      </div>
      <button onClick={clearCanvas} disabled={!canDraw} >
        CLEAR
      </button>
    </>
  );
};

export default Canvas;
