import React, { useRef, useEffect } from "react";

const MirroredCanvas = ({ dataURL }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (dataURL) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Create an image and draw it on the canvas
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      };
      image.src = dataURL;
    }
  }, [dataURL]);

  return (
    <div>
      <h2>Mirrored Canvas</h2>
      <canvas ref={canvasRef} style={{ border: "2px solid black" }} />
    </div>
  );
};

export default MirroredCanvas;