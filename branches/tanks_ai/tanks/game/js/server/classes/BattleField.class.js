var Map        = require( './maps/Map.class' );
var settings   = require( '../GameSettings' );
var KeyboardHandler       = require( './OnKeyboardHandler.class' );
var ExplosionController   = require( './ExplosionController.class' );
var RocketController      = require( './RocketController.class' );
var ShotController        = require( './ShotController.class' );
var CollisionsDeterminant = require( './utils/CollisionsDeterminant.class' );
var GameRulesChecker = require( './game_type/GameRulesChecker.class' );
var TankController        = require( './tank_controller/TankController.class' );
var helperFunctions       = require( '../../common/utils/helperFunctions' );

var BattleField = function( typeOfGame, typeOfMap, gameId )
{
    var map        = new Map( typeOfMap );
    this.width     = map.width;
    this.height    = map.height;
    this.tanks     = new Array();
    this.weapons   = new Array();
    this.walls     = map.gameGrid;
    this.explosion = new Array();
    this.id        = gameId;
    this.countPlayers = 0;
    this.typeOfGame = typeOfGame;
    this.date      = new Date();
    this.gameRulesChecker = new GameRulesChecker( this );
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

BattleField.prototype.onMoveHandler = function( moveData, id )
{
    var fixedData = this._fixMoveData( moveData );
    this._setBotDirection( fixedData, id );
    this._setBotAttack( fixedData, id );
};

BattleField.prototype._setBotDirection = function( moveData, id )
{
    if ( moveData.direction == settings.AI.MOVE.NONE )
    {
        this.tanks[id].moves = false;
        this.tanks[id].directInBottleneck.isBottleneck = false;
    }
    else
    {
        var directions = [null, settings.DIRECTION.UP, settings.DIRECTION.RIGHT, settings.DIRECTION.DOWN, settings.DIRECTION.LEFT];
        this.tanks[id].moves = true;
        this.tanks[id].route = directions[moveData.direction];
    }
};

BattleField.prototype._setBotAttack = function( moveData, id )
{
    this.tanks[id].attack = moveData.fire && this.tanks[id].shot.recharge <= 0;
};

BattleField.prototype._fixMoveData = function( moveData )
{
    var defaultMove =
    {
        direction: settings.AI.MOVE.NONE,
        fire: 0
    };

    var fixedData = moveData;

    if ( !fixedData || typeof fixedData !== 'object' )
    {
        fixedData = defaultMove;
        return fixedData;
    }

    for ( var key in defaultMove )
    {
        if ( !fixedData.hasOwnProperty( key ) )
        {
            fixedData[key] = defaultMove[key];
        }
    }

    if ( !( fixedData.direction in helperFunctions.getArrayFromObject( settings.AI.MOVE ) ) )
    {
        fixedData.direction = defaultMove.direction;
    }

    return fixedData;
};

BattleField.prototype.createBots = function( countOfBot )
{
    for ( var i = 0; i < countOfBot; ++i )
    {
        this.tanks[i] = this.tankController.createBot( this.gameRulesChecker.getGroup( i ), i );
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
    return this.gameRulesChecker.isGameEnded( this.tanks );
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
    this._updateScoreAfterFrag( tank, tankKiller );
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

BattleField.prototype._updateScoreAfterFrag = function( tank, tankKiller )
{
    if ( tank.group == tankKiller.group )
    {
        ++tankKiller.friendlyKills;
        ++tankKiller.menu.dead;
    }
    else
    {
        ++tank.menu.dead;
        ++tankKiller.menu.frag;
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

BattleField.prototype.makeNewGamer = function( id, nameUser )
{
    if ( id != settings.VIEW_USER )
    {
        console.log( 'enter gamerId: ' + id );
        var group = this.gameRulesChecker.getGroup( id );
        this.tanks[id] = this.tankController.createPlayer( group, nameUser );
    }
};

BattleField.prototype.deleteGamer = function( id )
{
    this.tankController.setToZeroTankProperties( this.tanks[id] );
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

BattleField.prototype.getTankMark = function( tank )
{
    return this.gameRulesChecker.getTankMark( tank );
};

module.exports = BattleField;