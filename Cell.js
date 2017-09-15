/**
 * Cell "Class" that contains its current liveliness and its next state.
 * @param initialState
 * The initial state: alive, dead, etc.
 * @param tableCell
 * The cell in question
 * @constructor
 */
function Cell(initialState, tableCell) {
    this.tableCell = tableCell;
    this.nextState = initialState;
    this.setMortality(initialState);
}

/**
 * Getter method to return if cell is alive.
 * @returns True if alive, false otherwise.
 */
Cell.prototype.getProofOfLife = function () {
    return this.isAlive;
};

/**
 * Sets the liveliness of cell
 * @param value
 * The value of liveliness: 0 for dead, 1 for alive.
 */
Cell.prototype.setMortality = function (value) {
    this.isAlive = value;

    if (value) {
        this.tableCell.addClass('alive');
    } else {
        this.tableCell.removeClass('alive');
    }
};