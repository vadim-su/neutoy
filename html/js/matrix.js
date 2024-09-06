/**
 * Represents a color alphabet mapping.
 * @type {Object.<string, string>}
 */
const colorAlphabet = {
    'R': 'red',
    'G': 'green',
    'B': 'blue',
    'Y': 'yellow',
    'P': 'purple',
    'O': 'orange',
    'I': 'pink',
    'R': 'brown',
    'A': 'gray',
    'L': 'black',
    'W': 'white',
};


/**
 * Represents a matrix display.
 * @class
 * @param {number} width - The width of the display.
 * @param {number} height - The height of the display.
 */
class MatrixDisplay {
    /**
     * @class
     * @classdesc Represents a matrix with a specified width and height.
     * @param {Array<HTMLDivElement>} htmlPixelsList - The list of HTML pixel elements.
     * @param {number} width - The width of the matrix.
     * @param {number} height - The height of the matrix.
     */
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

    /**
     * Clears the pixel matrix by setting the background color of each pixel to white.
     */
    clear() {
        this.pixelMatrix.forEach(row => {
            row.forEach(pixel => {
                pixel.style.backgroundColor = 'white';
            });
        });
    }

    /**
     * Draws a matrix of colors on the canvas.
     *
     * @param {Array<string>} colorMatrix - The matrix of colors to be drawn.
     * @param {string} [defaultColor=''] - The default color to be used if a cell in the matrix is empty.
     * @returns {void}
     */
    draw(colorMatrix, defaultColor = '') {
        this.clear();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const colorCode = colorMatrix[y][x] || defaultColor;
                this.setPixel(x, y, colorCode);
            }
        }
    }

    /**
     * Sets the color of a pixel at the specified coordinates.
     *
     * @param {number} x - The x-coordinate of the pixel.
     * @param {number} y - The y-coordinate of the pixel.
     * @param {string} colorCode - The color code or name to set the pixel to.
     * @returns {void}
     */
    setPixel(x, y, colorCode) {
        const color = colorAlphabet[colorCode] || colorCode;
        this.pixelMatrix[y][x].style.backgroundColor = color;
    }


    /**
     * Retrieves the pixel color at the specified coordinates.
     *
     * @param {number} x - The x-coordinate of the pixel.
     * @param {number} y - The y-coordinate of the pixel.
     * @returns {string} The color code of the pixel, or the actual color if not found in the color alphabet.
     */
    getPixel(x, y) {
        const color = this.pixelMatrix[y][x].style.backgroundColor;
        const colorCode = Object.keys(colorAlphabet).find(key => colorAlphabet[key] === color);
        return colorCode || color;
    }
}


export default MatrixDisplay;
export { colorAlphabet };
