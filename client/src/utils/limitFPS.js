export function limitFPS(fn, fps) {
  let lastTime = 0;
  const interval = 1000 / fps; // Convert FPS to ms per frame

  return function (...args) {
    const now = Date.now();
    const timeElapsed = now - lastTime;

    if (timeElapsed >= interval) {
      fn(...args); // Call the function if enough time has passed
      lastTime = now; // Update the last time
    }
  };
}
