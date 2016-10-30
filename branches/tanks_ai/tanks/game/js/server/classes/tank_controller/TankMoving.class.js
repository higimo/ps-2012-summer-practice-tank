var CollisionsDeterminant = require( '../utils/CollisionsDeterminant.class' );
var settings   = require( '../../GameSettings' );

var TankMoving = function()
{
    this.lastRoute = null;
    this.lastPoint = {
        x: 0,
        y: 0
    };
};

TankMoving.prototype.doNextStep = function( battleField, currentTank, route )
{
    if ( this.canNextStep(battleField, currentTank, route) )
    {
        this._changeTankPositionByNext( currentTank, route );
        currentTank.directInBottleneck.isBottleneck = false;
    }
    else
    {
        var isCollisionWithTanks = false;
        this._rememberTankPosition( currentTank );
        this._changeTankPositionByNext( currentTank, route );
        isCollisionWithTanks = CollisionsDeterminant.isCollisionWithTanks( currentTank, battleField.tanks );
        this._returnLastPosition( currentTank );
        
        if ( !isCollisionWithTanks )
        {
            this.stepToBottleneck( currentTank, route, battleField );
        }
    }
};

TankMoving.prototype.stepToBottleneck = function( currentTank, route, battleField )
{
    var bottleneck = this.goToBottleneck( currentTank, route, battleField.walls );
    if ( bottleneck.goToBottleneck )
    {
        if ( this.canNextStep(battleField, currentTank, bottleneck.route) )
        {
            var copyRoute = route;
            this._changeTankPositionByNext( currentTank, bottleneck.route );
            currentTank.directInBottleneck.isBottleneck = true;
            currentTank.directInBottleneck.route = bottleneck.route;
            currentTank.route = copyRoute;
        }
    }
}

TankMoving.prototype.goToBottleneck = function( currentTank, route, walls )
{
    var goToBottleneck = CollisionsDeterminant.isGoToBottleneck( currentTank, route, walls );
    return goToBottleneck;
}

TankMoving.prototype.canNextStep = function( battleField, currentTank, route )
{ 
    this._rememberTankPosition( currentTank );
    
    this._changeTankPositionByNext( currentTank, route ); 
    var canNextStep = !CollisionsDeterminant.isCollisionWithObjects( battleField, currentTank );
    
    this._returnLastPosition( currentTank );
    
    return canNextStep;
};


TankMoving.prototype.route = function( currentTank, route )
{
    currentTank.route = route;
};

TankMoving.prototype._changeTankPositionByNext = function( currentTank, route )
{
    currentTank.route = route;
    currentTank.point = this._getNextTankPoint( currentTank );
};

TankMoving.prototype._rememberTankPosition = function( currentTank )
{
    this.lastRoute = currentTank.route;
    this.lastPoint.x = currentTank.point.x;
    this.lastPoint.y = currentTank.point.y;
};

TankMoving.prototype._returnLastPosition = function( currentTank )
{
    currentTank.route = this.lastRoute;
    currentTank.point.x = this.lastPoint.x;
    currentTank.point.y = this.lastPoint.y;
};

TankMoving.prototype._getNextTankPoint = function( currentTank )
{
    var valueX = currentTank.point.x,
        valueY = currentTank.point.y;
    
    switch( currentTank.route )
    {
        case settings.DIRECTION.UP:
            valueY -= settings.TANK_SPEED;
            break;
        case settings.DIRECTION.DOWN:                                                       
            valueY += settings.TANK_SPEED;
            break;
        case settings.DIRECTION.LEFT:
            valueX -= settings.TANK_SPEED;
            break;
        case settings.DIRECTION.RIGHT:
            valueX += settings.TANK_SPEED;
            break;
        default:
            break;
    }
    return { x: valueX,
             y: valueY };
};

module.exports = new TankMoving();