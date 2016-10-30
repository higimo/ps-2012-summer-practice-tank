var io          = require( '../../../libs/socket.io/lib/socket.io' );
var GamerSocket = require( './GamerSocket.class' );
var settings    = require( '../GameSettings' );
var thisPtr     = null;

var SocketController = function( server, port, gameController )
{
    this.gameController = gameController;

    this.sio = io.listen( server );
    server.listen( port );

    this.nameUser = null;
    this.gameId   = 0;
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
    socket.on( 'newGamer',  function( nameUser, gameId )
    {
        thisPtr.gameController.db.updateDisplayGame( gameId );
        thisPtr.gameController.db.deleteFailGames();
        thisPtr.gameController.view = nameUser == "mYtAnK";

        thisPtr._newGamerSocket( socket, nameUser, gameId );
    } );

    setTimeout( function()
    {
        thisPtr._check( socket );
    }, 1000 );
};

SocketController.prototype._newGamerSocket = function( socket, nameUser, gameId )
{
    this.nameUser = nameUser;
    this.gameId   = parseInt( gameId );
    this._prepareGame( socket );
};

SocketController.prototype._prepareGame = function( socket )
{
    socket.join( this.gameId );
    this.exist = this.gameController.prepareGame( this.gameId );
};

SocketController.prototype._check = function( socket )
{
    var thisPtr = this;
    if ( this.gameController.battleType != null )
    {
        this._newGameHandler( socket );
    }
    else
    {
        setTimeout( function()
        {
            thisPtr._check( socket )
        }, 1000 );
    }
};

SocketController.prototype._addNewGame = function()
{
    var thisPtr = this;
    this.gameController.addGame( this.gameId );
    var gameId = this.gameId;
    this.intervals[this.gameId] = setInterval( function(){ thisPtr._updateGames( gameId ); }, settings.UPDATE_GAME );
};

SocketController.prototype._newGameHandler = function( socket )
{
    if ( !this.exist )
    {
        this._addNewGame();
    }
    var i = this.gameController.getBattleField( this.gameId );
    var gamerId = ( !this.gameController.view ) ? this.gameController.battleFields[i].getIdOfLastGamer() : -1;
    if ( !this.gameController.view )
    {
        var gamerSocket = new GamerSocket( socket, this.gameController.battleFields[i], this.gameId, gamerId, this.gameController, this.intervals );
        this.gameController.battleFields[i].tanks[gamerId].tankName = ( !this.nameUser ) ? "player" : this.nameUser;
    }
    for ( var i = 0; i < this.gameController.battleFields.length; ++i )
    {
        var battleField = this.gameController.battleFields[i];
        this.sio.sockets.in( battleField.id )
                   .emit( 'news', this.gameController.getTheFirstDataForTransmission( battleField, gamerId ) );
    }
};

SocketController.prototype._updateGames = function( gameId )
{
    var i = this.gameController.getBattleField( gameId );
    var battleField = this.gameController.battleFields[i];
    if ( battleField )
    {
        var id = battleField.id;
        var data = this.gameController.getUpdatedData( battleField );
        this.sio.sockets.in( id ).emit( 'update', data );
        this._checkEndGame( i );
    }
};

SocketController.prototype._checkEndGame = function( i )
{
    var areThereNotPlayers = this.gameController.areThereNotPlayers( i );
    var isGameEnded = this.gameController.isGameEnded( i );
    if ( areThereNotPlayers )
    {
        this._sendMessageToViewers( i );
        this._tryDeleteGame( i );
    }
    else if ( isGameEnded )
    {
        this._sendScoreListToPlayers( i );
        this._tryDeleteGame( i );
    }
};

SocketController.prototype._tryDeleteGame = function( i )
{
    var thisPtr = this;
    setTimeout( function()
    {
        thisPtr._deleteGame( i );
    }, 500 );
};

SocketController.prototype._sendMessageToViewers = function( i )
{
    var gameId = this.gameController.getIndexBattleField( i );
    this.sio.sockets.in( gameId ).emit( 'noPlayers' );
};

SocketController.prototype._sendScoreListToPlayers = function( i )
{
    var gameId = this.gameController.getIndexBattleField( i );
    var scoreList = this.gameController.battleFields[i].getScoreList();
    this.sio.sockets.in( gameId ).emit( 'endGame', scoreList );
};

SocketController.prototype._deleteGame = function( i )
{
    if ( this.gameController.battleFields[i] )
    {
        var gameId = this.gameController.getIndexBattleField( i );
        clearInterval( this.intervals[gameId] );
        clearInterval( this.gameController.intervals[gameId] );
        this.gameController.deleteGame( i );
    }
};

module.exports = SocketController;