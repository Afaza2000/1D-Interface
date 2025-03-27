let port;
let reader;
let detectedColor = { r: 0, g: 0, b: 0 };
let lastDetectedColor = null;
let colorDetectionStartTime = null;

// Predefined target colors
const targetColors = [
    { r: 0, g: 0, b: 255 },    // Blue
    { r: 0, g: 255, b: 0 },    // Green
    { r: 255, g: 0, b: 0 },    // Red
    { r: 255, g: 255, b: 0 },  // Yellow
    { r: 255, g: 0, b: 255 },  // Magenta
    { r: 0, g: 255, b: 255 },  // Cyan
    { r: 122, g: 0, b: 122 },  // Purple
    { r: 122, g: 122, b: 0 },  // Olive
    { r: 122, g: 255, b: 122 },// Light Green
    { r: 0, g: 122, b: 122 },  // Teal
    { r: 122, g: 122, b: 255 },// Light Blue
    { r: 255, g: 122, b: 122 },// Light Red
    { r: 255, g: 122, b: 0 },  // Orange
    { r: 0, g: 122, b: 255 },  // Sky Blue
    { r: 255, g: 0, b: 122 },  // Pink
    { r: 122, g: 0, b: 255 }   // Violet
];

// Function to connect to the Arduino via Web Serial
async function connectToColorSensor() {
    try {
        // Request a port and open a connection
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        // Set up a reader to read data from the serial port
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        console.log("Connected to color sensor!");
        readColorData();
    } catch (error) {
        console.error("Error connecting to color sensor:", error);
    }
}

// Function to read RGB data from the Arduino
async function readColorData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Reader closed");
                break;
            }
            if (value) {
                // Parse the RGB values from the serial data
                const [r, g, b] = value.trim().split(",").map(Number);
                detectedColor = { r, g, b };
                checkColorMatch();
            }
        }
    } catch (error) {
        console.error("Error reading color data:", error);
    }
}

// Function to check if the detected color matches a target color
function checkColorMatch() {
    for (const target of targetColors) {
        if (colorsMatch(detectedColor, target)) {
            if (!lastDetectedColor || !colorsMatch(lastDetectedColor, detectedColor)) {
                // Start the timer if the color is detected for the first time
                lastDetectedColor = detectedColor;
                colorDetectionStartTime = performance.now();
            } else if (performance.now() - colorDetectionStartTime >= 3000) {
                // If the color is detected for 3 seconds, simulate the Enter key press
                simulateEnterKey();
                lastDetectedColor = null; // Reset for the next detection
                break;
            }
        } else {
            // Reset if the color changes
            lastDetectedColor = null;
            colorDetectionStartTime = null;
        }
    }
}

// Function to check if two colors match within a tolerance
function colorsMatch(color1, color2, tolerance = 10) {
    return (
        Math.abs(color1.r - color2.r) <= tolerance &&
        Math.abs(color1.g - color2.g) <= tolerance &&
        Math.abs(color1.b - color2.b) <= tolerance
    );
}

// Function to simulate the Enter key press
function simulateEnterKey() {
    console.log("Color matched for 3 seconds! Simulating Enter key...");
    keyPressed({ keyCode: ENTER });
}

// Function to disconnect from the Arduino
async function disconnectFromColorSensor() {
    if (reader) {
        await reader.cancel();
        reader = null;
    }
    if (port) {
        await port.close();
        port = null;
    }
    console.log("Disconnected from color sensor");
}