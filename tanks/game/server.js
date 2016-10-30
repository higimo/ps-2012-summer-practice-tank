var http    = require( 'http' );
var express = require( './libs/express'   );
var app     = express();
var mainSetting = require( '../setting.json' );

var settings         = require( './js/server/GameSettings' );
var GameController   = require( './js/server/classes/GameController.class' );
var SocketController = require( './js/server/classes/SocketController.class' );

var server = http.createServer( app );
var port   = mainSetting.NODE_PORT;
var g_game = new GameController();
var g_socketController = new SocketController( server, port, g_game );

app.use( app.router );
app.use( "/js", express.static( __dirname + '/js' ) );

setInterval( globalCleanMemory, settings.CLEAN_INTERVAL );

function globalCleanMemory()
{
    global.gc();
}