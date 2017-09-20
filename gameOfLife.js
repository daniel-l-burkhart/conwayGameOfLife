/**
 * Game of life "Class" that handles the "back end" work of the game.
 * @author Daniel Burkhart.
 *
 * @param grid
 *      The grid that ties to the table
 * @constructor
 *      Requires the grid to be built.
 */
function GameOfLife(grid) {

    this.currGeneration = 0;
    this.population = 0;

    this.grid = grid;

    this.generationText = $('#generation');
    this.populationText = $('#population');
    this.generationText.text(this.currGeneration);

    this.populationThreshold = 2;
    this.overCrowdingThreshold = 4;

    this.currBoard = [];
    this.keepWorking = false;

}

/**
 * Makes the currBoard build from the controller, and sets it to the model.
 * @param board
 *      The 2D array that is a game board.
 */
GameOfLife.prototype.newCurrBoard = function (board) {
    console.log("Called newCurrBoard");
    this.currBoard = board;
    this.getPopulation();
};

/**
 * Starts the game
 */
GameOfLife.prototype.startGame = function () {
    this.keepWorking = true;
    this.currGeneration = 1;
    this.generationText.text(this.currGeneration);

    var self = this;
    setInterval(function () {
        self.setCellNextStates();
    }, 1000);

};

/**
 * Stops the game.
 */
GameOfLife.prototype.stopGame = function () {
    this.keepWorking = false;
};

/**
 * Counts the living population at any given time.
 */
GameOfLife.prototype.getPopulation = function () {
    var localBoard = this.currBoard;
    var aliveCount = 0;

    localBoard.forEach(function (row) {
        row.forEach(function (cell) {
            aliveCount += cell.item.getProofOfLife();
        });
    });

    this.updatePopulation(aliveCount);
};

/**
 * Updates the population when a single cell is clicked on
 * @param newPopulation
 *      The new population of the game.
 */
GameOfLife.prototype.updatePopulation = function (newPopulation) {
    var self = this;
    this.population = newPopulation;
    this.populationText.text(self.population);
};

/**
 * Method to allow single update of table bypassing the boolean block that is used to stop the game.
 */
GameOfLife.prototype.setCellNextStatesForSingleGeneration = function () {
    this.keepWorking = true;
    this.setCellNextStates();
    this.keepWorking = false;
};

/**
 * Sets the "next" state of life for every cell based on their neighbors.
 */
GameOfLife.prototype.setCellNextStates = function () {

    if (!this.keepWorking) {
        return;
    }

    var self = this;
    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yCoordinate) {
        row.forEach(function (cell, xCoordinate) {

            var neighbors = self.getNeighbors(xCoordinate, yCoordinate);
            var aliveCount = 0;

            neighbors.forEach(function (cell) {
                aliveCount += cell.item.getProofOfLife();
            });

            if (aliveCount < self.populationThreshold || aliveCount >= self.overCrowdingThreshold) {
                cell.item.nextState = StatesOfLife.DEAD;
            } else {
                cell.item.nextState = StatesOfLife.ALIVE;
            }

        });
    });

    this.updateGeneration();
};

/**
 * Gets a single cell's neighbors to see if they're dead or not.
 * @param x
 *      The X Coordinate of the cell
 * @param y
 *      The Y Coordinate of the cell
 * @returns {Array}
 *      An array of any cell's neighbors.
 */
GameOfLife.prototype.getNeighbors = function (x, y) {

    /*
        "Private" method to get all possible neighbor locations for any given cell.
    */
    function getAllPossibleNeighbors() {
        var top = {xCoordinate: x, yCoordinate: y + 1};
        var left = {xCoordinate: x - 1, yCoordinate: y};
        var bottom = {xCoordinate: x, yCoordinate: y - 1};
        var right = {xCoordinate: x + 1, yCoordinate: y};

        var bottomLeft = {xCoordinate: x - 1, yCoordinate: y - 1};
        var topLeft = {xCoordinate: x - 1, yCoordinate: y + 1};
        var bottomRight = {xCoordinate: x + 1, yCoordinate: y - 1};
        var topRight = {xCoordinate: x + 1, yCoordinate: y + 1};

        return [
            top, left, bottom, right, bottomLeft, topLeft, bottomRight, topRight
        ];
    }

    var verifiedNeighbors = [];
    var localBoardState = this.currBoard;
    var allNeighborPositions = getAllPossibleNeighbors();

    allNeighborPositions.forEach(
        function (currCoordinate) {

            if (localBoardState[currCoordinate.yCoordinate] && localBoardState[currCoordinate.yCoordinate][currCoordinate.xCoordinate]) {

                verifiedNeighbors.push(localBoardState[currCoordinate.yCoordinate][currCoordinate.xCoordinate]);
            }
        }
    );

    return verifiedNeighbors;

};

/**
 * Updates the game one generation
 */
GameOfLife.prototype.updateGeneration = function () {
    var self = this;
    this.keepWorking = false;

    var localBoard = this.currBoard;
    var newPopulation = 0;

    localBoard.forEach(function (row) {
        row.forEach(function (cell) {

            if (cell.item.nextState !== cell.item.getProofOfLife() || !self.currGeneration) {
                self.keepWorking = true;
            }
            if (cell.item.nextState === StatesOfLife.ALIVE) {
                newPopulation++;
            }
            cell.item.setMortality(cell.item.nextState);
        });
    });

    this.generationText.text(this.currGeneration);
    this.currGeneration++;

    this.updatePopulation(newPopulation);
};

/**
 * Updates a single cell after a click
 * @param id
 *      The ID of the cell i.e. x10y10
 * @param value
 *      The new value for the cell, 1 = alive, 0 = dead.
 */
GameOfLife.prototype.updateSingleCell = function (id, value) {

    var coordinates = id.match(/\d+/g);
    var yCoordinate = parseInt(coordinates.pop());
    var xCoordinate = parseInt(coordinates.pop());
    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yIndex) {
        row.forEach(function (cell, xIndex) {

            if (yIndex === yCoordinate && xIndex === xCoordinate) {
                cell.item.setMortality(value);
            }
        });
    });

    var newPopulation = this.population;
    (value === StatesOfLife.ALIVE) ? newPopulation++ : newPopulation--;
    this.updatePopulation(newPopulation);
};

/**
 * Adds a row to the grid so that the model matches the view.
 */
GameOfLife.prototype.addRowToGrid = function () {
    var size = this.grid[0].length;
    var row = [];
    for (var i = 0; i < size; i++) {
        row.push(0);
    }
    this.grid.push(row);
};

/**
 * Adds a column to the grid so that the model matches the view.
 */
GameOfLife.prototype.addColToGrid = function () {
    for (var i = 0; i < this.grid.length; i++) {
        this.grid[i].push(0);
    }
};

/**
 * Removes a row from the grid so that the model matches the view.
 */
GameOfLife.prototype.removeRow = function () {
    this.grid.pop();
};

/**
 * Removes a column from the grid so that the model matches the view.
 */
GameOfLife.prototype.removeColumn = function () {
    for (var row = 0; row < this.grid.length; row++) {
        this.grid[row].pop();
    }
};