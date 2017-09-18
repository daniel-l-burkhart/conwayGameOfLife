/**
 * Controller "Class" to act as a bridge between view and model.
 * @author Daniel Burkhart.
 *
 * @constructor
 */
function GameOfLifeController() {
    this.grid = this.buildGrid(10, 10, true);
    this.gameOfLife = new GameOfLife(this.grid);
}

/**
 * Starts the game
 */
GameOfLifeController.prototype.startTheGame = function () {
    this.gameOfLife.startGame();
};

/**
 * Stops the game
 */
GameOfLifeController.prototype.stopTheGame = function () {
    this.gameOfLife.stopGame();
};

/**
 * Progresses the game one generation.
 */
GameOfLifeController.prototype.updateOneGeneration = function () {
    this.gameOfLife.setCellNextStatesForSingleGeneration();
};

/**
 * Progresses the game X number of generations.
 *
 * @param numberOfGenerations
 *      The number of generations the game is progressed.
 */
GameOfLifeController.prototype.updateXGenerations = function (numberOfGenerations) {
    for (var currGen = 0; currGen < numberOfGenerations; currGen++) {
        this.gameOfLife.setCellNextStatesForSingleGeneration();
    }
};

/**
 * Builds a new table for the game.
 * @param rows
 *      The rows of the table.
 * @param cols
 *      The cols of the new table
 * @param random
 *      Bool parameter for if the population should be randomized or not.
 */
GameOfLifeController.prototype.buildNewTable = function (rows, cols, random) {
    this.grid = this.buildGrid(rows, cols, random);
    this.gameOfLife = new GameOfLife(this.grid);
};

/**
 * Updates a single cell in the grid as the result of a click.
 * @param id
 *      The id of the cell.
 * @param state
 *      The new state of the cell, ALIVE or DEAD!
 */
GameOfLifeController.prototype.updateASingleCell = function (id, state) {
    this.gameOfLife.updateSingleCell(id, state);
};

/**
 * Adds a row to the backend when the user adds a row on the view.
 */
GameOfLifeController.prototype.addRowToTheGrid = function () {

    this.gameOfLife.addRowToGrid();
};

/**
 * Adds a column to the backend when the user adds a col to the view.
 */
GameOfLifeController.prototype.addColumnToTheGrid = function () {

    this.gameOfLife.addColToGrid();
};

/**
 * Removes a row to the backend when the user removes a row on the view.
 */
GameOfLifeController.prototype.removeRowFromGrid = function () {

    this.gameOfLife.removeRow();
};

/**
 * Removes a column to the backend when the user removes a col to the view.
 */
GameOfLifeController.prototype.removeColumnFromGrid = function () {

    this.gameOfLife.removeColumn();
};

/**
 * Builds the grid - a 2D array - of 0s and 1s to denote dead or alive for each cell.
 * @param rowSize
 *      The number of rows.
 * @param colSize
 *      The number of columns
 * @param random
 *      If this population should be randomized.
 * @returns {Array}
 *      Returns an Array of Arrays that contains 0s or 1s.
 */
GameOfLifeController.prototype.buildGrid = function (rowSize, colSize, random) {
    var grid = [];

    for (var currRow = 0; currRow < rowSize; currRow++) {
        var row = [];
        for (var currColumn = 0; currColumn < colSize; currColumn++) {
            if (random) {
                var startCondition = Math.round(Math.random() * 0.7);
                row.push(startCondition);
            }
            else {
                row.push(0);
            }
        }
        grid.push(row);
    }
    return grid;
};
