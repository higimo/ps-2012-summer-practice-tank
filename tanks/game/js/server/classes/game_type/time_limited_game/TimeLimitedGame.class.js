var BaseGame = require( '../BaseGame.class' );
var settings = require( '../../../GameSettings' );

var TimeLimitedGame = function()
{
    BaseGame.call( this );
};

TimeLimitedGame.prototype = Object.create( BaseGame.prototype );
TimeLimitedGame.prototype.constructor = TimeLimitedGame;

TimeLimitedGame.prototype.isGameEnded = function()
{
    return this.timer.isTimeEnded();
};

module.exports = TimeLimitedGame;
