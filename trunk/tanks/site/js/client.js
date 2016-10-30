if ( typeof io !== 'object' ) 
{
    endShowProgressBar();
    $( '#errorNoSocket' ).attr( 'class', 'shadow' );
    $( '#exitSocetError' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + "/index.php";
    } );
}
else
{
    var socket = io.connect( 'http://' + setting.NODE_HOST + ':' + setting.NODE_PORT );
}

var get = parseGetParams();

socket.emit( 'newGamer', $( '#playerName' ).val(), get.gameId );

socket.on( 'news',   startClient );
socket.on( 'update', update );
socket.on( 'error',  error );
socket.on( 'endGame', endGame );
socket.on( 'noPlayers', showMessageNoPlayers );

function keyPress( keyCode )
{
    socket.emit( 'keydown', keyCode );
}

function keyPressFree( keyCode )
{
    socket.emit( 'keyup', keyCode );
}

function error( message )
{
    showMessageServerCrash();
}

function startClient( data )
{
    keyboardEventStart();
    battleFieldView.startBattleFieldView( data );
    endShowProgressBar();
}

function update( data )
{
    battleFieldView.updateBattleFieldView( data );
}

function endGame( scoreList )
{
    console.log("end");
    var data = prepareDataForDispatch( scoreList );
    $.ajax({
        type: "POST",
        url: "end_game.php",
        data: data,
        success: function( msg ){
            $( "#scoreList" ).html( msg );
            $( '#endGame' ).attr( 'class', 'shadow' );
        }
    });
}

function prepareDataForDispatch( scoreList )
{
    var names = "name=";
    for ( var i = 0; i < scoreList.length; ++i )
    {
        names += scoreList[i].name + ":" + scoreList[i].frag + ":" + scoreList[i].death + ":" + scoreList[i].mark + ":";
    }
    return names;
}

function showMessageServerCrash()
{
    $( '#serverCrash' ).attr( 'class', 'shadow' );
    $( '#exitServerCrashMessage' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + '/index.php';
    } );
}

function showMessageNoPlayers()
{
    $( '#noPlayers' ).attr( 'class', 'shadow' );
    $( '#exitNoPlayersMessage' ).click( function()
    {
        window.location = 'http://' + setting.SITE_HOST + '/index.php';
    } );
}

function parseGetParams()
{
    var get = new Array();
    get =
    {
        gameName: $( '#gameName' ).val(),
        playerName: $( '#playerName' ).val(),
        gameId: $( '#gameId' ).val()
    };
    setNameGame( get.gameName );
    return get;
}

function setNameGame( name )
{
    var nameGame = $( '#nameGame' );
    nameGame.html( name );
}