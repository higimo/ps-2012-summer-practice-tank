var MathUtils  = require( '../../common/utils/mathUtils' );
var keycode    = require( '../../common/utils/keycode' );
var Map        = require( './maps/Map.class' );
var Tank       = require( './Tank.class' );
var AI         = require( './ai/TankAI.class' );
var Rocket     = require( './Weapon.class' );
var Flame      = require( './Flame.class' );
var Explosion  = require( './Explosion.class' );
var Timer      = require( './game_type/TimeLimitedGame.class' );
var settings   = require( '../GameSettings' );
var TankAI      = require( './ai/TankAI.class' );

var BattleField = function( typeOfGame, typeOfMap, gameId )
{
    var map        = new Map( typeOfMap );
    this.width     = map.width;
    this.height    = map.height;
    this.tanks     = new Array();
    this.weapons   = new Array();
    this.walls     = map.gameGrid;
    this.explosion = new Array();
    this.point     = { first: 0, second: 0 };
    this.id        = gameId;
    this.countPlayers = 0;
    this.typeOfGame = typeOfGame;
    this.date      = this.getData();
    this.completionGameChecker = new Timer();
};

BattleField.prototype.getData = function( keyCode, id )
{
    return new Date();
}

BattleField.prototype.keyDownHandler = function( keyCode, id )
{
    switch( keyCode )
    {
        case keycode.UP:
            this.tanks[id].route = 'up';
            this.tanks[id].moves = true;
            break;
        case keycode.DOWN:
            this.tanks[id].route = 'down';
            this.tanks[id].moves = true;
            break;
        case keycode.LEFT:
            this.tanks[id].route = 'left';
            this.tanks[id].moves = true;
            break;
        case keycode.RIGHT:
            this.tanks[id].route = 'right';
            this.tanks[id].moves = true;
            break;
        case keycode.SPACE:
            if ( this.tanks[id].shot.recharge <= 0 )
            {
                this.tanks[id].attack = true;
            }
            break;
        default:
            break;
    }
}

BattleField.prototype.onKeyboardEvent = function( keyCode, id )
{
    switch( keyCode )
    {
        case keycode.UP:
            if ( this.tanks[id].route == 'up' )
            {
                this.tanks[id].moves = false;
            }
            break;
        case keycode.DOWN:
            if ( this.tanks[id].route == 'down' )
            {
                this.tanks[id].moves = false;
            }
            break;
        case keycode.LEFT:
            if ( this.tanks[id].route == 'left' )
            {
                this.tanks[id].moves = false;
            }
            break;
        case keycode.RIGHT:
            if ( this.tanks[id].route == 'right' )
            {
                this.tanks[id].moves = false;
            }
            break;
        case keycode.SPACE:
            this.tanks[id].attack = false;
            break;
        default:
            break;
    }
}

BattleField.prototype.shot = function( id )
{                                                     
    var numFreeArray                 = this.getFreeNumWeaponArray();
    if ( this.weapons[numFreeArray] )
    {
        delete this.weapons[numFreeArray].fire;
        delete this.weapons[numFreeArray];
    }
    this.weapons[numFreeArray]       = new Rocket();
    this.weapons[numFreeArray].route = this.tanks[id].route;
    this.weapons[numFreeArray].fire  = new Flame();
    
    var fire                         = this.weapons[numFreeArray].fire;
    var emptySpace                   = 2;
    var thisWeapon                   = this.weapons[numFreeArray]
    /* ToDo: В каждом повороте по сути одно и то же творится, переделать */
    switch( thisWeapon.route )
    {
        case 'up':
            this.shotRouteUp( thisWeapon, id, emptySpace, fire, numFreeArray );
          break;
        case 'down':
            this.shotRouteDown( thisWeapon, id, emptySpace, fire, numFreeArray );
          break;
        case 'left':
            this.shotRouteLeft( thisWeapon, id, emptySpace, fire, numFreeArray );
          break;                     
        case 'right':
            this.shotRouteRight( thisWeapon, id, emptySpace, fire, numFreeArray );
          break;
        default:
          break;
    }

    this.tanks[id].shot.recharge = this.tanks[id].shot.speed;
    this.weapons[numFreeArray].tankId = id;
}

BattleField.prototype.shotRouteUp = function( thisWeapon, id, emptySpace, fire, numFreeArray )
{
    thisWeapon.point.x          = this.tanks[id].point.x + ( ( this.tanks[id].dimension.width - thisWeapon.dimension.height ) / 2 );
    thisWeapon.point.y          = this.tanks[id].point.y - thisWeapon.dimension.width;
    var copyWidth               = thisWeapon.dimension.width;
    thisWeapon.dimension.width  = thisWeapon.dimension.height; 
    thisWeapon.dimension.height = copyWidth;
    copyWidth             = fire.dimension.width;
    fire.dimension.width  = fire.dimension.height;
    fire.dimension.height = copyWidth;
    fire.point.x          = thisWeapon.point.x;
    fire.point.y          = thisWeapon.point.y + thisWeapon.dimension.height + emptySpace;
    fire.speed            = thisWeapon.speed;
}

BattleField.prototype.shotRouteDown = function( thisWeapon, id, emptySpace, fire, numFreeArray )
{
    thisWeapon.point.x          = this.tanks[id].point.x + ( ( this.tanks[id].dimension.width - thisWeapon.dimension.height ) / 2 );
    thisWeapon.point.y          = this.tanks[id].point.y + this.tanks[id].dimension.width;
    var copyWidth               = this.weapons[numFreeArray].dimension.width;
    thisWeapon.dimension.width  = this.weapons[numFreeArray].dimension.height;
    thisWeapon.dimension.height = copyWidth;
    var tempWidth         = fire.dimension.width;
    fire.dimension.width  = fire.dimension.height;
    fire.dimension.height = tempWidth;
    fire.point.x          = thisWeapon.point.x;
    fire.point.y          = thisWeapon.point.y - fire.dimension.height - emptySpace;
    fire.speed            = thisWeapon.speed;
}

BattleField.prototype.shotRouteLeft = function( thisWeapon, id, emptySpace, fire, numFreeArray )
{
    thisWeapon.point.x = this.tanks[id].point.x - thisWeapon.dimension.width;
    thisWeapon.point.y = this.tanks[id].point.y + ( ( this.tanks[id].dimension.width - thisWeapon.dimension.height ) / 2 );
    fire.point.x = thisWeapon.point.x + this.weapons[numFreeArray].dimension.width + emptySpace ;
    fire.point.y = thisWeapon.point.y;
    fire.speed   = thisWeapon.speed;
}

BattleField.prototype.shotRouteRight = function( thisWeapon, id, emptySpace, fire, numFreeArray )
{
    thisWeapon.point.x = this.tanks[id].point.x + this.tanks[id].dimension.width;
    thisWeapon.point.y = this.tanks[id].point.y + ( ( this.tanks[id].dimension.width - thisWeapon.dimension.height ) / 2 );
    fire.point.x       = this.weapons[numFreeArray].point.x - fire.dimension.width - emptySpace;
    fire.point.y       = this.weapons[numFreeArray].point.y;
    fire.speed         = this.weapons[numFreeArray].speed;    
}

BattleField.prototype.getFreeNumWeaponArray = function()
{
    for ( var i = 0; i < this.weapons.length; i++ )
    {
        if ( this.weapons[i].damege <= 0 )
        {
            return i;
        }
    }
    return this.weapons.length;
}

BattleField.prototype.createBot = function( countOfBot )
{
    for ( var i = 0; i < countOfBot; ++i )
    {
        this.makeNewTankAI( i, 'bot' );
    }
}

BattleField.prototype.allocateSpaceId = function( id )
{                                       
    var count = id;
    var copyTank = {
        point : { 
            x : 0,
            y : 0
        },
        dimension : {
            width  : settings.TANK_SIZE,
            height : settings.TANK_SIZE
        }
    };

    while ( count == id )
    {
        var correctPosition = true;
        var collision       = false;
        var pointI          = Math.floor( Math.random( ) * ( settings.MAP_PARAMS.COUNT_BRICK_I - 2 ) )  + 1;
        var pointJ          = Math.floor( Math.random( ) * ( settings.MAP_PARAMS.COUNT_BRICK_J - 2 ) ) + 1;

        if ( this.walls[pointI][pointJ].type == 0 )
        {
            copyTank.point.y = pointI * 40;
            copyTank.point.x = pointJ * 40;
            for ( var i = 0; i < this.tanks.length && !collision; i++ )
            {
                collision = MathUtils.intersectionQuadrate( copyTank, this.tanks[i] );
                if( collision )
                {
                    correctPosition = false;
                }
            }
            if ( correctPosition )
            {
                this.tanks[count].point.x = copyTank.point.x;
                this.tanks[count].point.y = copyTank.point.y;
                count += 1;
            }
        }
    }
}

BattleField.prototype.updateData = function()
{
    this.collision();
    this.updateTanks();
    this.updateShot();
    this.updateRocket();
    this.updateDead();
    if ( this.completionGameChecker.isGameEnded() )
    {
        //console.log("game must be ended");
    }
}

BattleField.prototype.updateShot = function()
{
    for ( var i = 0;  i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health > 0 && this.tanks[i].attack && this.tanks[i].shot.recharge <= 0 )
        {
            this.shot( i );                
        }
    }
}

BattleField.prototype.collision = function()
{
    var collision = false;
    for ( var i = 0; i < this.weapons.length; i++ )
    {
        if ( this.weapons[i].damege > 0 )
        {
            collision = MathUtils.collisionWithWalls( this.weapons[i], this );
            if ( collision )
            {
                this.weapons[i].damege = 0;
                this.effectExplosion( this.weapons[i], 20, 20, 'rocket' );
            }
            for ( var j = 0; j < this.tanks.length; j++ )
            {
                if ( this.tanks[j].health > 0 )
                {
                    collision = MathUtils.intersectionQuadrate( this.weapons[i], this.tanks[j] );
                    if ( collision )
                    {
                        this.tanks[j].health  -= this.weapons[i].damege;
                        this.weapons[i].damege = 0;
                        this.effectExplosion( this.weapons[i], 20, 20, 'rocket' )
                    }
                    if ( this.tanks[j].health <= 0 )
                    {
                        this.tankIsDead( j, this.weapons[i].tankId );
                    }
                }
            }
        }
    }
}
                              
BattleField.prototype.tankIsDead = function( id, rocketId )
{
    this.effectExplosion( this.tanks[id], 40, 40, 'tank' );
    this.tanks[id].menu.dead++;
    if ( this.tanks[id].group != this.tanks[rocketId].group ) 
    {
        if ( this.tanks[rocketId].group == 0 )
        {
            this.point.first++;
        }
        if ( this.tanks[rocketId].group == 1 )
        {
            this.point.second++;
        }
    }                             
    else
    {
        if ( this.tanks[rocketId].group == 0 )
        {
            this.point.first--;
        }
        if ( this.tanks[rocketId].group == 1 )
        {
            this.point.second--;
        }
    }
    this.tanks[rocketId].menu.frag++;
    if ( this.tanks[id].isBot() )
    {
        this.makeNewTankAI( id, this.tanks[id].tankName );
    }
    else
    {   
        this.makeNewGamer( id, this.tanks[id].tankName );
    }
}

BattleField.prototype.effectExplosion = function( weapons, width, height, type )
{
    var getFreeArrayPosition             = this.getFreeNumDeadArray();
    if ( this.explosion[getFreeArrayPosition] )
    {
        delete this.explosion[getFreeArrayPosition];
    }
    this.explosion[getFreeArrayPosition] = new Explosion();
    var explosion                        = this.explosion[getFreeArrayPosition];
    
    if ( type !== 'rocket' )
    {
        explosion.type     = 'tank';
        explosion.timeLife = 350;
    }

    explosion.dimension.width  = width;
    explosion.dimension.height = height;
    explosion.point.x          = weapons.point.x + ( weapons.dimension.width  / 2 );
    explosion.point.y          = weapons.point.y + ( weapons.dimension.height / 2 );
}

BattleField.prototype.editDimension = function( explosion, minTime, maxTime, dimension )
{
    if ( explosion.timeLife > minTime && explosion.timeLife < maxTime )
    {
        explosion.dimension.width  = dimension;
        explosion.dimension.height = dimension;
    }
}

BattleField.prototype.updateDead = function()
{
    for ( var i = 0; i < this.explosion.length; i++ )
    {
        if ( this.explosion[i].timeLife > 0 )
        {
            this.explosion[i].timeLife -= settings.GAME_INTERVAL;
    
            if ( this.explosion[i].type == 'tank' )
            {
                this.editDimension( this.explosion[i], 50,   100, 50 );
                this.editDimension( this.explosion[i], 100,  150, 35 );
                this.editDimension( this.explosion[i], 150,  200, 25 );
                this.editDimension( this.explosion[i], 200,  250, 15 );
                this.editDimension( this.explosion[i], 250,  300, 10 );
            }
            if ( this.explosion[i].type == 'rocket' )
            {
                this.editDimension( this.explosion[i], 0,   30,  30 );
                this.editDimension( this.explosion[i], 30,  60,  25 );
                this.editDimension( this.explosion[i], 60,  90,  15 );
                this.editDimension( this.explosion[i], 90,  120, 10 );
                this.editDimension( this.explosion[i], 120, 150, 5 );
            }
        }
    }
}

BattleField.prototype.updateTanks = function()
{
    
    for ( var i = 0, arrayLength = this.tanks.length; i < arrayLength; ++i )
    {
        if ( this.tanks[i].health > 0 )
        {
            if ( this.tanks[i].isBot() )
            {
                this.tanks[i].ai.doStep(this, i);
            }
            else
            {
                this.updateTankPlayer( i );
            }
            if ( this.tanks[i].shot.recharge > 0 )
            {
                this.tanks[i].shot.recharge -= settings.GAME_INTERVAL;
            }
        }
    }
}

BattleField.prototype.getFreeNumDeadArray = function()
{
    for ( var i = 0; i < this.explosion.length; i++ )
    {
        if ( this.explosion[i].timeLife <= 0 )
        {
            return i;
        }
    }
    return this.explosion.length;
}

BattleField.prototype.updateTankPlayer = function( id )
{
    if ( this.tanks[id].moves )
    {
        var step              = this.getNextGamerStep( id );
        var nextGamerStep = {
            point : { 
                x : step.x,
                y : step.y
            },
            dimension : {
                width  : settings.TANK_SIZE,
                height : settings.TANK_SIZE
            }
        };
        var isCanNextStep = MathUtils.getIsCanNextStep( this, id, nextGamerStep );
        if ( isCanNextStep )
        {
            this.tanks[id].point.x = nextGamerStep.point.x;
            this.tanks[id].point.y = nextGamerStep.point.y;
        }
        nextGamerStep = null;
    }
    this.tanks[id].menu.numGamer = 0;
    for ( var i = 0; i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health > 0 )
        {
            this.tanks[id].menu.numGamer++;
        }
    }                                                          
}

BattleField.prototype.getNextGamerStep = function( id )
{
    var valueX = this.tanks[id].point.x,
        valueY = this.tanks[id].point.y;
    
    switch( this.tanks[id].route )
    {
        case 'up':
            valueY -= settings.TANK_SPEED;
            break;
        case 'down':                                                       
            valueY += settings.TANK_SPEED;
            break;
        case 'left':
            valueX -= settings.TANK_SPEED;
            break;
        case 'right':
            valueX += settings.TANK_SPEED;
            break;
        default:
            break;
    }
    return { x: valueX,
             y: valueY };
}

BattleField.prototype.updateRocket = function()
{
    for ( var i = 0; i < this.weapons.length; i++ )
    {
        if ( this.weapons[i].damege > 0 )
        {
            var fire      = this.weapons[i].fire;
            var getRandom = MathUtils.getRandomArbitary( 6, 15 );
            switch( this.weapons[i].route )
            {
                case 'up':
                  this.weapons[i].point.y -= this.weapons[i].speed;
                  fire.point.y            -= fire.speed;
                  fire.dimension.height    = getRandom;
                  break;
                case 'down':
                  this.weapons[i].point.y += this.weapons[i].speed;
                  fire.point.y            += fire.speed;
                  fire.dimension.height    = getRandom;
                  break;
                case 'left':
                  this.weapons[i].point.x -= this.weapons[i].speed;
                  fire.point.x            -= fire.speed;
                  fire.dimension.width     = getRandom;
                  break;
                case 'right':
                  this.weapons[i].point.x += this.weapons[i].speed;
                  fire.point.x            += fire.speed;
                  fire.dimension.width     = getRandom;
                  break;
                default:
                  break;
            }
        }
    }
}                      

BattleField.prototype.isZeroGamer = function()
{
    for ( var i = 0; i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health > 0 && this.tanks[i].isBot() )
        {
            return false;
        }
    }
    return true;
}

BattleField.prototype.zeroMenu = function()
{
    console.log( 'new GAME!' );
    this.completionGameChecker.beginGame();
    this.point.first = 0;
    this.point.second = 0;
}

BattleField.prototype.getNewGamerId = function()
{
    for ( var i = 0; i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health <= 0 )
        {
            return i;
        }
    }
    return this.tanks.length;
}

BattleField.prototype.getGamerId = function()
{
    return this.getNewGamerId() - 1;
}

BattleField.prototype.makeNewGamer = function( id, nameUser )
{
    if ( id != -1 )
    {                                        
        console.log( 'enter gamerId: ' + id );   
        var menuDead = 0;
        var frag     = 0;
        var firstGamePlayer = id == this.tanks.length;    

        if ( !firstGamePlayer )
        {
            menuDead = this.tanks[id].menu.dead;
            frag     = this.tanks[id].menu.frag;
            var group = this.tanks[id].group;    
        }
        else
        {
            var group = ( id % 2 == 0 ) ? 0 : 1;
        }
        if ( typeof this.tanks[id] != 'undefined' )
        {
            delete this.tanks[id];
        }
        this.tanks[id]          = new Tank();
        this.tanks[id].tankName = nameUser;
        this.tanks[id].group    = group;
        this.allocateSpaceId( id );
        this.tanks[id].menu.dead = menuDead;
        this.tanks[id].menu.frag = frag;
    }
}

BattleField.prototype.makeNewTankAI = function( id, userName )
{                                        
    console.log( 'restart gamerAI: ' + id );
    var firstGamePlayer = id == this.tanks.length;
    var group = 0;

    if ( !firstGamePlayer )
    {
        group = this.tanks[id].group;
    }
    else
    {
        group = ( id % 2 == 0 ) ? 0 : 1;
    }
    if ( typeof this.tanks[id] != 'undefined' )
    {
        delete this.tanks[id];
    }
    this.tanks[id]           = new Tank(AI);
    this.tanks[id].tankName  = userName;
    this.tanks[id].group    = group;
    this.allocateSpaceId( id );
    this.tanks[id].moves = true;
}

BattleField.prototype.deleteGamer = function( id )
{
    this.tanks[id].health = 0;
    this.tanks[id].menu.dead = 0;
    this.tanks[id].menu.frag = 0;
    this.tanks[id].menu.numGamer = 0;
    --this.countPlayers;
    console.log( 'gamer id: ' + id + ' exit' );
}

module.exports = BattleField;