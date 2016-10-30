var RandomUtil   = require('./RandomMap.class');
var StandartUtil = require('./StandartMap.class');
var Wall         = require('./Wall.class');
var settings     = require( '../../GameSettings' );

var MapCreator = function( isRandomMap )
{
    this.mapParams = settings.MAP_PARAMS;
    this.isRandomMap = isRandomMap;
    this.currMap = null;
}

MapCreator.prototype._prepareMap = function()
{
    this._checkMap();
    this._prepareObjects();
}

MapCreator.prototype._checkMap = function()
{
    this.currMap = this.isRandomMap ? new RandomUtil() : new StandartUtil();
}

MapCreator.prototype._prepareObjects = function()
{
    for ( var i = 0; i < this.mapParams.COUNT_BRICK_I; ++i )
    {
        for ( var j = 0; j < this.mapParams.COUNT_BRICK_J; ++j )
        {
            this._createObjects( i, j, this.currMap.map[i][j] );
        }
    }
}

MapCreator.prototype._createObjects = function( i, j, brickType )
{
    console.log(brickType + ' brickType')
    this.currMap.map[i][j]                  = new Wall();
    this.currMap.map[i][j].type             = brickType;
    this.currMap.map[i][j].point.x          = j * this.mapParams.CELL_WIDTH;
    this.currMap.map[i][j].point.y          = i * this.mapParams.CELL_HEIGHT;
    this.currMap.map[i][j].dimension.width  = this.mapParams.CELL_WIDTH;
    this.currMap.map[i][j].dimension.height = this.mapParams.CELL_HEIGHT;
}

MapCreator.prototype.getMap = function()
{
    this._prepareMap();
    return this.currMap.map;
}

module.exports = MapCreator;