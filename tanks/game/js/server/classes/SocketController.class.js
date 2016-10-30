var io          = require( '../../../libs/socket.io/lib/socket.io' );
var GamerSocket = require( './GamerSocket.class' );
var settings    = require( '../GameSettings' );
var thisPtr     = null;

var SocketController = function( server, port, gameController )
{
    this.gameController = gameController;

    this.sio = io.listen( server );
    server.listen( port );

    thisPtr       = this;
    this.exist    = false;
    this.intervals = new Array();
    this.sio.set( 'log level', 1 );
    this.sio.of( '' )
        .on( 'connection', this._socketConnection );
    this.gameController.db.deleteTableGame();
};

SocketController.prototype._socketConnection = function( socket )
{
    console.log( 'newGamer' );
    socket.on( 'newGamer',  function( nameUser, gameId )
    {
        thisPtr.gameController.db.updateDisplayGame( gameId );
        thisPtr.gameController.db.deleteFailGames();
        thisPtr.gameController.view = nameUser == "mYtAnK";

        thisPtr._newGamerSocket( socket, gameId );

        setTimeout( function()
        {
            thisPtr._check( socket, nameUser, gameId );
        }, 1000 );
    } );
};

SocketController.prototype._newGamerSocket = function( socket, gameId )
{
    this._prepareGame( socket, parseInt( gameId ) );
};

SocketController.prototype._prepareGame = function( socket, gameId )
{
    socket.join( gameId );
    this.exist = this.gameController.prepareGame( gameId );
};

SocketController.prototype._check = function( socket, nameUser, gameId )
{
    var thisPtr = this;
    if ( this.gameController.asyncDbOperationResult.battleType != null )
    {
        this._newGameHandler( socket, nameUser, gameId );
    }
    else
    {
        setTimeout( function()
        {
            thisPtr._check( socket )
        }, 1000 );
    }
};

SocketController.prototype._addNewGame = function( gameId )
{
    var thisPtr = this;
    this.gameController.addGame( gameId );
    this.intervals[gameId] = setInterval( function(){ thisPtr._updateGames( gameId ); }, settings.UPDATE_GAME );
};

SocketController.prototype._newGameHandler = function( socket, nameUser, gameId )
{
    if ( !this.exist )
    {
        this._addNewGame( gameId );
    }
    var gamerId = ( !this.gameController.view ) ? this.gameController.battleFields[gameId].getIdOfLastGamer() : -1;
    if ( !this.gameController.view )
    {
        var gamerSocket = new GamerSocket( socket, this.gameController.battleFields[gameId], gameId, gamerId,
            this.gameController, this.intervals );
        this.gameController.battleFields[gameId].tanks[gamerId].tankName = ( !nameUser ) ? "player" : nameUser;
    }

    for ( var id in this.gameController.battleFields )
    {
        var battleField = this.gameController.battleFields[id]
        this.sio.sockets.in( battleField.id )
            .emit( 'news', this.gameController.getTheFirstDataForTransmission( battleField, gamerId ) );
    }
};

SocketController.prototype._updateGames = function( gameId )
{
    var battleField = this.gameController.battleFields[gameId];
    if ( battleField )
    {
        var id = battleField.id;
        var data = this.gameController.getUpdatedData( battleField );
        this.sio.sockets.in( id ).emit( 'update', data );
        this._checkEndGame( gameId );
    }
};

SocketController.prototype._checkEndGame = function( gameId )
{
    var areThereNotPlayers = this.gameController.areThereNotPlayers( gameId );
    var isGameEnded = this.gameController.isGameEnded( gameId );
    if ( areThereNotPlayers )
    {
        this._sendMessageToViewers( gameId );
    }
    else if ( isGameEnded )
    {
        this._sendScoreListToPlayers( gameId );
    }

    if ( areThereNotPlayers || isGameEnded )
    {
        this._deleteGame( gameId );
    }
};

SocketController.prototype._sendMessageToViewers = function( gameId )
{
    this.sio.sockets.in( gameId ).emit( 'noPlayers' );
};

SocketController.prototype._sendScoreListToPlayers = function( gameId )
{
    var scoreList = this.gameController.battleFields[gameId].getScoreList();
    this.sio.sockets.in( gameId ).emit( 'endGame', scoreList );
};

SocketController.prototype._deleteGame = function( gameId )
{
    if ( this.gameController.battleFields[gameId] )
    {
        clearInterval( this.intervals[gameId] );
        clearInterval( this.gameController.intervals[gameId] );
        this.gameController.deleteGame( gameId );
    }
};

module.exports = SocketController;