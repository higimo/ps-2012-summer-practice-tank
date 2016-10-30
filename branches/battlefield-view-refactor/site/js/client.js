var getBattleField = {};

if ( typeof io !== 'object' ) 
{
    $( '#errorNoSocket' ).attr( 'class', 'shadow' );
}
else
{
    var socket = io.connect( 'http://localhost:8787' );
}

var get = parseGetParams();

socket.emit( 'newGamer', $( '#playerName' ).val(), get.gameId );

socket.on( 'news',   startBattleField );
socket.on( 'update', update );
socket.on( 'error',  error );

function keyPress( keyCode )
{
    socket.emit( 'keydown', keyCode );
};

function keyPressFree( keyCode )
{
    socket.emit( 'keyup', keyCode );
};

function error( message )
{
    alert( message );
};

function startBattleField( getBattleField, id )
{
    keyboardEventStart();
    startBattleFieldView( getBattleField, id );
};

function update( data )
{
    battleFieldView.updateBattleFieldView( data );
};

function parseGetParams()
{
    var result = {};
    var query  = location.search.substring(1).split('&');
    var get = new Array();
    for( i in query ) 
    {
        var param     = query[i].split( '=' );
        get[param[0]] = decodeURIComponent( param[1] );
    }
    return get;
};