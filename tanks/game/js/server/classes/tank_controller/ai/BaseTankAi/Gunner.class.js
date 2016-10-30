var DeterminantTankPosition = require( '../../../utils/DeterminantTankPosition.class' );
var TankMoving     = require( '../../TankMoving.class' );
var ShotController = require( '../../../ShotController.class' );
var settings       = require( '../../../../GameSettings' );

var Gunner = function()
{
    this.indexTankAi = null;
};

Gunner.prototype.atackIfSeeEnemy = function( battleField, indexTankAi )
{ 
    this._rememberTankInfo( indexTankAi );
    this.atack = true;
    return this._lookForEnemyAndFired( battleField );
};

Gunner.prototype.fireIfSeeEnemy = function( battleField, indexTankAi )
{
    this._rememberTankInfo( indexTankAi );
    this.atack = false;
    return this._lookForEnemyAndFired( battleField );
};

Gunner.prototype._rememberTankInfo = function( indexTankAi )
{
    this.indexTankAi = indexTankAi;
};

Gunner.prototype._lookForEnemyAndFired = function( battleField )
{
    var currentTank = battleField.tanks[this.indexTankAi];
    var routeToEnemy = this._searchEnemyOnFourDirections( battleField, currentTank );
    if ( routeToEnemy )
    {
        this._turnAndFire( routeToEnemy, battleField );
        return true;
    }
    return false;
};

Gunner.prototype._turnAndFire = function( routeToEnemy, battleField )
{
    this._stepToEnemy( routeToEnemy, battleField );
    this._shot( battleField );
};

Gunner.prototype._shot = function( battleField )
{
    var canShot = ( battleField.tanks[this.indexTankAi].shot.recharge <= 0 );
    if ( canShot )
    {
        ShotController.makeShot( this.indexTankAi, battleField );
    }
};

Gunner.prototype._stepToEnemy = function( routeToEnemy, battleField )
{
    if ( this.atack && TankMoving.canNextStep( battleField, battleField.tanks[this.indexTankAi], routeToEnemy ) )
    {
        TankMoving.doNextStep( battleField, battleField.tanks[this.indexTankAi], routeToEnemy );
    }
    else
    {
        TankMoving.route( battleField.tanks[this.indexTankAi], routeToEnemy );
    }
};

Gunner.prototype._searchEnemyOnFourDirections = function( battleField, currentTank )
{
    var routeToEnemy = null;
    for ( var i = 0; (i < battleField.tanks.length && !routeToEnemy); i++ )
    {
        var isEnemy = ( currentTank.group != battleField.tanks[i].group );
        var isTankAlive = ( battleField.tanks[i].health > 0 );
        if ( isEnemy && isTankAlive )
        {
            routeToEnemy = this._whereIsEnemySeen( battleField.tanks[i], battleField, currentTank );
        }
    }
    return routeToEnemy;
};

Gunner.prototype._whereIsEnemySeen = function( enemy, battleField, currentTank )
{
    var routeToEnemy = null;
    if ( this._lookForHorizontal( enemy, battleField, currentTank ) )
    {
        routeToEnemy = ( enemy.point.y <=  currentTank.point.y ) ? settings.DIRECTION.UP: settings.DIRECTION.DOWN; 
    }
    else if ( this._lookForVertical( enemy, battleField, currentTank ) )
    {
        routeToEnemy = ( enemy.point.x <=  currentTank.point.x ) ? settings.DIRECTION.LEFT: settings.DIRECTION.RIGHT; 
    }
    return routeToEnemy;
};

Gunner.prototype._lookForHorizontal = function( enemy, battleField, currentTank )
{
    return ( this._isTankFiringLine( "constX", enemy, currentTank, battleField )
        && !DeterminantTankPosition.isTankLocatedBetweenTanks( "constX", battleField.tanks, currentTank, enemy));
};

Gunner.prototype._lookForVertical = function( enemy, battleField, currentTank )
{
    return ( this._isTankFiringLine( "constY", enemy, currentTank, battleField )
        && !DeterminantTankPosition.isTankLocatedBetweenTanks( "constY", battleField.tanks, currentTank, enemy));
};

Gunner.prototype._isTankFiringLine = function( constVar, enemy, currentTank, battleField )
{
    var tankWeapon = {
        point:{
            x:currentTank.point.x + currentTank.dimension.width / 2 - settings.WEAPONS_DIMENSION.height / 2,
            y:currentTank.point.y + currentTank.dimension.height / 2 - settings.WEAPONS_DIMENSION.height / 2
        },
        dimension:{
            width:settings.WEAPONS_DIMENSION.height,
            height:settings.WEAPONS_DIMENSION.height
        }
    };
    return DeterminantTankPosition.areObjectsOnSameLine( constVar, enemy, tankWeapon )
           && !DeterminantTankPosition.isBarrierBetween( constVar, battleField, currentTank, enemy );
};

module.exports = Gunner;