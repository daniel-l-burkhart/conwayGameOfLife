/**
 * Button event for starting the game.
 */
function startGame() {
    window.gameOfLife.startGame();
}

/**
 * Button even for stopping the game.
 */
function stopGame() {
    window.gameOfLife.stopGame();
}

/**
 * Updates the population by one generation.
 */
function incrementOneGeneration() {
    window.gameOfLife.updateGeneration();
}

/**
 * Updates the population by 23 generations
 */
function incrementTwentyThreeGenerations() {

    for (var i = 0; i < 23; i++) {
        window.gameOfLife.updateGeneration();
    }
}

/**
 * Resets the game with generation and population being 0.
 */
function resetTheGame() {
    var rows = document.getElementById('gameTable').rows.length;
    var cols = document.getElementById('gameTable').rows[0].cells.length;

    $("#gameTable").find("tr").remove();

    window.grid = buildGrid(rows, cols, false);
    window.gameOfLife = new GameOfLife(grid);
    makeCellsClickable();

}

/**
 * Starts the game over with a random population.
 */
function randomPopulation() {
    var rows = document.getElementById('gameTable').rows.length;
    var cols = document.getElementById('gameTable').rows[0].length;

    window.grid = buildGrid(rows, cols, true);
    window.gameOfLife = new GameOfLife(grid);
    makeCellsClickable();

}

/**
 * Adds row to table dynamically based on user interaction.
 */
function addRow() {
    var table = document.getElementById('gameTable');
    var row = table.insertRow(table.rows.length);

    for (var col = 0; col < table.rows[0].cells.length; col++) {

        row.insertCell(col);
    }

    makeCellsClickable();
}

/**
 * Adds column to table dynamically based on user interaction.
 */
function addColumn() {
    var table = document.getElementById('gameTable');

    for (var currRow = 0; currRow < table.rows.length; currRow++) {

        table.rows[currRow].insertCell(table.rows[currRow].cells.length);
    }
    makeCellsClickable();
}

/**
 * Deletes the last row of table dynamically based on user interaction.
 */
function deleteLastRow() {
    var table = document.getElementById('gameTable');

    table.deleteRow(table.rows.length - 1);
}

/**
 * Deletes the last column of table dynamically based on user interaction.
 */
function deleteLastColumn() {
    var table = document.getElementById('gameTable');

    for (var currRow = 0; currRow < table.rows.length; currRow++) {
        table.rows[currRow].deleteCell(table.rows[currRow].cells.length - 1);
    }
}

/**
 * Deletes all rows and columns from table except for origin point.
 */
function resetToOrigin() {
    var table = document.getElementById('gameTable');

    for (var lastRow = table.rows.length - 1; lastRow > 0; lastRow--) {
        table.deleteRow(lastRow);
    }

    for (var currRow = 0; currRow < table.rows.length; currRow++) {
        for (var currCol = table.rows[0].cells.length - 1; currCol > 0; currCol--) {
            table.rows[currRow].deleteCell(currCol);
        }
    }
}
