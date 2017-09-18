/**
 * Controller "Class" to act as a bridge between view and model.
 * @author Daniel Burkhart.
 *
 * @constructor
 */
function GameOfLifeController() {
    this.grid = [];
    this.gameOfLife = '';
    this.makeTableAndGrid(10, 10, true);
}

/**
 * Creates the table on the view and then creates the grid for the model.
 * @param rows
 * The number of rows
 * @param cols
 * The number of cols.
 * @param random
 * If this is a random population or not.
 */
GameOfLifeController.prototype.makeTableAndGrid = function (rows, cols, random) {
    this.grid = this.buildGrid(rows, cols, random);
    this.gameOfLife = new GameOfLife(this.grid);
    this.gameOfLife.newCurrBoard(this.buildTable(this.grid));
};

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
    console.log("From buildNewTable");
    this.makeTableAndGrid(rows, cols, random);
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

/**
 * Dynamically builds the table for the view so that it matches the grid.
 * Also creates cell objects.
 * @param grid
 * @returns {Array}
 */
GameOfLifeController.prototype.buildTable = function (grid) {

    var gameTable = $("#gameTable");

    var currBoard = [];

    grid.forEach(function (row, yCoordinate) {
        var tr = $('<tr>');

        currBoard.push(row.map(
            function (item, xCoordinate) {

                var td = $('<td>');
                var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

                td.attr('id', tdId);
                tr.append(td);

                gameTable.append(tr);

                return {
                    x: xCoordinate,
                    y: yCoordinate,
                    item: new Cell(item, td)
                };
            }));
    });

    console.log(gameTable);

    return currBoard;
};

