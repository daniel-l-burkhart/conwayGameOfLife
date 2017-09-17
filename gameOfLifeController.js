function GameOfLifeController() {
    this.grid = this.buildGrid(10, 10, true);
    this.gameOfLife = new GameOfLife(this.grid);
}

GameOfLifeController.prototype.startTheGame = function () {

    this.gameOfLife.startGame();
};

GameOfLifeController.prototype.stopTheGame = function () {


    this.gameOfLife.stopGame();
};

GameOfLifeController.prototype.updateOneGeneration = function () {

    this.gameOfLife.updateGeneration();
};

GameOfLifeController.prototype.updateXGenerations = function (numberOfGenerations) {


    for (var currGen = 0; currGen < numberOfGenerations; currGen++) {
        this.gameOfLife.updateGeneration();
    }
};

GameOfLifeController.prototype.buildNewTable = function (rows, cols, random) {

    this.grid = this.buildGrid(rows, cols, random);
    console.log(this.grid);
    this.gameOfLife = new GameOfLife(this.grid);
};

GameOfLifeController.prototype.updateASingleCell = function (id, state) {

    this.gameOfLife.updateSingleCell(id, state);
};

GameOfLifeController.prototype.addRowToTheGrid = function () {

    this.gameOfLife.addRowToGrid();
};

GameOfLifeController.prototype.addColumnToTheGrid = function () {

    this.gameOfLife.addColToGrid();
};

GameOfLifeController.prototype.removeRowFromGrid = function () {

    this.gameOfLife.removeRow();
};

GameOfLifeController.prototype.removeColumnFromGrid = function () {

    this.gameOfLife.removeColumn();
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
