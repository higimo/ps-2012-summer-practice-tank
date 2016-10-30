var BaseGame            = require( '../BaseGame.class' );
var ExplosionController = require( '../../ExplosionController.class' );
var FlagRadar           = require( './FlagRadar.class' );
var Flag                = require( './Flag.class' );
var settings            = require( '../../../GameSettings' );

var CaptureFlagGame = function( battleField )
{
    BaseGame.call( this );
    this.battleField = battleField;
    this.flag  = new Flag();
    this.flagRadar = new FlagRadar( this.flag );
    this.NO_WINNER_GROUP = this.flagRadar.NO_WINNER_GROUP;
};

CaptureFlagGame.prototype = Object.create( BaseGame.prototype );
CaptureFlagGame.prototype.constructor = CaptureFlagGame;

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

CaptureFlagGame.prototype.getWinnerGroup = function()
{
    return this.flagRadar.getWinnerGroup();
};

CaptureFlagGame.prototype._explodeLoserTanks = function()
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

CaptureFlagGame.prototype._explodeTank = function( tank )
{
    if ( tank.health > 0 )
    {
        ExplosionController.explodeTank( tank, this.battleField );
    }
};

CaptureFlagGame.prototype.getTankMark = function( tank )
{
    var score = BaseGame.prototype.getTankMark.call( this, tank );
    if ( tank.group == this.getWinnerGroup() )
    {
        score += this._countEnemies( tank );
    }
    return score;
};

CaptureFlagGame.prototype._countEnemies = function( tank )
{
    var enemiesCount = 0;

    for ( var i = 0; i < this.battleField.tanks.length; ++i )
    {
        if ( this.battleField.tanks[i].group != tank.group )
        {
            ++enemiesCount;
        }
    }

    return enemiesCount;
};

module.exports = CaptureFlagGame;
