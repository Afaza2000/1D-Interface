class Display {
  constructor(_displaySize, _pixelSize) {
      this.displaySize = _displaySize;
      this.pixelSize = _pixelSize;
      this.displayBuffer = [];
      this.initialColors = [];

      // Assign initial white color to all pixels
      for(let i = 0; i < this.displaySize; i++){
          let whiteColor = color(255, 255, 255);
          this.displayBuffer[i] = whiteColor;
          this.initialColors[i] = whiteColor;
      }

      // Change colors after one second
      setTimeout(() => {
          this.changeColors();
      }, 500); // 1000 milliseconds = 1 second
  }

  // Change colors of all pixels
  changeColors() {
      for(let i = 0; i < this.displaySize; i++){
          let randomColor = color(random(255), random(255), random(255));
          this.displayBuffer[i] = randomColor;
          this.initialColors[i] = randomColor;
      }
  }

  // Color a specific pixel in the buffer
  setPixel(_index, _color) {
      this.displayBuffer[_index] = _color;
  }

  // Color all pixels in the buffer
  setAllPixels(_color) {
      for(let i = 0; i < this.displaySize; i++) { 
          this.setPixel(i, _color); 
      }
  }

  // Now write it to screen
  // This is the only function in the entire software that writes something directly to the screen. I recommend you keep it this way.
  show() {
      for (let i = 0; i < this.displaySize; i++) {
          fill(this.displayBuffer[i]);
          rect(i * this.pixelSize, 0, this.pixelSize, this.pixelSize);
      }
  }

  // Set a new random color for the display
  setRandomColor() {
      for(let i = 0; i < this.displaySize; i++) {
          this.displayBuffer[i] = color(random(255), random(255), random(255)); // Assign a new random color to each pixel
      }
  }

  // Let's empty the display before we start adding things to it again
  clear() {
      for(let i = 0; i < this.displaySize; i++) {    
          this.displayBuffer[i] = this.initialColors[i]; // Reset to initial random color
      }
  }

  // Reset all pixels to white
  resetToWhite() {
      for(let i = 0; i < this.displaySize; i++) {
          let whiteColor = color(255, 255, 255);
          this.displayBuffer[i] = whiteColor;
          this.initialColors[i] = whiteColor;
      }
  }
}

