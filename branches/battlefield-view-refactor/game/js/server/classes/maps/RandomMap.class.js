var settings  = require( '../../GameSettings' );
var mapParams = settings.MAP_PARAMS;

const COUNT_BRICK_I = mapParams.COUNT_BRICK_I;
const COUNT_BRICK_J = mapParams.COUNT_BRICK_J;

var RandomMap = function()
{
    this.map      = new Array( COUNT_BRICK_I );
    this.currPoints = new Array();
    this.tempPoints = new Array();
    this._prepareMap();
}

RandomMap.prototype._prepareMap = function()
{
    this._createArr();
    this._createBarrier();
    this._getAndPushRandomPoints();
    this._makeLabirint();
    this._createWalls();
}

RandomMap.prototype._createArr = function()
{
    for ( var i = 0; i < COUNT_BRICK_I; ++i )
    {
        this.map[i] = new Array( COUNT_BRICK_J );
    }
}

RandomMap.prototype._createBarrier = function()
{
    for ( var i = 0; i < COUNT_BRICK_I; ++i )
    {
        for ( var j = 0; j < COUNT_BRICK_J; ++j )
        {
            this.map[i][j] = 1;
        }
    }
}

RandomMap.prototype._getAndPushRandomPoints = function()
{
    var i = Math.floor( Math.random( ) * ( COUNT_BRICK_I - 2 ) ) + 1;
    var j = Math.floor( Math.random( ) * ( COUNT_BRICK_J - 2 ) ) + 1;

    this.currPoints.push( {
        i : i,
        j : j
    } );
}

RandomMap.prototype._makeLabirint = function()
{
    for ( var i = 0; i < this.currPoints.length; ++i )
    {
        this.map[this.currPoints[i].i][this.currPoints[i].j] = 0;
    }
    while ( this.currPoints.length != 0 )
    {
        this.tempPoints = new Array();
        for( var i = 0; i < this.currPoints.length; ++i )
        {
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j, -1,  0 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  1,  0 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  0,  1 );
            this._breakWalls( this.currPoints[i].i, this.currPoints[i].j,  0, -1 );
        }
        this.currPoints = this.tempPoints;
    }
}

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
}

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
}

module.exports = RandomMap;