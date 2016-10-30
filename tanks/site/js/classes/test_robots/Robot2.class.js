var Robot = function()
{
    this._MOVES =
    [
        { row: -1, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 0, column: -1 }
    ];
    this._MAX_TRIES_COUNT = 15;
    this._prevMoveIndex = 0;
};

Robot.prototype.getMove = function()
{
    var newMoveIndex = this._prevMoveIndex;
    for ( var i = 0; i < this._MAX_TRIES_COUNT && !this._isMoveValid( this._MOVES[newMoveIndex] ); ++i )
    {
        newMoveIndex = Math.floor( Math.random() * 4 );
    }
    this._prevMoveIndex = newMoveIndex;

    return { direction: newMoveIndex + 1, fire: 0 };
};

Robot.prototype._isMoveValid = function( move )
{
    var myPosition = BattleField.getMyPosition();
    var newPosition =
    {
        row: myPosition.row + move.row,
        column: myPosition.column + move.column
    };
    return BattleField.isEmpty( newPosition.row, newPosition.column );
};
