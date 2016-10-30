var MapUtils  = require( './MapCreator.class' );
var settings  = require( '../../GameSettings' );
var mapParams = settings.MAP_PARAMS;

var Map = function( typeOfMap, typeOfGame )
{
    this.height   = mapParams.FIELD_HEIGHT;
    this.width    = mapParams.FIELD_WIDTH; 
    this.gameGrid = MapUtils.getMap( typeOfMap );
};

module.exports = Map;