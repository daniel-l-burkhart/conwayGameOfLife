$(function () {
    var view = new GameOfLifeView();
    view.startUp();

    setUpButtonEvents(view);
});

function setUpButtonEvents(view) {

    var startButton = document.getElementById('startButton');
    var stopButton = document.getElementById('stopButton');
    var incrementOne = document.getElementById('incrementOne');
    var increment23 = document.getElementById('increment23');
    var resetGame = document.getElementById('resetGame');
    var randomPopulation = document.getElementById('randomPopulation');
    var addRow = document.getElementById('addRow');
    var addCol = document.getElementById('addCol');
    var deleteRow = document.getElementById('deleteRow');
    var deleteCol = document.getElementById('deleteCol');

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
}


