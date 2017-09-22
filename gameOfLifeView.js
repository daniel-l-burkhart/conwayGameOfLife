/**
 * View class that acts on the front end of the application.
 * @author Daniel Burkhart.
 *
 * @constructor
 */
function GameOfLifeView() {
    this.controller = new GameOfLifeController();
}

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
    var table = document.getElementById('gameTable');
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;

    var old_tbody = document.querySelector('tbody');
    var new_tbody = document.createElement('tbody');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

    this.controller.buildNewTable(rows, cols, false);
};

/**
 * Starts the game over with a random population.
 */
GameOfLifeView.prototype.randomPopulation = function () {
    var table = document.getElementById('gameTable');
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;

    var old_tbody = document.querySelector('tbody');
    var new_tbody = document.createElement('tbody');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

    this.controller.buildNewTable(rows, cols, true);
};

/**
 * Builds new table based on text input.
 * @param rows
 *      The number of rows.
 * @param cols
 *      The number of columns.
 */
GameOfLifeView.prototype.buildVariableSizedTable = function (rows, cols) {
    var self = this;

    var gameTable = $("#gameTable");
    gameTable.find("tr").remove();

    self.controller.buildNewTable(rows, cols, false);
};

/**
 * Adds row to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addRow = function () {
    this.controller.addRowToTheGrid();
};

/**
 * Adds column to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addColumn = function () {
    this.controller.addColumnToTheGrid();
};

/**
 * Deletes the last row of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastRow = function () {
    var self = this;
    var table = document.getElementById('gameTable');

    if (table.rows.length <= 1) {
        alert("Cannot delete entire table");
    } else {
        table.deleteRow(table.rows.length - 1);
        self.controller.removeRowFromGrid();
    }
};

/**
 * Deletes the last column of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastColumn = function () {
    var table = document.getElementById('gameTable');
    if (table.rows[0].cells.length <= 1) {
        alert("Cannot delete entire table");
    } else {
        for (var currRow = 0; currRow < table.rows.length; currRow++) {
            table.rows[currRow].deleteCell(table.rows[currRow].cells.length - 1);
        }
        this.controller.removeColumnFromGrid();
    }
};