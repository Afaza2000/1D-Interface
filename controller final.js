class Controller {
    constructor() {
        this.gameState = "PLAY";
        this.colorDetectionStartTime = null; // Track when the color detection started

        // Define the list of possible target colors
        this.targetColors = [
            color(206, 0, 0),    // Dark Red
            color(115, 0, 45),   // Deep Purple-Red
            color(230, 245, 72), // Yellow-Green
            color(159, 120, 0),  // Brown-Yellow
            color(187, 0, 14),   // Crimson
            color(87, 70, 50),   // Dark Brown
            color(80, 0, 0),     // Deep Red
            color(69, 0, 0),     // Very Dark Red
            color(135, 115, 0),  // Olive
            color(25, 0, 0),     // Very Dark Maroon
            color(105, 55, 100), // Purple-Brown
            color(200, 45, 20),  // Bright Red-Orange
            color(142, 0, 10),   // Dark Crimson
            color(200, 0, 0),    // Bright Red
            color(87, 40, 94),   // Purple
            color(200, 60, 0)    // Orange-Red
        ];
    }

    update() {
        switch (this.gameState) {
            case "PLAY":
                display.clear();

                // Show all players in the right place
                display.setPixel(playerOne.position, playerOne.playerColor);

                // Add the target
                display.setPixel(target.position, target.playerColor);

                // Check the color sensor
                this.checkColorSensor();

                break;

            case "COLLISION":
                display.clear();

                // Play explosion animation one frame at a time
                let frameToShow = collisionAnimation.currentFrame();
                for (let i = 0; i < collisionAnimation.pixels; i++) {
                    display.setPixel(i, collisionAnimation.animation[frameToShow][i]);
                }

                if (frameToShow === collisionAnimation.animation.length - 1) {
                    if (playerOne.score >= score.max) {
                        score.winner = playerOne.playerColor;
                        this.gameState = "SCORE";
                    } else {
                        target.position = parseInt(random(0, displaySize));
                        target.playerColor = this.getRandomTargetColor(); // Use predefined colors
                        this.startNewLevel();
                        this.gameState = "PLAY";
                    }
                }

                break;

            case "SCORE":
                playerOne.score = 0;
                target.position = parseInt(random(1, displaySize));
                display.setAllPixels(score.winner);
                this.gameState = "END";
                break;

            case "END":
                break;

            default:
                break;
        }
    }

    checkColorSensor() {
        const detectedColor = colorSensor.getRGB();
    
        // Extract the target's RGB values
        const targetR = red(target.playerColor);
        const targetG = green(target.playerColor);
        const targetB = blue(target.playerColor);
    
        // Log the target's RGB values and the detected color
        console.log("Target Color:", { r: targetR, g: targetG, b: targetB });
        console.log("Detected Color:", detectedColor);
    
        if (this.colorsMatch(detectedColor, { r: targetR, g: targetG, b: targetB })) {
            console.log("Color matched!");
            if (!this.colorDetectionStartTime) {
                this.colorDetectionStartTime = performance.now();
            } else if (performance.now() - this.colorDetectionStartTime >= 3000) {
                this.simulateEnterKey();
                this.colorDetectionStartTime = null;
            }
        } else {
            console.log("Color did not match.");
            this.colorDetectionStartTime = null;
        }
    }

    colorsMatch(color1, color2, tolerance = 10) {
        return (
            Math.abs(color1.r - color2.r) <= tolerance &&
            Math.abs(color1.g - color2.g) <= tolerance &&
            Math.abs(color1.b - color2.b) <= tolerance
        );
    }

    simulateEnterKey() {
        if (playerOne.position === target.position) {
            playerOne.score++;
            this.gameState = "COLLISION";
        } else {
            display.setAllPixels(color(0, 0, 0));
            display.show();
            this.gameState = "BLACK_SCREEN";
        }
    }

    // Helper function to get a random target color
    getRandomTargetColor() {
        return this.targetColors[Math.floor(Math.random() * this.targetColors.length)];
    }
}