/**
 * Controller "Class" to act as a bridge between view and model.
 * @author Daniel Burkhart.
 *
 * @constructor
 */
function GameOfLifeController() {
    this.grid = [];
    this.gameOfLife = new GameOfLife();
    this.makeTableAndGrid(10, 10, true);
}

/**
 * Creates the table on the view and then creates the gameMatrix for the model.
 * @param rows
 * The number of rows
 * @param cols
 * The number of cols.
 * @param random
 * If this is a random population or not.
 */
GameOfLifeController.prototype.makeTableAndGrid = function (rows, cols, random) {
    this.grid = this.buildGrid(rows, cols, random);
    this.board = this.buildTable(this.grid);
    this.gameOfLife.newGameBoard(this.board);
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
    this.makeTableAndGrid(rows, cols, random);
};

/**
 * Updates a single cell in the gameMatrix as the result of a click.
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
    this.addRowToBoard(this.grid);
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Adds a column to the backend when the user adds a col to the view.
 */
GameOfLifeController.prototype.addColumnToTheGrid = function () {
    this.addColumnToBoard();
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Removes a row to the backend when the user removes a row on the view.
 */
GameOfLifeController.prototype.removeRowFromGrid = function () {
    this.grid.pop();
    this.board.pop();
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Removes a column to the backend when the user removes a col to the view.
 */
GameOfLifeController.prototype.removeColumnFromGrid = function () {

    this.grid.forEach(function (row) {
        row.pop();
    });

    this.board.forEach(function (boardRow) {
        boardRow.pop();
    });

    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Builds the gameMatrix - a 2D array - of 0s and 1s to denote dead or alive for each cell.
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
 * Dynamically builds the table for the view so that it matches the gameMatrix.
 * Also creates cell objects.
 * @param grid
 *      The 2D matrix that is used in the model to represent the life of the cells.
 * @returns {Array}
 *      Returns the table.
 */
GameOfLifeController.prototype.buildTable = function (grid) {

    var self = this;
    var gameTable = $("#gameTable");
    var currBoard = [];

    grid.forEach(function (row, yCoordinate) {
        var tr = $('<tr>');
        tr.attr('id', yCoordinate);

        currBoard.push(row.map(
            function (item, xCoordinate) {

                var td = $('<td>');
                var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

                td.attr('id', tdId);
                td.on("click", function () {
                    if (td.attr('class') === 'alive') {
                        self.updateASingleCell(tdId, StatesOfLife.DEAD);
                    } else {
                        self.updateASingleCell(tdId, StatesOfLife.ALIVE);
                    }
                });

                tr.append(td);

                gameTable.append(tr);

                return {
                    x: xCoordinate,
                    y: yCoordinate,
                    cellObject: new Cell(item, td)
                };
            }));
    });

    return currBoard;
};

/**
 * Adds row to the game board.
 */
GameOfLifeController.prototype.addRowToBoard = function () {

    var self = this;
    var gameTable = $("#gameTable");
    var tr = $('<tr>');
    var gameGrid = this.grid;

    var row = [];
    console.log(gameGrid[0].length);

    for (var i = 0; i < gameGrid[0].length; i++) {
        row.push(0);
    }

    gameGrid.push(row);
    var yCoordinate = gameGrid.length - 1;
    tr.attr('id', yCoordinate);


    self.board.push(gameGrid[gameGrid.length - 1].map(
        function (item, xCoordinate) {

            var td = $('<td>');
            var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

            td.attr('id', tdId);
            td.on("click", function () {
                if (td.attr('class') === 'alive') {
                    self.updateASingleCell(tdId, StatesOfLife.DEAD);
                } else {
                    self.updateASingleCell(tdId, StatesOfLife.ALIVE);
                }
            });

            tr.append(td);

            gameTable.append(tr);

            return {
                x: xCoordinate,
                y: yCoordinate,
                cellObject: new Cell(item, td)
            };
        }));
};

/**
 * Adds column to the game board
 */
GameOfLifeController.prototype.addColumnToBoard = function () {
    var self = this;
    var gameGrid = this.grid;
    var gameBoard = this.board;

    gameGrid.forEach(function (row) {
        row.push(0);
    });

    var xCoord = document.getElementById('gameTable').rows[0].cells.length;
    var yCoord = 0;

    gameBoard.forEach(function (boardRow) {

        var trID = $('#' + yCoord + '');
        var tr = $(trID);
        var td = $('<td>');
        var tdId = 'x' + xCoord + 'y' + boardRow[0].y;
        td.attr('id', tdId);

        td.on("click", function () {
            if (td.attr('class') === 'alive') {
                self.updateASingleCell(tdId, StatesOfLife.DEAD);
            } else {
                self.updateASingleCell(tdId, StatesOfLife.ALIVE);
            }
        });

        boardRow.push({x: xCoord, y: boardRow[0].y, cellObject: new Cell(0, td)});
        tr.append(td);

        yCoord++;

    });
};