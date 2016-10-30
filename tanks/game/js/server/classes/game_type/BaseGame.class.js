var GameTimer = require( './game_timer/GameTimer.class' );
var settings  = require( './../../GameSettings' );
var MathUtils = require( '../../../common/utils/mathUtils.class' );

var BaseGame = function()
{
    this.timer = new GameTimer();
};

BaseGame.prototype.beginGame = function()
{
    this.timer.init( settings.GAME_TIME );
};

BaseGame.prototype.getTime = function()
{
    return this.timer.getTime();
};

BaseGame.prototype.getGroup = function( tankId )
{
    return ( tankId % 2 == 0 ) ? settings.GROUPS.FIRST : settings.GROUPS.SECOND;
};

BaseGame.prototype.getTankPointByGroup = function( group )
{
    var minNumberString = 1;
    var maxNumberString = settings.MAP_PARAMS.COUNT_BRICK_I - 1;
    return {
        i: ( group == settings.GROUPS.FIRST ) ? MathUtils.getRandomInteger( minNumberString, minNumberString + 1 ) :
            MathUtils.getRandomInteger( maxNumberString - 1, maxNumberString ),
        j: MathUtils.getRandomInteger( 1, settings.MAP_PARAMS.COUNT_BRICK_J - 1 )
    };
};

BaseGame.prototype.getTankMark = function( tank )
{
    var score = Math.round( ( tank.menu.frag / ( tank.menu.dead + 1) ) * 10 ) / 10;
    return Math.round( score * 10 ) / 10;
};

module.exports = BaseGame;
