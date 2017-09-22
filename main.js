/**
 * "Main" method to start up everything.
 *
 * @author: Daniel Burkhart.
 */
$(function () {
    var view = new GameOfLifeView();
    view.startUp();

    setUpButtonEvents(view);
});

/**
 * Sets up binding of view "class" and the button elements in HTML.
 * @param view
 *      The view instance that ties these events to the view.
 */
function setUpButtonEvents(view) {

    setUpGameButtonEvents(view);

    setUpTableButtonEvents(view);
}

/**
 * Sets up the events for the game buttons.
 * @param view
 *      The view instance.
 */
function setUpGameButtonEvents(view) {
    var startButton = document.getElementById('startButton');
    var stopButton = document.getElementById('stopButton');
    var incrementOne = document.getElementById('incrementOne');
    var increment23 = document.getElementById('increment23');
    var resetGame = document.getElementById('resetGame');
    var randomPopulation = document.getElementById('randomPopulation');

    startButton.addEventListener('click', function () {
        view.startGame();
    });

    stopButton.addEventListener('click', function () {
        view.stopGame()
    });

    incrementOne.addEventListener('click', function () {
        view.incrementOneGeneration();
    });

    increment23.addEventListener('click', function () {
        view.incrementTwentyThreeGenerations();
    });

    resetGame.addEventListener('click', function () {
        view.resetTheGame();
    });

    randomPopulation.addEventListener('click', function () {
        view.randomPopulation();
    });
}

/**
 * Sets up the events for the table buttons.
 * @param view
 *      The view instance.
 */
function setUpTableButtonEvents(view) {
    var addRow = document.getElementById('addRow');
    var addCol = document.getElementById('addCol');
    var deleteRow = document.getElementById('deleteRow');
    var deleteCol = document.getElementById('deleteCol');
    var buildNewVariableTable = document.getElementById('buildNewVariableTable');

    addRow.addEventListener('click', function () {
        view.addRow();
    });

    addCol.addEventListener('click', function () {
        view.addColumn();
    });

    deleteRow.addEventListener('click', function () {
        view.deleteLastRow();
    });

    deleteCol.addEventListener('click', function () {
        view.deleteLastColumn();
    });

    buildNewVariableTable.addEventListener('click', function () {
        var rows = document.getElementById('rowsInput').value;
        var columns = document.getElementById('colsInput').value;

        if (rows === null || rows === "" || columns === null || columns === "") {
            alert("Both columns and rows must be filled.");
        } else {
            view.buildVariableSizedTable(rows, columns);
        }
    });
}




