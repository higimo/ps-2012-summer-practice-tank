var keycode    = require( '../../common/utils/keycode' );
var settings   = require( '../GameSettings' );

var KeyBoardHandler = function() {};

KeyBoardHandler.prototype.onKeyDownHandler = function( keyCode, id, battleField )
{
    switch( keyCode )
    {
        case keycode.UP:
            battleField.tanks[id].route = settings.DIRECTION.UP;
            battleField.tanks[id].moves = true;
            break;
        case keycode.DOWN:
            battleField.tanks[id].route = settings.DIRECTION.DOWN;
            battleField.tanks[id].moves = true;
            break;
        case keycode.LEFT:
            battleField.tanks[id].route = settings.DIRECTION.LEFT;
            battleField.tanks[id].moves = true;
            break;
        case keycode.RIGHT:
            battleField.tanks[id].route = settings.DIRECTION.RIGHT;
            battleField.tanks[id].moves = true;
            break;
        case keycode.SPACE:
            if ( battleField.tanks[id].shot.recharge <= 0 )
            {
                battleField.tanks[id].attack = true;
            }
            break;
    }
};

KeyBoardHandler.prototype.onKeyUpHandler = function( keyCode, id, battleField )
{
    switch( keyCode )
    {
        case keycode.UP:
            if ( battleField.tanks[id].route == settings.DIRECTION.UP )
            {
                battleField.tanks[id].moves = false;
                battleField.tanks[id].directInBottleneck.isBottleneck = false;
            }
            break;
        case keycode.DOWN:
            if ( battleField.tanks[id].route == settings.DIRECTION.DOWN )
            {
                battleField.tanks[id].moves = false;
                battleField.tanks[id].directInBottleneck.isBottleneck = false;
            }
            break;
        case keycode.LEFT:
            if ( battleField.tanks[id].route == settings.DIRECTION.LEFT )
            {
                battleField.tanks[id].moves = false;
                battleField.tanks[id].directInBottleneck.isBottleneck = false;
            }
            break;
        case keycode.RIGHT:
            if ( battleField.tanks[id].route == settings.DIRECTION.RIGHT )
            {
                battleField.tanks[id].moves = false;
                battleField.tanks[id].directInBottleneck.isBottleneck = false;
            }
            break;
        case keycode.SPACE:
            battleField.tanks[id].attack = false;
            break;
    }
};

module.exports = new KeyBoardHandler();