var settings   = require( '../../../../GameSettings' );
var Gunner     = require( '../BaseTankAi/Gunner.class' );
var RandomMove = require( '../BaseTankAi/RandomMove.class' );
var Radar      = require( './Radar.class' );
var TankMoving = require( '../../TankMoving.class' );

var CleverAi = function( battleField, indexTankAi )
{
    this.lastRoute   = 'right';
    this.gunner      = new Gunner();
    this.randomMove  = new RandomMove();
    this.indexTankAi = indexTankAi;
    this.battleField = battleField;
    this.radar       = new Radar( battleField, indexTankAi );
};

CleverAi.prototype.doStep = function()
{   
    this._rememberLastRoute();
    this._step();
};

CleverAi.prototype._rememberLastRoute = function()
{
    this.lastRoute = this.battleField.tanks[this.indexTankAi].route;
};

CleverAi.prototype._step = function()
{
    this._updateRadar();

    if ( this._isCaptureFlag( this.battleField.typeOfGame ) )
    {
        this._stepWithinFlagAreaBoundaries();
    }
    else
    {
        this._atackEnemy();
    }
};

CleverAi.prototype._isCaptureFlag = function( typeOfGame )
{
    return ( typeOfGame == settings.GAME_TYPES.FLAG_CAPTURE ) ? this.radar.isCaptureFlag(): false;
};

CleverAi.prototype._atackEnemy = function()
{
    var isFired = this.gunner.atackIfSeeEnemy( this.battleField, this.indexTankAi );
    if ( !isFired )
    {
        this._stepToEnemyOrFlag();
    }
};

CleverAi.prototype._updateRadar = function()
{
    this.radar.updateRadar();
};

CleverAi.prototype._stepWithinFlagAreaBoundaries = function()
{
    var isFired = this.gunner.fireIfSeeEnemy( this.battleField, this.indexTankAi );
    if ( !isFired )
    {
        this._randomMoveWithinFlagAreaBoundaries();
    }

};

CleverAi.prototype._randomMoveWithinFlagAreaBoundaries = function()
{
    var lastPoint = {
        x:this.battleField.tanks[this.indexTankAi].point.x,
        y:this.battleField.tanks[this.indexTankAi].point.y
    };
    this.randomMove.move( this.battleField, this.indexTankAi );
    this._updateRadar();
    while ( !this._isCaptureFlag( this.battleField.typeOfGame ) )
    {
        this.battleField.tanks[this.indexTankAi].point.x = lastPoint.x;
        this.battleField.tanks[this.indexTankAi].point.y = lastPoint.y;
        this.randomMove.move( this.battleField, this.indexTankAi );
        this._updateRadar();
    }
};

CleverAi.prototype._stepToEnemyOrFlag = function()
{
    var route = false;
    if ( this.radar.hasEnemyOrFlag() )
    {
        route = this.radar.getRouteToGoal();
    }
    this._tryToRoute( route )
};

CleverAi.prototype._tryToRoute = function( route )
{
    if ( route && TankMoving.canNextStep( this.battleField, this.battleField.tanks[this.indexTankAi], route) )
    {
        TankMoving.doNextStep( this.battleField, this.battleField.tanks[this.indexTankAi], route)
    }
    else
    {
        this.randomMove.move( this.battleField, this.indexTankAi );
    }
};


module.exports = CleverAi;