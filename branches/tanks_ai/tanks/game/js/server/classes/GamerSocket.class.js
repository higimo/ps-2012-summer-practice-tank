var GamerSocket = function( socket, battleField, gameId, gamerId, gameController, intervals )
{
    this.battleField = battleField;
    this.gameId = gameId;
    this.gamerId = gamerId;
    this.gameController = gameController;
    this.intervals = intervals;

    var thisPtr = this;
    socket.on( 'disconnect', function(){ thisPtr._disconnect() } );
    socket.on( 'keyup',      function( keyCode ){ thisPtr._keyUp( keyCode ) } );
    socket.on( 'keydown',    function( keyCode ){ thisPtr._keyDown( keyCode ) } );
    socket.on( 'move',       function( moveData ){ thisPtr._move( moveData ) } );
};

GamerSocket.prototype._disconnect = function()
{
    var battleField = this.gameController.battleFields[this.gameId];
    if ( battleField )
    {
        this.gameController.addPlayerToHall( this.gamerId, this.gameId );
        battleField.deleteGamer( this.gamerId );
        this.gameController.updateCountOfUser( battleField.countPlayers, this.gameId );
    };
};

GamerSocket.prototype._keyUp = function( keyCode )
{
    this.battleField.onKeyUpHandler( keyCode, this.gamerId );
};

GamerSocket.prototype._keyDown = function( keyCode )
{
    this.battleField.onKeyDownHandler( keyCode, this.gamerId );
};

GamerSocket.prototype._move = function( moveData )
{
    this.battleField.onMoveHandler( moveData, this.gamerId );
};

module.exports = GamerSocket;
