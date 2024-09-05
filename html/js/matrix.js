class MatrixDisplay {
  constructor(htmlPixelsList, width, height) {
      const pixelsList = htmlPixelsList;
      this.width = width;
      this.height = height;

      this.pixelMatrix = this.createMatrix(pixelsList);
  }

  createMatrix(pixelsList) {
      const matrix = [];
      for (let y = 0; y < this.height; y++) {
          let row = [];
          for (let x = 0; x < this.width; x++) {
              row.push(pixelsList[y * this.width + x]);
          }
          matrix.push(row);
      }
      return matrix;
  }

  setPixel(x, y, color) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.pixelMatrix[y][x].style.backgroundColor = color;
      }
  }

  clear() {
      this.pixelMatrix.forEach(row => {
          row.forEach(pixel => {
              pixel.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
          });
      });
  }

  draw(colorMatrix, defaultColor = '') {
      this.clear();
      for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
              const color = colorMatrix[y][x] || defaultColor;
              this.setPixel(x, y, color);
          }
  }
}

  getPixel(x, y) {
      return this.pixelMatrix[y][x];
  }
}

export default MatrixDisplay;
