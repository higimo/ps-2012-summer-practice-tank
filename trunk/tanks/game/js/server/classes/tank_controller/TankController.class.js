var Tank       = require( './Tank.class' );
var TankAi     = require( './ai/TankAi.class' );
var settings   = require( '../../GameSettings' );
var MathUtils  = require( '../../../common/utils/mathUtils.class' );
var CollisionsDeterminant = require( '../utils/CollisionsDeterminant.class' );
var TankMoving            = require( './TankMoving.class' );

var TankController = function( battleField )
{
    this.battleField = battleField;
    this.botNames  = ['John', 'Mark', 'Adam', 'Kyle', 'Luis', 'Eric', 'Cody'];
    this.botCount = 0;
};

TankController.prototype.createBot = function( group, indexTankAi )
{
    var ai = new TankAi( this.battleField, indexTankAi );
    var bot = new Tank( ai );
    bot.group = group;
    bot.tankName  = "b_" + this.botNames[this.botCount];
    this._allocateSpaceId( bot );
    this.botCount++;
    return bot;
};

TankController.prototype.createPlayer = function( group, name )
{
    var tank = new Tank();
    tank.group = group;
    tank.tankName = name;
    this._allocateSpaceId( tank );
    return tank;
};

TankController.prototype.recreateTank = function( tank )
{
    tank.health = 100;
    tank.speed  = 1;
    tank.route  = 'right';
    tank.shot   = { speed: 400, recharge: 0 };
    tank.attack = false;
    tank.moves  = false;
    this._allocateSpaceId( tank );
    return tank;
};

TankController.prototype.setToZeroTankPropeties = function( tank )
{
    tank.health = 0;
    tank.menu.frag = 0;
    tank.menu.dead = 0;
    tank.menu.friendlyKills = 0;
};

TankController.prototype.updateTank = function( tank )
{
    if ( tank.isBot() )
    {
        tank.ai.doStep();
    }
    else
    {
        this._updateTankPlayer( tank );
    }
    this._updateRecharge( tank );
};

TankController.prototype.getTankMark = function( tank )
{
    var score = 0;
    var koef = 1.5;
    if ( tank.menu.dead != 0 )
    {
        score = Math.round( ( tank.menu.frag / tank.menu.dead ) * 10 ) / 10;
    }
    else
    {
        score = ( tank.menu.frag == 0 ) ? -1: Math.round( ( tank.menu.frag * koef ) * 10 ) / 10;
    }
    return score;
};

TankController.prototype._updateTankPlayer = function( tank )
{
    if ( tank.moves )
    {
        TankMoving.doNextStep( this.battleField, tank, tank.route );
    }
    tank.menu.gamerCount = this.battleField.countPlayers + this.botCount;
};

TankController.prototype._updateRecharge = function( tank )
{
    if ( tank.shot.recharge > 0 )
    {
        tank.shot.recharge -= settings.GAME_INTERVAL;
    }
};

TankController.prototype._allocateSpaceId= function( tank )
{
    var correctPosition = false;
    while ( !correctPosition )
    {
        correctPosition = this._tryChooseCorrectTankPosition( tank );
    }
};

TankController.prototype._tryChooseCorrectTankPosition = function( tank )
{
    var isCorrectPosition = false;

    var group = tank.group;
    var point = this._getPointTankByGroup( group );
    if ( this.battleField.walls[point.i][point.j].isGrass() )
    {
        tank.point.x = point.j * settings.MAP_PARAMS.CELL_WIDTH;
        tank.point.y = point.i * settings.MAP_PARAMS.CELL_HEIGHT;
        isCorrectPosition = !CollisionsDeterminant.isCollisionWithTanks( tank, this.battleField.tanks );
    }

    return isCorrectPosition;
};

TankController.prototype._getPointTankByGroup = function( group )
{
    var minNumberString = 1;
    var maxNumberString = settings.MAP_PARAMS.COUNT_BRICK_I - 1;
    return {
        i: ( group == 0 )? MathUtils.getRandomInteger( minNumberString, minNumberString + 1 ): MathUtils.getRandomInteger( maxNumberString - 1, maxNumberString ),
        j: MathUtils.getRandomInteger( 1, settings.MAP_PARAMS.COUNT_BRICK_J - 1 )
    }
};

module.exports = TankController;
