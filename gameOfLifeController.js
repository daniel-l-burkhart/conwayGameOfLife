function GameOfLifeController() {
    this.grid = this.buildGrid(10, 10, true);
    this.gameOfLife = new GameOfLife(this.grid);
}

GameOfLifeController.prototype.startTheGame = function () {
    var self = this;
    self.gameOfLife.startGame();
};

GameOfLifeController.prototype.stopTheGame = function () {
    var self = this;

    self.gameOfLife.stopGame();
};

GameOfLifeController.prototype.updateOneGeneration = function () {
    var self = this;

    self.gameOfLife.updateGeneration();
};

GameOfLifeController.prototype.updateXGenerations = function (numberOfGenerations) {
    var self = this;

    for (var currGen = 0; currGen < numberOfGenerations; currGen++) {
        self.gameOfLife.updateGeneration();
    }
};

GameOfLifeController.prototype.buildNewTable = function (rows, cols, random) {
    var self = this;

    self.grid = this.buildGrid(rows, cols, random);
    self.gameOfLife = new GameOfLife(grid);
};

GameOfLifeController.prototype.updateASingleCell = function (id, state) {
    var self = this;

    self.gameOfLife.updateSingleCell(id, state);
};

GameOfLifeController.prototype.addRowToTheGrid = function () {
    var self = this;

    self.gameOfLife.addRowToGrid();
};

GameOfLifeController.prototype.addColumnToTheGrid = function () {
    var self = this;

    self.gameOfLife.addColToGrid();
};

GameOfLifeController.prototype.removeRowFromGrid = function () {
    var self = this;

    self.gameOfLife.removeRow();
};

GameOfLifeController.prototype.removeColumnFromGrid = function () {
    var self = this;

    self.gameOfLife.removeColumn();
};

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
