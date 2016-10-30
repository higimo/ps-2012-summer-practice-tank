var MapUtils  = require( './MapCreator.class' );
var settings  = require( '../../GameSettings' );

function Map( isRandomMap )
{
    this.mapParams = settings.MAP_PARAMS;
    this.height    = this.mapParams.FIELD_HEIGHT;
    this.width     = this.mapParams.FIELD_WIDTH;
    this.map       = new MapUtils( isRandomMap );
    this.gameGrid  = this.map.getMap();
}

module.exports = Map;