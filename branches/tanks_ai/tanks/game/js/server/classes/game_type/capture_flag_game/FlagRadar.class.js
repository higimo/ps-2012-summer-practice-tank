var settings = require( '../../../GameSettings' );

var FlagRadar = function( flag )
{
    this.NO_WINNER_GROUP = -1;
    this.size = 4;
    this.point = this._getPointRadar( flag );
    this.captures = [0, 0, 0, 0, 0, 0, 0, 0];
    this.groupsInRadar = [false, false, false, false, false, false, false, false];
};

FlagRadar.prototype.updateCapture = function( tanks )
{
    for ( var i = 0; i < this.groupsInRadar.length; ++i )
    {
        this.groupsInRadar[i] = false;
    }

    for (var i = 0; i < tanks.length; i++)
    {
        this._updateCaptureByTank( tanks[i] );
    }
    this._setCaptureToZeroIfThereAreNotTank();
};

FlagRadar.prototype.isFlagCaptured = function()
{
    for ( var i = 0; i < this.captures.length; ++i )
    {
        if ( this.captures[i] > settings.TIME_FOR_FLAG_CAPTURE )
        {
            return true;
        }
    }
    return false;
};

FlagRadar.prototype.getWinnerGroup = function()
{
    for ( var i = 0; i < this.captures.length; ++i )
    {
        if ( this.captures[i] > settings.TIME_FOR_FLAG_CAPTURE )
        {
            return i;
        }
    }
    return this.NO_WINNER_GROUP;
};

FlagRadar.prototype._setCaptureToZeroIfThereAreNotTank = function()
{
    for ( var i = 0; i < this.groupsInRadar.length; ++i )
    {
        if ( ! this.groupsInRadar[i] )
        {
            this.captures[i] = 0;
        }
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
    ++this.captures[tankGroup];
    this.groupsInRadar[tankGroup] = true;
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