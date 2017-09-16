/**
 * Game of life "Class" that handles the "back end" work of the game.
 * @param grid
 * The grid that ties to the table
 * @constructor
 * Requires the grid to be built.
 */
function GameOfLife(grid) {

    var self = this;

    this.currGeneration = 0;

    this.grid = grid;

    this.generationText = $('#generation');
    this.populationText = $('#population');

    this.populationThreshold = 2;
    this.goodPopulation = 3;
    this.ressurectorPopulation = 3;
    this.overCrowdingThreshold = 4;

    this.currBoard = [];
    this.keepWorking = false;

    this.buildTable(self);

    this.generationText.text(this.currGeneration);
    this.population = this.getPopulation();
}

GameOfLife.prototype.buildTable = function (self) {

    var table = document.getElementById("gameTable");

    for (var row = 0; row < table.rows.length; row++) {
        table.deleteRow(row);
    }

    this.gameTable = $("#gameTable");

    this.grid.forEach(function (row, yCoordinate) {
        var tr = $('<tr>');

        self.currBoard.push(row.map(
            function (item, xCoordinate) {

                var td = $('<td>');
                var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

                td.attr('id', tdId);
                tr.append(td);

                self.gameTable.append(tr);

                return {
                    x: xCoordinate,
                    y: yCoordinate,
                    item: new Cell(item, td)
                };
            }));
    });

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

    this.population = aliveCount;
    this.populationText.text(this.population);
};


/**
 * Gets a single cell's neighbors to see if they're dead or not.
 * @param x
 * The X Coordinate of the cell
 * @param y
 * The Y Coordinate of the cell
 * @returns {Array}
 * An array of any cell's neighbors.
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
 * Sets the "next" state of life for every cell based on their neighbors.
 */
GameOfLife.prototype.setCellNextStates = function () {

    if (!this.keepWorking) {
        return;
    }

    var self = this;
    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yCoord) {
        row.forEach(function (cell, xCoord) {

            var neighbors = self.getNeighbors(xCoord, yCoord);
            var aliveCount = 0;

            neighbors.forEach(function (cell) {
                aliveCount += cell.item.getProofOfLife();
            });

            //Underpopulation
            if (aliveCount < this.populationThreshold) {
                cell.item.nextState = StatesOfLife.DEAD;

                //Overcrowding
            } else if (aliveCount >= this.overCrowdingThreshold) {
                cell.item.nextState = StatesOfLife.DEAD;
            }

            // LIVES ON!
            else if ((aliveCount === this.populationThreshold) || (cell.item.getProofOfLife() && (aliveCount === this.goodPopulation))) {
                cell.item.nextState = StatesOfLife.LIVES_ON;

                //Resurrection by use of the dark arts.
            } else if ((aliveCount === this.ressurectorPopulation) && (!cell.item.getProofOfLife())) {
                cell.item.nextState = StatesOfLife.RESURRECTED;
            }

        });
    });

    this.updateGeneration();
};

/**
 * Updates one generation
 */
GameOfLife.prototype.updateGeneration = function () {

    var self = this;
    this.keepWorking = false;

    this.currBoard.forEach(function (row) {

        row.forEach(function (cell) {

            if (cell.item.nextState !== cell.item.getProofOfLife() || !self.currGeneration) {
                self.keepWorking = true;
            }

            cell.item.setMortality(cell.item.nextState);
        });
    });

    this.generationText.text(this.currGeneration);
    this.currGeneration++;

    //this.buildTable(self);

    this.updateTable();
    this.getPopulation();
    /*
    Instead of rebuilding the whole table compare to see if it is already chosen.
     */

    setInterval(self.setCellNextStates, 10000);

};

/**
 * FOR SOME REASON WHEN I SINGLE CLICK IT"S NOT UPDATING THE GRID
 */
GameOfLife.prototype.updateTable = function () {

    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yCoord) {
        row.forEach(function (cell, xCoord) {

            var tdID = "x";
            tdID = tdID.concat(xCoord);
            tdID = tdID.concat("y");
            tdID = tdID.concat(yCoord);

            if (cell.item.getProofOfLife()) {
                document.getElementById(tdID).className = "alive";
            } else {
                document.getElementById(tdID).classList.remove('alive');
            }

        });
    });
};

/**
 * Updates a single cell after a click
 * @param id
 * The ID of the cell i.e. x10y10
 * @param value
 * The new value for the cell, 1 = alive, 0 = dead.
 */
GameOfLife.prototype.updateSingleCell = function (id, value) {

    var coordinates = id.match(/\d+/g);

    var yCoordinate = parseInt(coordinates.pop());
    var xCoordinate = parseInt(coordinates.pop());

    this.currBoard.forEach(function (row, yIndex) {

        row.forEach(function (cell, xIndex) {

            if (yIndex === yCoordinate && xIndex === xCoordinate) {
                cell.item.setMortality(value);
            }

        });
    });

    this.getPopulation();

};

/**
 * Starts the game
 */
GameOfLife.prototype.startGame = function () {

    this.keepWorking = true;
    this.updateGeneration();
};

/**
 * Stops the game.
 */
GameOfLife.prototype.stopGame = function () {
    this.keepWorking = false;
};

GameOfLife.prototype.addRowToGrid = function () {
    var size = this.grid[0].length;
    var row = [];
    for (var i = 0; i < size; i++) {
        row.push(0);
    }
    this.grid.push(row);
};

GameOfLife.prototype.addColToGrid = function () {
    for (var i = 0; i < this.grid.length; i++) {
        this.grid[i].push(0);
    }
};

GameOfLife.prototype.removeRow = function () {
    this.grid.pop();
};

GameOfLife.prototype.removeColumn = function () {

    for (var row = 0; row < this.grid.length; row++) {
        this.grid[row].pop();
    }
};