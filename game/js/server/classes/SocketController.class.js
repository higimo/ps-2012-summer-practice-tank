var io          = require( '../../../libs/socket.io/lib/socket.io' );
var GamerSocket = require( './GamerSocket.class' );
var settings    = require( '../GameSettings' );
var thisPtr = null;

var SocketController = function( server, port, gameController )
{
    this.gameController = gameController;

    this.sio = io.listen( server );
    server.listen( port );

    this.nameUser = null;
    this.gameId = 0;
    thisPtr = this;
    
    this.sio.set( 'log level', 1 );
    this.sio.of( '' )
       .on(  'connection', this._socketConnection );

    setInterval( function(){ thisPtr._updateGames() }, settings.UPDATE_GAME );
};

SocketController.prototype._socketConnection = function( socket )
{
    socket.on( 'newGamer',  function( nameUser, gameId ){ thisPtr._newGamerSocket( socket, nameUser, gameId ) } );

    setTimeout( function(){ thisPtr._check( socket ) }, 1000 );
}

SocketController.prototype._newGamerSocket = function( socket, nameUser, gameId )
{
    this.nameUser = nameUser;
    this.gameId = parseInt( gameId );
    this._prepareGame( socket );
}

SocketController.prototype._prepareGame = function( socket )
{
    socket.join( this.gameId );
    this.exist = this.gameController.prepareGame( this.gameId );
}

SocketController.prototype._check = function( socket )
{
    var thisPtr = this;
    if ( this.gameController.battleType != null)
    {
        this._newGameHandler( socket );
    }
    else
    {
        setTimeout( function(){ thisPtr._check( socket ) }, 1000 );
    }
}

SocketController.prototype._newGameHandler = function( socket )
{
    if ( !this.exist )
    {
        this.gameController.addGame( this.gameId );
    }
    var i = this.gameController.getBattleField( this.gameId );
    var gamerId = this.gameController.battleFields[i].getGamerId();
    if ( !this.gameController.view )
    {
        var gamerSocket = new GamerSocket( socket, this.gameController.battleFields[i], this.gameId, gamerId, this.gameController );
        this.gameController.battleFields[i].tanks[gamerId].tankName = ( !this.nameUser ) ? "player" : this.nameUser;
    }

    for ( var i = 0; i < this.gameController.battleFields.length; ++i )
    {
        this.sio.sockets.in( this.gameController.battleFields[i].id )
                   .emit( 'news', this.gameController.battleFields[i], this.gameController.battleFields[i].getGamerId() );
    }
}

SocketController.prototype._updateGames = function()
{
    for ( var i = 0; i < this.gameController.battleFields.length; ++i )
    {
        var id = this.gameController.battleFields[i].id;
        this.sio.sockets.in( id ).emit( 'update',
            new Array(
                this.gameController.battleFields[i].tanks,
                this.gameController.battleFields[i].weapons,
                this.gameController.battleFields[i].explosion,
                this.gameController.battleFields[i].point,
                {
                    time: this.gameController.battleFields[i].completionGameChecker.time
                }
            )
        );
        this.gameController.checkNullGame( i );
    }
}

module.exports = SocketController;