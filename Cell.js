function Cell(initialState, tableCell) {
    this.tableCell = tableCell;
    this.nextState = initialState;
    this.setMortality(initialState);
}

Cell.prototype.getProofOfLife = function () {
    return this.isAlive;
};

Cell.prototype.setMortality = function (value) {
    this.isAlive = value;

    if (value) {
        this.tableCell.addClass('alive');
    } else {
        this.tableCell.removeClass('alive');
    }
};