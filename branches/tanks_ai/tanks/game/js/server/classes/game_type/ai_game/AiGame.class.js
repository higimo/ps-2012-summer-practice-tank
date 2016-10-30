var CaptureFlagGame = require( '../capture_flag_game/CaptureFlagGame.class' );
var MathUtils = require( '../../../../common/utils/mathUtils.class' );
var settings = require( '../../../GameSettings' );

var AiGame = function( battleField )
{
    CaptureFlagGame.call( this, battleField );
};

AiGame.prototype = Object.create( CaptureFlagGame.prototype );
AiGame.prototype.constructor = AiGame;

AiGame.prototype.getGroup = function( tankId )
{
    return tankId;
};

AiGame.prototype.getTankPointByGroup = function( group )
{
    var respawnCells = this._getIndexesOfRespawnCells();
    var randomCell = respawnCells[MathUtils.getRandomInteger( 0, respawnCells.length - 1 )];
    return {
        i: randomCell.row,
        j: randomCell.column
    };
};

AiGame.prototype._getIndexesOfRespawnCells = function()
{
    var cells = [];
    for ( var i = 1; i < settings.MAP_PARAMS.COUNT_BRICK_J - 1; ++i )
    {
        cells.push( { row: 1, column: i } );
        cells.push( { row: settings.MAP_PARAMS.COUNT_BRICK_I - 2, column: i } );
    }
    for ( var i = 1; i < settings.MAP_PARAMS.COUNT_BRICK_I - 1; ++i )
    {
        cells.push( { row: i, column: 1 } );
        cells.push( { row: i, column: settings.MAP_PARAMS.COUNT_BRICK_J - 2 } );
    }
    return cells;
};

module.exports = AiGame;
