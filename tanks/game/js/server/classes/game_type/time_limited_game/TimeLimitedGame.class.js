var GameTimer   = require( '../game_timer/GameTimer.class' );
var settings    = require( '../../../GameSettings' );

var TimeLimitedGame = function()
{
    this.timer = new GameTimer();
};

TimeLimitedGame.prototype.beginGame = function()                           
{
    this.timer.init( settings.GAME_TIME );
};

TimeLimitedGame.prototype.isGameEnded = function()
{
    return this.timer.isTimeEnded();
};

TimeLimitedGame.prototype.getTime = function()
{
    return this.timer.getTime();
};

module.exports = TimeLimitedGame;