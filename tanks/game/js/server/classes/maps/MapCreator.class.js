var RandomUtil   = require('./RandomMap.class');
var StandardUtil = require('./StandardMap.class');
var Wall         = require('./Wall.class');
var settings     = require( '../../GameSettings' );
var mapParams = settings.MAP_PARAMS;

var MapCreator = function()
{
    this.mapParams = settings.MAP_PARAMS;
    this.typeOfMap = mapParams.DEFAULT_MAP;
    this.currMap = null;
};

MapCreator.prototype._prepareMap = function()
{
    this._checkMap();
    this._prepareObjects();
};

MapCreator.prototype._checkMap = function()
{
    switch ( this.typeOfMap )
    {
        case mapParams.DEFAULT_MAP:
        {
            this.currMap = new StandardUtil( mapParams.DEFAULT_MAP );
            break;
        }
        case mapParams.RANDOM_MAP:
        {
            this.currMap = new RandomUtil( mapParams.RANDOM_MAP );
            break;
        }
        case mapParams.FLAG_DEFAULT_MAP:
        {
            this.currMap = new StandardUtil( mapParams.FLAG_DEFAULT_MAP );
            break;
        }
        case mapParams.FLAG_RANDOM_MAP:
        {
            this.currMap = new RandomUtil( mapParams.FLAG_RANDOM_MAP );
            break;
        }
    }
};

MapCreator.prototype._prepareObjects = function()
{
    for ( var i = 0; i < this.mapParams.COUNT_BRICK_I; ++i )
    {
        for ( var j = 0; j < this.mapParams.COUNT_BRICK_J; ++j )
        {
            this._createObjects( i, j, this.currMap.map[i][j] );
        }
    }
};

MapCreator.prototype._createObjects = function( i, j, brickType )
{
    this.currMap.map[i][j]                  = new Wall();
    this.currMap.map[i][j].point.x          = j * this.mapParams.CELL_WIDTH;
    this.currMap.map[i][j].point.y          = i * this.mapParams.CELL_HEIGHT;
    this.currMap.map[i][j].dimension.width  = this.mapParams.CELL_WIDTH;
    this.currMap.map[i][j].dimension.height = this.mapParams.CELL_HEIGHT;
    this.currMap.map[i][j].type             = brickType;
};

MapCreator.prototype.getMap = function( typeOfMap )
{
    this.typeOfMap = typeOfMap;
    this._prepareMap();
    return this.currMap.map;
};

module.exports = new MapCreator();