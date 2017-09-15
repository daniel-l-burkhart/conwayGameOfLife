/**
 * "Enum" to make understanding the rules of the game easier.
 * @type {{DEAD: number, ALIVE: number, RESURRECTED: number, LIVES_ON: number}}
 */
var StatesOfLife = {
    DEAD: 0,
    ALIVE: 1,
    RESURRECTED: 1,
    LIVES_ON: 1
};

function GameOfLife(grid) {
    var self = this;

    this.currGeneration = 0;

    this.generationText = $('#generation');
    this.populationText = $('#population');

    this.populationThreshold = 2;
    this.goodPopulation = 3;
    this.ressurectorPopulation = 3;
    this.overCrowdingThreshold = 4;

    this.currBoard = [];
    this.keepWorking = true;
    this.gameTable = $('#gameTable');

    grid.forEach(function (row, yCoordinate) {
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

    this.population = this.getPopulation();
    this.updateGeneration();
}


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
            //Verification of possible neighbor cell's existence.
            if (localBoardState[currCoordinate.yCoordinate] && localBoardState[currCoordinate.yCoordinate][currCoordinate.xCoordinate]) {

                verifiedNeighbors.push(localBoardState[currCoordinate.yCoordinate][currCoordinate.xCoordinate]);
            }
        }
    );

    return verifiedNeighbors;


};

GameOfLife.prototype.setCellNextStates = function () {

    if (this.keepWorking) {

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
                else if ((aliveCount === this.populationThreshold) || (cell.isAlive && (aliveCount === this.goodPopulation))) {
                    cell.item.nextState = StatesOfLife.LIVES_ON;

                    //Resurrection by use of the dark arts.
                } else if ((aliveCount === this.ressurectorPopulation) && (!cell.isAlive)) {
                    cell.item.nextState = StatesOfLife.RESURRECTED;
                }

            });
        });

        this.updateGeneration();
    }
};

GameOfLife.prototype.updateGeneration = function () {
    var self = this;

    var newPopulation = 0;

    this.keepWorking = false;

    this.currBoard.forEach(function (row) {

        row.forEach(function (cell) {

            if (cell.item.nextState !== cell.item.getProofOfLife() || !self.currGeneration) {
                self.keepWorking = true;
            }

            cell.item.setMortality(cell.item.nextState);

            if (cell.item.nextState === 1) {
                newPopulation++;
            }
        });
    });

    this.population = newPopulation;

    this.generationText.text(this.currGeneration);
    this.populationText.text(this.population);
    this.currGeneration++;

    setTimeout(function () {
        self.setCellNextStates();
    }, 100);
};

GameOfLife.prototype.updateSingleCell = function (id, value) {

    var coords = id.match(/\d+/g);

    var yCoordinate = parseInt(coords.pop());
    var xCoordinate = parseInt(coords.pop());


    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yIndex) {

        row.forEach(function (cell, xIndex) {

            if (yIndex === yCoordinate && xIndex === xCoordinate) {
                cell.item.setMortality(value);
            }

        });
    });

    this.getPopulation();

};

function buildGrid(rowSize, colSize, random) {
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
}

function makeCellsClickable() {

    $('td').click(function () {

        var cellID = $(this).attr("id");

        if ($(this).attr("class") === 'alive') {

            gameOfLife.updateSingleCell(cellID, 0);
            $(this).removeClass('alive');

        } else {
            gameOfLife.updateSingleCell(cellID, 1);
            $(this).addClass('alive');
        }
    });

}

var grid = [];
var gameOfLife = '';

window.onload = function () {
    grid = buildGrid(50, 50, true);
    gameOfLife = new GameOfLife(grid);
    makeCellsClickable();
};
