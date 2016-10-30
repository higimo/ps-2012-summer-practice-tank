var settings    = require( '../../GameSettings' );

var TimeLimitedGame = function()
{
    this.startTime = 0;
    this.time      = 0;
};

TimeLimitedGame.prototype.beginGame = function()                           
{
    this.startTime = new Date().getTime();
    this.time = settings.GAME_TIME;
};

TimeLimitedGame.prototype.isGameEnded = function()
{
    var timeNow = new Date().getTime();
    this.time =  settings.GAME_TIME - (timeNow - this.startTime);
    if ( this.time >= 0 )
    {
        return 1;
    }
    return 0;
};

module.exports = TimeLimitedGame;