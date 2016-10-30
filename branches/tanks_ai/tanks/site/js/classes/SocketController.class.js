var SocketController = function()
{
    this.event =
    {
        toListen:
        {
            START: 'news',
            UPDATE: 'update',
            ERROR: 'error',
            END: 'endGame',
            NO_PLAYERS: 'noPlayers'
        },
        toDispatch:
        {
            NEW_GAMER: 'newGamer',
            KEY_DOWN: 'keydown',
            KEY_UP: 'keyup',
            MOVE: 'move'
        }
    };

    this._socket = null;

    this.onNews = null;
    this.onUpdate = null;
    this.onError = null;
    this.onEndGame = null;
    this.onNoPlayers = null;
};

SocketController.prototype.tryInit = function()
{
    if ( typeof io !== 'object' )
    {
        return false;
    }

    this._socket = io.connect( 'http://' + setting.NODE_HOST + ':' + setting.NODE_PORT );
    return true;
};

SocketController.prototype.addHandlers = function()
{
    this._socket.on( this.event.toListen.START, handler( this, 'onNews' ) );
    this._socket.on( this.event.toListen.UPDATE, handler( this, 'onUpdate' ) );
    this._socket.on( this.event.toListen.ERROR, handler( this, 'onError' ) );
    this._socket.on( this.event.toListen.END, handler( this, 'onEndGame' ) );
    this._socket.on( this.event.toListen.NO_PLAYERS, handler( this, 'onNoPlayers' ) );
};

SocketController.prototype.addNewGamer = function( playerName, gameId )
{
    this._socket.emit( this.event.toDispatch.NEW_GAMER, playerName, gameId );
};

SocketController.prototype.keyPress = function( keyCode )
{
    this._socket.emit( this.event.toDispatch.KEY_DOWN, keyCode );
};

SocketController.prototype.keyPressFree = function( keyCode )
{
    this._socket.emit( this.event.toDispatch.KEY_UP, keyCode );
};

SocketController.prototype.move = function( moveData )
{
    this._socket.emit( this.event.toDispatch.MOVE, moveData );
};
