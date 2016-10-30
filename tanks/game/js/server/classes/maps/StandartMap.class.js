var fs = require( 'fs' );
var settings  = require( '../../GameSettings' );

var StandartMap = function( mapName )
{
    this.mapName = mapName;
    this.mapParams   = settings.MAP_PARAMS;
    this.fileHandle  = null;
    this.data        = null;
    this.map         = new Array( this.mapParams.COUNT_BRICK_I );
    this.str         = "";
    this._prepareMap();
};

StandartMap.prototype._prepareMap = function()
{
    this._openAndReadFile();
    this._replaceSpacesAndTransfers();
    this._fillMap();

    fs.closeSync( this.fileHandle );
};

StandartMap.prototype._openAndReadFile = function()
{
    switch ( this.mapName )
    {
        case this.mapParams.DEFAULT_MAP:
        {
            this.fileHandle = fs.openSync( "./js/server/classes/maps/default_map.txt", "r", 0644 );
            break;
        }
        case this.mapParams.FLAG_DEFAULT_MAP:
        {
            this.fileHandle = fs.openSync( "./js/server/classes/maps/flag_map.txt", "r", 0644 );
            break;
        }
    }
    this.data = fs.readSync( this.fileHandle, 500, null, 'ascii' );
};

StandartMap.prototype._replaceSpacesAndTransfers = function()
{
    this.str = this.data[0].replace( /\r\n/g, "" );
    this.str = this.str.replace( /\n/g, "" );
};

StandartMap.prototype._fillMap = function()
{
    var k = 0;
    for( var i = 0; i < this.mapParams.COUNT_BRICK_I; i++ )
    {
        this.map[i] = new Array( this.mapParams.COUNT_BRICK_J );
        for( var j = 0; j < this.mapParams.COUNT_BRICK_J; j++ )
        {
            this.map[i][j] = this.str[k];
            ++k;
        }
    }
};

module.exports = StandartMap;