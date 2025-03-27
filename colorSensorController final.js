const colorSensor = {
    rgb: { r: 0, g: 0, b: 0 },
    setRGB(newRGB) {
        this.rgb = newRGB;
    },
    getRGB() {
        return this.rgb;
    }
};

let port;
let reader;

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
                const match = value.trim().match(/R: (\d+) G: (\d+) B: (\d+)/);
                if (match) {
                    const r = parseInt(match[1]);
                    const g = parseInt(match[2]);
                    const b = parseInt(match[3]);
                    colorSensor.setRGB({ r, g, b });
                    console.log("Detected Color:", { r, g, b });
                }
            }
        }
    } catch (error) {
        console.error("Error reading color data:", error);
    }
}