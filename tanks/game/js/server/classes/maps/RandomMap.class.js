var settings  = require( '../../GameSettings' );
var mapParams = settings.MAP_PARAMS;

const COUNT_BRICK_I = mapParams.COUNT_BRICK_I;
const COUNT_BRICK_J = mapParams.COUNT_BRICK_J;

var RandomMap = function( mapType )
{
    this.mapType = mapType;
    this.map      = new Array( COUNT_BRICK_I );
    this.currPoints = new Array();
    this.tempPoints = new Array();
    this._prepareMap();
};

RandomMap.prototype._prepareMap = function()
{
    this._createArr();
    this._createBarrier();
    this._getAndPushRandomPoints();
    this._makeLabyrinth();
    this._createWalls();
    if ( this.mapType == mapParams.FLAG_RANDOM_MAP )
    {
        this._createPlaceForFlag();
    }
};

RandomMap.prototype._createArr = function()
{
    for ( var i = 0; i < COUNT_BRICK_I; ++i )
    {
        this.map[i] = new Array( COUNT_BRICK_J );
    }
};

RandomMap.prototype._createBarrier = function()
{
    for ( var i = 0; i < COUNT_BRICK_I; ++i )
    {
        for ( var j = 0; j < COUNT_BRICK_J; ++j )
        {
            this.map[i][j] = 1;
        }
    }
};

RandomMap.prototype._getAndPushRandomPoints = function()
{
    var i = Math.floor( Math.random( ) * ( COUNT_BRICK_I - 2 ) ) + 1;
    var j = Math.floor( Math.random( ) * ( COUNT_BRICK_J - 2 ) ) + 1;

    this.currPoints.push( {
        i : i,
        j : j
    } );
};

RandomMap.prototype._makeLabyrinth = function()
{
    for ( var i = 0; i < this.currPoints.length; ++i )
    {
        this.map[this.currPoints[i].i][this.currPoints[i].j] = 0;
    }
    while ( this.currPoints.length != 0 )
    {
        this.tempPoints = new Array();
        for ( var i = 0; i < this.currPoints.length; ++i )
        {
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j, -1,  0 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  1,  0 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  0,  1 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  0, -1 );
        }
        this.currPoints = this.tempPoints;
    }
};

RandomMap.prototype._breakWalls = function( currI, currJ, di, dj )
{
    var ddi = di * ( Math.floor( Math.random( ) * ( 3 ) ) + 1);
    var ddj = dj * ( Math.floor( Math.random( ) * ( 3 ) ) + 1);
    if ( ( currI + ddi * 2 < 1 ) || ( currI + ddi * 2 > COUNT_BRICK_I - 2 ) ||
         ( currJ + ddj * 2 < 1 ) || ( currJ + ddj * 2 > COUNT_BRICK_J - 2) )
    {
        return;
    }

    for ( var i = 1; i <= Math.abs( ddi + ddj ); ++i )
    {
        if ( this.map[currI + di * 2][currJ + dj * 2] != 1 )
        {
            if( i != 1)
            {
                break;
            }
            else
            {
                return;
            }
        }
        this.map[currI + di][currJ + dj] = 0;
        this.map[currI + di * 2][currJ + dj * 2] = 0;
        currI += di * 2;
        currJ += dj * 2;
        this.tempPoints.push( {i : currI, j : currJ} );
    }
};

RandomMap.prototype._createWalls = function()
{
    for ( var i = 1; i < COUNT_BRICK_I - 1; ++i )
    {
        this.map[i][1] = 0;
        this.map[i][COUNT_BRICK_J - 2] = 0;
    }

    for ( var j = 1; j < COUNT_BRICK_J - 1; ++j )
    {
        this.map[1][j] = 0;
        this.map[COUNT_BRICK_I - 2][j] = 0;
    }
};

RandomMap.prototype._createPlaceForFlag = function()
{
    for ( var i = 5; i < 9; ++i )
    {
        for ( var j = 10; j < 14; ++j )
        {
            this.map[i][j] = 0;
        }
    }
    this.map[5][9] = 1;
    this.map[10][9] = 1;
    this.map[5][14] = 1;
    this.map[10][14] = 1;

}

module.exports = RandomMap;