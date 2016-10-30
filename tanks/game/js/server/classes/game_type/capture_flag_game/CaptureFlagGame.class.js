var ExplosionController   = require( '../../ExplosionController.class' );
var settings              = require( '../../../GameSettings' );
var GameTimer             = require( '../game_timer/GameTimer.class' );
var FlagRadar             = require( './FlagRadar.class' );
var Flag                  = require( './Flag.class' );

var CaptureFlagGame = function( battleField )
{
    this.battleField = battleField;
    this.timer = new GameTimer();
    this.flag  = new Flag();
    this.flagRadar = new FlagRadar( this.flag );
};

CaptureFlagGame.prototype.beginGame = function()
{
    this.timer.init( settings.GAME_TIME );
};

CaptureFlagGame.prototype.isGameEnded = function()
{
    this.flagRadar.updateCapture( this.battleField.tanks );
    var isTimeEnded = this.timer.isTimeEnded();
    var isFlagCapture = this.flagRadar.isFlagCaptured();
    if ( isFlagCapture )
    {
        this._explodeLoserTanks();
    }
    return isTimeEnded || isFlagCapture;
};

CaptureFlagGame.prototype.getTime = function()
{
    return this.timer.getTime();
};

CaptureFlagGame.prototype.getWinnerGroup = function()
{
    return this.flagRadar.getWinnerGroup();
};

CaptureFlagGame.prototype._explodeLoserTanks =function()
{
    var winnerGroup = this.getWinnerGroup();
    for ( var i = 0; i < this.battleField.tanks.length; i++)
    {
        if ( this.battleField.tanks[i].group != winnerGroup )
        {
            this._explodeTank( this.battleField.tanks[i] );
        }
    }
};

CaptureFlagGame.prototype._explodeTank =function( tank )
{
    if ( tank.health > 0 )
    {
        this.battleField.tankController.setToZeroTankPropeties( tank );
        ExplosionController.explodeTank( tank, this.battleField );
    }
};

module.exports = CaptureFlagGame;

