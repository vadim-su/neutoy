import GyroSensor from './gyro.js';
import MatrixDisplay from './matrix.js';
import Triggers from './triggers.js';


var systems;
var timeouts = [];


export function init_lib() {
    // Initialize matrix display
    const matrixDisplay = _init_matrix();

    // Initialize gyroscope
    const gyroscope = _init_gyro();

    // Initialize button
    const triggers = _init_button();

    systems = {
        "display": matrixDisplay,
        "gyroscope": gyroscope,
        "triggers": triggers
    };
}

export function set_button_handler(handler) {
    systems.triggers.on_button_pressed(handler);
}

export function set_pixel(x, y, color) {
    systems.display.setPixel(x, y, color);
}

export function clear() {
    systems.display.clear();
}

export function draw(colorMatrix, defaultColor) {
    systems.display.draw(colorMatrix, defaultColor);
}

export function set_timeout(func, delay) {
    const timer = setTimeout(func, delay);
    timeouts.push(timer);
    return timer;
}

export function cleanup() {
    set_button_handler(null);
    for (let timer of timeouts) {
        clearTimeout(timer);
    }
    timeouts = [];
    clear();
}

function _init_matrix() {
    // Initialize matrix display
    const pixels = document.querySelectorAll('.pixel');
    const matrixDisplay = new MatrixDisplay(pixels, 10, 10);
    matrixDisplay.clear();
    return matrixDisplay;
}

function _init_gyro() {
    // Initialize gyroscope
    const gyro_sensor = new GyroSensor();
    const gyroData = document.getElementById('gyro-data');
    setInterval(() => {
        const gyro = gyro_sensor.readData();
        const { x, y, z } = gyro;
        gyroData.textContent = `${x}, ${y}, ${z}`;
    }, 1000);
    return gyro_sensor;
}

function _init_button() {
    // Initialize button
    const button = document.getElementById('touch_button');
    const triggers = new Triggers();
    triggers.bind_handler(button);
    return triggers;
}
