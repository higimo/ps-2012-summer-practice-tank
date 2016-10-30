var GameTimer = function()
{
    this.startTime = 0;
    this.time      = 0;
    this.timeLimit = 0;
};

GameTimer.prototype.init = function( timeLimit )
{
    this.startTime = new Date().getTime();
    this.timeLimit = timeLimit;
};

GameTimer.prototype.isTimeEnded = function()
{
    var timeNow = new Date().getTime();
    this.time =  this.timeLimit - (timeNow - this.startTime);
    return ( this.time <= 0 );
};

GameTimer.prototype.getTime = function()
{
    return this.time;
};

module.exports = GameTimer;