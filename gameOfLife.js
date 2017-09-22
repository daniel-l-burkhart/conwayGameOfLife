/**
 * Game of life "Class" that handles the "back end" work of the game.
 * @author Daniel Burkhart.
 *
 @constructor
 */
function GameOfLife() {

    this.currGeneration = 0;
    this.generationText = $('#generationCount');
    this.generationText.text(this.currGeneration);

    this.population = 0;
    this.populationText = $('#populationCount');

    this.populationThreshold = 2;
    this.overCrowdingThreshold = 4;

    this.currBoard = [];
    this.keepWorking = false;
}

/**
 * Makes the currBoard build from the controller, and sets it to the model.
 *
 * @param board
 *      The 2D array that is a game board.
 */
GameOfLife.prototype.newGameBoard = function (board) {
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
            aliveCount += cell.cellObject.getProofOfLife();
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

    localBoard.forEach(function (currRow, yCoordinate) {
        currRow.forEach(function (currCell, xCoordinate) {

            var neighbors = self.getNeighbors(xCoordinate, yCoordinate);
            var aliveCount = 0;

            neighbors.forEach(function (currNeighbor) {
                aliveCount += currNeighbor.cellObject.getProofOfLife();
            });

            if (aliveCount < self.populationThreshold || aliveCount >= self.overCrowdingThreshold) {
                currCell.cellObject.nextState = StatesOfLife.DEAD;
            } else {
                currCell.cellObject.nextState = StatesOfLife.ALIVE;
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
    *    "Private" method to get the eight possible neighbor locations for any given cell.
    *    @return {Array}
    *           Returns an array containing all of the neighbor positions or any cell.
    */
    function getAllPossibleNeighbors() {

        var top = {
            xCoord: x,
            yCoord: y + 1
        };
        var left = {
            xCoord: x - 1,
            yCoord: y
        };
        var bottom = {
            xCoord: x,
            yCoord: y - 1
        };
        var right = {
            xCoord: x + 1,
            yCoord: y
        };

        var bottomLeft = {
            xCoord: x - 1,
            yCoord: y - 1
        };
        var topLeft = {
            xCoord: x - 1,
            yCoord: y + 1
        };
        var bottomRight = {
            xCoord: x + 1,
            yCoord: y - 1
        };
        var topRight = {
            xCoord: x + 1,
            yCoord: y + 1
        };

        return [
            top, left, bottom, right, bottomLeft, topLeft, bottomRight, topRight
        ];
    }

    var realNeighbors = [];
    var localBoard = this.currBoard;
    var allNeighborPositions = getAllPossibleNeighbors();

    /*
     * Verifies if neighbor exists in the 2D matrix.
     * @param potentialNeighbor
     *      The potential neighbor location in question
     * @returns {Array}
     *      Returns an array of the valid neighbors of the cell
     */
    function verifyIfNeighborExists(potentialNeighbor) {
        if (localBoard[potentialNeighbor.yCoord] &&
            localBoard[potentialNeighbor.yCoord][potentialNeighbor.xCoord]) {
            realNeighbors.push(localBoard[potentialNeighbor.yCoord][potentialNeighbor.xCoord]);
        }
    }

    allNeighborPositions.forEach(verifyIfNeighborExists);
    return realNeighbors;
};

/**
 * Updates the game one generation
 */
GameOfLife.prototype.updateGeneration = function () {
    var self = this;
    this.keepWorking = false;

    var localBoard = this.currBoard;
    var newPopulation = 0;

    localBoard.forEach(function (currRow) {
        currRow.forEach(function (currCell) {

            if (currCell.cellObject.nextState !== currCell.cellObject.getProofOfLife() || !self.currGeneration) {
                self.keepWorking = true;
            }
            if (currCell.cellObject.nextState === StatesOfLife.ALIVE) {
                newPopulation++;
            }
            currCell.cellObject.setMortality(currCell.cellObject.nextState);
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
                cell.cellObject.setMortality(value);
            }
        });
    });

    console.log("Got to update single cell");
    var newPopulation = this.population;
    (value === StatesOfLife.ALIVE) ? newPopulation++ : newPopulation--;
    this.updatePopulation(newPopulation);
};