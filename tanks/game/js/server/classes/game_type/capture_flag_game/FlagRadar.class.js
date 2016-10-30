var settings = require( '../../../GameSettings' );

var FlagRadar = function( flag )
{
    this.size = 4;
    this.point = this._getPointRadar( flag );
    this.capture = {
        first: 0,
        second: 0
    };
    this.isGroupInRadar = {
        first: false,
        second: false
    };
};

FlagRadar.prototype.updateCapture = function( tanks )
{
    this.isGroupInRadar.first = 0;
    this.isGroupInRadar.second = 0;
    for (var i = 0; i < tanks.length; i++)
    {
        this._updateCaptureByTank( tanks[i] );
    }
    this._setCaptureToZeroIfThereAreNotTank();
};

FlagRadar.prototype.isFlagCaptured = function()
{
    return this.capture.first > settings.TIME_FOR_FLAG_CAPTURE || this.capture.second > settings.TIME_FOR_FLAG_CAPTURE;
};

FlagRadar.prototype.getWinnerGroup = function()
{
    return ( this.capture.first > settings.TIME_FOR_FLAG_CAPTURE ) ? settings.GROUPS.FIRST: settings.GROUPS.SECOND;
};

FlagRadar.prototype._setCaptureToZeroIfThereAreNotTank = function()
{
    if ( !this.isGroupInRadar.first )
    {
        this.capture.first = 0;
    }
    if ( !this.isGroupInRadar.second )
    {
        this.capture.second = 0;
    }
};

FlagRadar.prototype._updateCaptureByTank = function( tank )
{
    if ( tank.health > 0 && this._isTankOnRadar( tank ) )
    {
        this._addCapture( tank.group );
    }
};

FlagRadar.prototype._addCapture = function( tankGroup )
{
    if ( tankGroup == settings.GROUPS.FIRST )
    {
        this.capture.first++;
        this.isGroupInRadar.first = true;
    }
    if ( tankGroup == settings.GROUPS.SECOND )
    {
        this.capture.second++;
        this.isGroupInRadar.second = true;
    }
};

FlagRadar.prototype._isTankOnRadar = function( tank )
{
    return ( tank.point.x >= this.point.x && tank.point.x <= this.point.x + this.size*settings.MAP_PARAMS.CELL_WIDTH
          && tank.point.y >= this.point.y && tank.point.y <= this.point.y + this.size*settings.MAP_PARAMS.CELL_HEIGHT )
};

FlagRadar.prototype._getPointRadar = function( flag )
{
    var centerFlagPoint = {
        x:flag.point.x + flag.dimension.width / 2,
        y:flag.point.y + flag.dimension.height / 2
    };
    return {
        x: centerFlagPoint.x - ( this.size / 2 ) * settings.MAP_PARAMS.CELL_WIDTH,
        y: centerFlagPoint.y - ( this.size / 2 ) * settings.MAP_PARAMS.CELL_HEIGHT
    };
};

module.exports = FlagRadar;