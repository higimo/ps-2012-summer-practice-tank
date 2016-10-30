var GamerSocket = function( socket, battleField, gameId, gamerId, gameController, intervals )
{
    var thisPtr = this;
    socket.on( 'disconnect', function(){ thisPtr._disconnect( battleField, gamerId, gameController, gameId, intervals ) } );
    socket.on( 'keyup',      function( keyCode ){ thisPtr._keyUp( keyCode, battleField, gamerId ) } );
    socket.on( 'keydown',    function( keyCode ){ thisPtr._keyDown( keyCode, battleField, gamerId ) } );
};

GamerSocket.prototype._disconnect = function( battleField, gamerId, gameController, gameId, intervals )
{
    var i = gameController.getBattleField( gameId );
    var battleField = gameController.battleFields[i];
    if ( battleField )
    {
        gameController.addPlayerToHall( gamerId, gameId );
        battleField.deleteGamer( gamerId );
        gameController.updateCountOfUser( battleField.countPlayers, gameId );
    };
};

GamerSocket.prototype._keyUp = function( keyCode, battleField, gamerId )
{
    battleField.onKeyUpHandler( keyCode, gamerId );
};

GamerSocket.prototype._keyDown = function( keyCode, battleField, gamerId )
{
    battleField.onKeyDownHandler( keyCode, gamerId );
};

module.exports = GamerSocket;