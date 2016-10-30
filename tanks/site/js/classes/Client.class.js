var Client = function()
{
    this.battleFieldView = new BattleFieldView();

    this.socketController = new SocketController();
    var socketIsInitialized = this.socketController.tryInit();
    if ( !socketIsInitialized )
    {
        this._showSocketError();
    }
    this._addNewGamer();
    this._initHandlersForSocketController();

    this.keyboardHandler = new KeyboardHandler();
    this._initHandlersForKeyboardHandler();
};

Client.prototype._initHandlersForSocketController = function()
{
    this.socketController.onNews = handler( this, '_startClient' );
    this.socketController.onUpdate = handler( this, '_update' );
    this.socketController.onError = handler( this, '_error' );
    this.socketController.onEndGame = handler( this, '_endGame' );
    this.socketController.onNoPlayers = handler( this, '_showMessageNoPlayers' );
    this.socketController.addHandlers();
};

Client.prototype._initHandlersForKeyboardHandler = function()
{
    this.keyboardHandler.onKeyDown = handler( this, '_keyPress' );
    this.keyboardHandler.onKeyUp = handler( this, '_keyPressFree' );
};

Client.prototype._keyPress = function( keyCode )
{
    this.socketController.keyPress( keyCode );
};

Client.prototype._addNewGamer = function()
{
    var params = this._parseGetParams();
    var playerName = $( '#playerName' ).val();
    this.socketController.addNewGamer( playerName, params.gameId );
};

Client.prototype._keyPressFree = function( keyCode )
{
    this.socketController.keyPressFree( keyCode );
};

Client.prototype._error = function( message )
{
    this._showMessageServerCrash();
};

Client.prototype._startClient = function( data )
{
    this.battleFieldView.startBattleFieldView( data );
    endShowProgressBar();
};

Client.prototype._update = function( data )
{
    this.battleFieldView.updateBattleFieldView( data );
};

Client.prototype._endGame = function( scoreList )
{
    console.log("end");
    var data = this._prepareDataForDispatch( scoreList );
    $.ajax({
        type: "POST",
        url: "end_game.php",
        data: data,
        success: function( msg ){
            $( "#scoreList" ).html( msg );
            $( '#endGame' ).attr( 'class', 'shadow' );
        }
    });
};

Client.prototype._prepareDataForDispatch = function( scoreList )
{
    var names = "name=";
    for ( var i = 0; i < scoreList.length; ++i )
    {
        names += scoreList[i].name + ":" + scoreList[i].frag + ":" + scoreList[i].death + ":" + scoreList[i].mark + ":";
    }
    return names;
};

Client.prototype._showMessageServerCrash = function()
{
    $( '#serverCrash' ).attr( 'class', 'shadow' );
    $( '#exitServerCrashMessage' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + '/index.php';
    } );
};

Client.prototype._showSocketError = function()
{
    endShowProgressBar();
    $( '#errorNoSocket' ).attr( 'class', 'shadow' );
    $( '#exitSocketError' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + "/index.php";
    } );
};

Client.prototype._showMessageNoPlayers = function()
{
    $( '#noPlayers' ).attr( 'class', 'shadow' );
    $( '#exitNoPlayersMessage' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + '/index.php';
    } );
};

Client.prototype._parseGetParams = function()
{
    var get = new Array();
    get =
    {
        gameName: $( '#gameName' ).val(),
        playerName: $( '#playerName' ).val(),
        gameId: $( '#gameId' ).val()
    };
    this._setNameGame( get.gameName );
    return get;
};

Client.prototype._setNameGame = function( name )
{
    var nameGame = $( '#nameGame' );
    nameGame.html( name );
};
