window.grid = [];
window.gameOfLife = '';


window.onload = function () {
    window.grid = buildGrid(50, 50, true);
    window.gameOfLife = new GameOfLife(grid);
    makeCellsClickable();
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

            window.gameOfLife.updateSingleCell(cellID, StatesOfLife.DEAD);
            $(this).removeClass('alive');

        } else {
            window.gameOfLife.updateSingleCell(cellID, StatesOfLife.ALIVE);
            $(this).addClass('alive');
        }
    });

}