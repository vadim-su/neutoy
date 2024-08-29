// src/js/gyro.js

// GyroSensor class
class GyroSensor {
  // Method to read gyro data
  readData() {
    return {
      x: (Math.random() * 2 - 1).toFixed(2),
      y: (Math.random() * 2 - 1).toFixed(2),
      z: (Math.random() * 2 - 1).toFixed(2),
  }
}
}

// Export GyroSensor class
export default GyroSensor;
