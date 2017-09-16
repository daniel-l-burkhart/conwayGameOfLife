function GameOfLifeView() {
    this.controller = new GameOfLifeController();
    console.log(this.controller);
}

/**
 * Starts up the view by making all of the cells click-able.
 */
GameOfLifeView.prototype.startUp = function () {
    this.makeCellsClickable();
};

/**
 * Button event for starting the game.
 */
GameOfLifeView.prototype.startGame = function () {
    var self = this;
    self.controller.startTheGame();
};

/**
 * Button even for stopping the game.
 */
GameOfLifeView.prototype.stopGame = function () {
    var self = this;
    self.controller.stopTheGame();
};

/**
 * Updates the population by one generation.
 */
GameOfLifeView.prototype.incrementOneGeneration = function () {
    var self = this;

    console.log(self);
    console.log(self.controller);
    self.controller.updateOneGeneration();
};

/**
 * Updates the population by 23 generations
 */
GameOfLifeView.prototype.incrementTwentyThreeGenerations = function () {
    var self = this;
    self.controller.updateXGenerations(23);
};

/**
 * Resets the game with generation and population being 0.
 */
GameOfLifeView.prototype.resetTheGame = function () {
    var self = this;

    var rows = document.getElementById('gameTable').rows.length;
    var cols = document.getElementById('gameTable').rows[0].cells.length;

    $("#gameTable").find("tr").remove();

    self.controller.buildNewTable(rows, cols, false);
    this.makeCellsClickable();
};

/**
 * Starts the game over with a random population.
 */
GameOfLifeView.prototype.randomPopulation = function () {
    var self = this;

    var rows = document.getElementById('gameTable').rows.length;
    var cols = document.getElementById('gameTable').rows[0].length;

    self.controller.buildNewTable(rows, cols, true);

    this.makeCellsClickable();
};

/**
 * Adds row to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addRow = function () {
    var self = this;

    var table = document.getElementById('gameTable');
    var row = table.insertRow(table.rows.length);

    for (var col = 0; col < table.rows[0].cells.length; col++) {

        var td = row.insertCell(col);
        var rowNum = table.rows.length - 1;
        td.id = "x" + col + "y" + rowNum;
    }

    this.makeCellsClickable();

    self.controller.addRowToTheGrid();
};

/**
 * Adds column to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addColumn = function () {
    var self = this;

    var table = document.getElementById('gameTable');

    for (var currRow = 0; currRow < table.rows.length; currRow++) {

        var td = table.rows[currRow].insertCell(table.rows[currRow].cells.length);
        td.id = "x" + (table.rows[currRow].cells.length - 1) + "y" + currRow;
        console.log(td.id);
    }
    this.makeCellsClickable();
    self.controller.addColumnToTheGrid();
};

/**
 * Deletes the last row of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastRow = function () {
    var self = this;

    var table = document.getElementById('gameTable');

    table.deleteRow(table.rows.length - 1);

    self.controller.removeRowFromGrid();
};

/**
 * Deletes the last column of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastColumn = function () {
    var self = this;

    var table = document.getElementById('gameTable');

    for (var currRow = 0; currRow < table.rows.length; currRow++) {
        table.rows[currRow].deleteCell(table.rows[currRow].cells.length - 1);
    }
    self.controller.removeColumnFromGrid();
};

/**
 * Deletes all rows and columns from table except for origin point.
 */
GameOfLifeView.prototype.resetToOrigin = function () {

    var table = document.getElementById('gameTable');

    for (var lastRow = table.rows.length - 1; lastRow > 0; lastRow--) {
        table.deleteRow(lastRow);
    }

    for (var currRow = 0; currRow < table.rows.length; currRow++) {
        for (var currCol = table.rows[0].cells.length - 1; currCol > 0; currCol--) {
            table.rows[currRow].deleteCell(currCol);
        }
    }
};

GameOfLifeView.prototype.makeCellsClickable = function () {
    var self = this;

    $('td').click(function () {
        var cellID = $(this).attr("id");

        if ($(this).attr("class") === 'alive') {
            self.controller.updateASingleCell(cellID, StatesOfLife.DEAD);
            $(this).removeClass('alive');

        } else {
            self.controller.updateASingleCell(cellID, StatesOfLife.ALIVE);
            $(this).addClass('alive');
        }
    });

};