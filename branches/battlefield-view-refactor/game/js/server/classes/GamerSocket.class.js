var GamerSocket = function( socket, battleField, gameId, gamerId, gameController )
{
    var thisPtr = this;
    socket.on( 'disconnect', function(){ thisPtr._disconnect( battleField, gamerId, gameController, gameId ) } );
    socket.on( 'keyup',      function( keyCode ){ thisPtr._keyUp( keyCode, battleField, gamerId ) } );
    socket.on( 'keydown',    function( keyCode ){ thisPtr._keyDown( keyCode, battleField, gamerId ) } );
};

GamerSocket.prototype._disconnect = function( battleField, gamerId, gameController, gameId )
{
    var newPlayersCount = battleField.countPlayers - 1;
    gameController.updateCountOfUser( newPlayersCount, gameId );
    gameController.addPlayerToHall( gamerId, gameId );
    battleField.deleteGamer( gamerId, gameId );
}

GamerSocket.prototype._keyUp = function( keyCode, battleField, gamerId )
{
    battleField.onKeyboardEvent( keyCode, gamerId );
}

GamerSocket.prototype._keyDown = function( keyCode, battleField, gamerId )
{
    battleField.keyDownHandler( keyCode, gamerId );
}

module.exports = GamerSocket;