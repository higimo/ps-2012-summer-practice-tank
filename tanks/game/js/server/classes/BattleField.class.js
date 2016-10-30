var Map        = require( './maps/Map.class' );
var settings   = require( '../GameSettings' );
var KeyboardHandler       = require( './OnKeyboardHandler.class' );
var ExplosionController   = require( './ExplosionController.class' );
var RocketController      = require( './RocketController.class' );
var ShotController        = require( './ShotController.class' );
var CollisionsDeterminant = require( './utils/CollisionsDeterminant.class' );
var CompletionGameChecker = require( './game_type/CompletionGameChecker.class' );
var TankController        = require( './tank_controller/TankController.class' );

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
    this.date      = new Date();
    this.completionGameChecker = new CompletionGameChecker( this );
    this.tankController = new TankController( this );
};

BattleField.prototype.onKeyDownHandler = function( keyCode, id )
{
    KeyboardHandler.onKeyDownHandler( keyCode, id, this );
};

BattleField.prototype.onKeyUpHandler = function( keyCode, id )
{
    KeyboardHandler.onKeyUpHandler( keyCode, id, this );
};

BattleField.prototype.createBots = function( countOfBot )
{
    for ( var i = 0; i < countOfBot; ++i )
    {
        this.tanks[i] = this.tankController.createBot( this._getGroup(i), i );
    }
};

BattleField.prototype.updateData = function()
{
    this._checkCollisions();
    this._updateTanks();
    ShotController.updateShots( this );
    RocketController.updateRockets( this );
    ExplosionController.updateExplosion( this );
};

BattleField.prototype.isGameEnded = function()
{
    return this.completionGameChecker.isGameEnded( this.tanks );
};

BattleField.prototype._checkCollisions = function()
{
    for ( var i = 0; i < this.weapons.length; ++i )
    {
        if ( this.weapons[i].damage > 0 )
        {
            this._checkCollisionWithWalls( i );
            this._collisionWithTanks( i );
        }
    }
};

BattleField.prototype._checkCollisionWithWalls = function( id )
{
    var collision = CollisionsDeterminant.isCollisionWithWalls( this.weapons[id], this.walls );
    if ( collision )
    {
        this._makeExplosionWeapon( this.weapons[id] );
    }
};

BattleField.prototype._collisionWithTanks = function( id )
{
    var tankIdWithCollision = CollisionsDeterminant.getTankCollidedWithObject( this.weapons[id], this.tanks );
    if ( typeof tankIdWithCollision == 'number' )
    {
        this._updateTankHealth( this.tanks[tankIdWithCollision], this.weapons[id] );
        this._makeExplosionWeapon( this.weapons[id] );
        this._tryExplodeTank( this.tanks[tankIdWithCollision], this.weapons[id] );
    }         
};

BattleField.prototype._updateTankHealth = function( tank, weapon )
{
    tank.health -= weapon.damage;
};

BattleField.prototype._tryExplodeTank = function( tank, weapon )
{
    if ( tank.health <= 0 )
    {
        this._explodeTank( tank, weapon );
    }
};

BattleField.prototype._makeExplosionWeapon = function( weapon )
{
    weapon.damage = 0;
    ExplosionController.explodeRocket( weapon, this );
};

BattleField.prototype._explodeTank = function( tank, weapon )
{
    ExplosionController.explodeTank( tank, this );

    var tankKiller = this.tanks[weapon.tankId];
    this._updateScore( tank, tankKiller );
    this.tankController.recreateTank( tank );
};

BattleField.prototype._updateTanks = function()
{
    for ( var i = 0; i < this.tanks.length; ++i )
    {
        if ( this.tanks[i].health > 0 )
        {
            this.tankController.updateTank( this.tanks[i] );
        }
    }
};

BattleField.prototype._updateScore = function( tank, tankKiller )
{
    ++tank.menu.dead;
    if ( tank.group != tankKiller.group )
    {
        this._addPoint( tankKiller );
    }
    else
    {
        this._removePoint( tankKiller );
    }
    ++tankKiller.menu.frag;
};

BattleField.prototype._addPoint = function( tank )
{
    if ( tank.group == settings.GROUPS.FIRST )
    {
        ++this.point.first;
    }
    if ( tank.group == settings.GROUPS.SECOND )
    {
        ++this.point.second;
    }
};

BattleField.prototype._removePoint = function( tank )
{
    if ( tank.group == settings.GROUPS.FIRST )
    {
        --this.point.first;
    }
    if ( tank.group == settings.GROUPS.SECOND )
    {
        --this.point.second;
    }
    if ( ( tank.group != settings.GROUPS.FIRST ) || ( tank.group != settings.GROUPS.SECOND ) )
    {
        ++tank.friendlyKills;
    }
};

BattleField.prototype.getNewGamerId = function()
{
    var newGamerId = this.tanks.length;
    for ( var i = 0; i < newGamerId; i++ )
    {
        if ( this.tanks[i].health <= 0 )
        {
            newGamerId = i;
            break;
        }
    }
    this.lastGamerId = newGamerId;
    return newGamerId;
};

BattleField.prototype.getIdOfLastGamer = function()
{
    return this.lastGamerId;
};

BattleField.prototype._getGroup = function( id )
{
    return ( id % 2 == 0 ) ? 0 : 1;
};

BattleField.prototype.makeNewGamer = function( id, nameUser )
{
    if ( id != settings.VIEW_USER )
    {
        console.log( 'enter gamerId: ' + id );
        var group = this._getGroup(id);
        this.tanks[id] = this.tankController.createPlayer( group, nameUser );
    }
};

BattleField.prototype.deleteGamer = function( id )
{
    this.tankController.setToZeroTankPropeties( this.tanks[id] );
    --this.countPlayers;
    console.log( 'exit gamer id: ' + id );
};

BattleField.prototype.getScoreList = function()
{
    var scoreList = this._getScoreListForPlayers();
    this._addBotsToScoreList( scoreList );
    return scoreList;
};

BattleField.prototype._addBotsToScoreList = function( scoreList )
{
    var tanksCount = scoreList.length;
    for ( var i = 0; i < this.tanks.length; ++i )
    {
        if ( this.tanks[i].isBot() )
        {
            scoreList[tanksCount++] = this._getScoreForTank( this.tanks[i] );
        }
    }
};

BattleField.prototype._getScoreListForPlayers = function()
{
    var scoreList = new Array();
    var playerCount = 0;
    for ( var i = 0; i < this.tanks.length; ++i )
    {
        if ( !this.tanks[i].isBot() )
        {
            scoreList[playerCount++] = this._getScoreForTank( this.tanks[i] );
        }
    }
    return scoreList;
};

BattleField.prototype._getScoreForTank = function( currentTank )
{
    var mark = this.getTankMark( currentTank );
    return {
        name:  currentTank.tankName,
        frag:  currentTank.menu.frag,
        death: currentTank.menu.dead,
        mark:  mark
    };
};

BattleField.prototype.getTankMark = function( currentTank )
{
    var score = 0;
    var maxKoef = 1.5;
    var minKoef = 0.9;
    if ( currentTank.menu.dead != 0 )
    {
        score = Math.round( ( currentTank.menu.frag / currentTank.menu.dead ) * 10 ) / 10;
    }
    else
    {
        if ( currentTank.menu.frag == 0 )
        {
            score = -1;
        }
        else
        {
            var maxScore = Math.round( ( currentTank.menu.frag * maxKoef ) * 10 ) / 10;
            score = ( currentTank.friendlyKills == 0 ) ? maxScore : currentTank.menu.frag;
        }
    }
    if ( currentTank.friendlyKills != 0 )
    {

        score = score * ( minKoef / currentTank.friendlyKills );
    }

    return Math.round( score * 10 ) / 10;
};

module.exports = BattleField;