var settings = require( '../../GameSettings' );

var DeterminantTankPosition = function() {};

DeterminantTankPosition.prototype.isBarrierBetween = function( constVar, battleField, object1, object2 )
{
    var isBarrierBetweenConstX = this._isBarrierBetweenConstX( battleField, object1, object2 );
    var isBarrierBetweenConstY = this._isBarrierBetweenConstY( battleField, object1, object2 );
    return ( constVar == 'constX' ) ? isBarrierBetweenConstX: isBarrierBetweenConstY;
};

DeterminantTankPosition.prototype.isTankTunel = function( tank, battleField )
{
    var coordinateY = Math.floor( ( tank.point.y - tank.dimension.width ) / settings.MAP_PARAMS.CELL_WIDTH );
    var coordinateX = Math.floor(tank.point.x / settings.MAP_PARAMS.CELL_HEIGHT);

    return this._isHorizontalTunel( coordinateX, coordinateY, battleField )
        || this._isVerticalTunel( coordinateX, coordinateY, battleField );
};

DeterminantTankPosition.prototype.areObjectsOnSameLine = function( constVar, object1, object2 )
{
    var areObjectsOnSameLineX = ( object1.point.x < object2.point.x + object2.dimension.width ) && ( object2.point.x < object1.point.x + object1.dimension.width );
    var areObjectsOnSameLineY = ( object1.point.y < object2.point.y + object2.dimension.height ) && ( object2.point.y < object1.point.y + object1.dimension.height );
    return ( constVar == 'constX' )? areObjectsOnSameLineX: areObjectsOnSameLineY;
};

DeterminantTankPosition.prototype.isTankLocatedBetweenTanks = function( constVar, tanks, tank1, tank2 )
{
    var isTankBetween = false;
    for ( var i = 0; i < tanks.length && !isTankBetween; i++)
    {
        isTankBetween = this._isThisTankLocatedBetweenTanks( constVar, tanks[i], tank1, tank2 );
    }
    return isTankBetween;
};

DeterminantTankPosition.prototype._isThisTankLocatedBetweenTanks = function( constVar, tankBarrier, tank1, tank2 )
{
    var isThreeTankOnSameLine = ( constVar == 'constX' ) ? this.areObjectsOnSameLine( 'constX', tankBarrier, tank1 ): this.areObjectsOnSameLine( 'constY', tankBarrier, tank1 );
    var isTankBetweenOnLine = ( constVar == 'constX' ) ? this._isTankBetweenOnLineX( tankBarrier, tank1, tank2 ): this._isTankBetweenOnLineY( tankBarrier, tank1, tank2 );
    return isThreeTankOnSameLine && isTankBetweenOnLine;
};

DeterminantTankPosition.prototype._isTankBetweenOnLineX = function( tankBarrier, tank1, tank2 )
{
    return tankBarrier.point.y > tank1.point.y && tankBarrier.point.y < tank2.point.y
           || tankBarrier.point.y > tank2.point.y && tankBarrier.point.y < tank1.point.y;
};

DeterminantTankPosition.prototype._isTankBetweenOnLineY = function( tankBarrier, tank1, tank2 )
{
    return tankBarrier.point.x > tank1.point.x && tankBarrier.point.x < tank2.point.x
        || tankBarrier.point.x > tank2.point.x && tankBarrier.point.x < tank1.point.x;
};

DeterminantTankPosition.prototype._isBarrierBetweenConstY = function( battleField, object1, object2 )
{
    var h  = settings.MAP_PARAMS.CELL_HEIGHT;
    var constantVariableForLeftCorner = Math.floor( object1.point.y / h );
    var changingVariable = {
        min:Math.floor(object1.point.x / h),
        max:Math.floor(object2.point.x / h)
    };
    this._sortMinMaxVariable( changingVariable );

    var isBarrier = this._isWallsBetweenQuadrate( 'constY', battleField, changingVariable, constantVariableForLeftCorner);

    var constantVariableForRightCorner = Math.floor( (object1.point.y+object1.dimension.height) / h );
    if ( !isBarrier && constantVariableForLeftCorner != constantVariableForRightCorner )
    {
        isBarrier = this._isWallsBetweenQuadrate( 'constY', battleField, changingVariable, constantVariableForRightCorner);
    }

    return isBarrier;
};

DeterminantTankPosition.prototype._isBarrierBetweenConstX = function( battleField, object1, object2 )
{
    var h  = settings.MAP_PARAMS.CELL_HEIGHT;
    var constantVariableForLeftCorner = Math.floor( object1.point.x / h );
    var changingVariable = {
        min: Math.floor(object1.point.y / h),
        max: Math.floor(object2.point.y / h)
    };
    this._sortMinMaxVariable( changingVariable );

    var isBarrier = this._isWallsBetweenQuadrate( 'constX', battleField, changingVariable, constantVariableForLeftCorner);

    var constantVariableForRightCorner = Math.floor( (object1.point.y+object1.dimension.height) / h );
    if ( !isBarrier && constantVariableForLeftCorner != constantVariableForRightCorner )
    {
        isBarrier = this._isWallsBetweenQuadrate( 'constX', battleField, changingVariable, constantVariableForRightCorner);
    }

    return isBarrier;
};

DeterminantTankPosition.prototype._isWallsBetweenQuadrate = function( constVar, battleField, changingVariable, constantVariable )
{
    for ( var i = changingVariable.min; i <= changingVariable.max; i++ )
    {
        var x = constVar == 'constX' ? i: constantVariable;
        var y = constVar == 'constX' ? constantVariable: i;
        if ( this._isUnitIsWall( battleField.walls, x, y ) )
        {
            return true;
        }
    }
};



DeterminantTankPosition.prototype._sortMinMaxVariable = function( changingVariable )
{
    var temp;
    if ( changingVariable.max < changingVariable.min )
    {
        temp                 = changingVariable.max;
        changingVariable.max = changingVariable.min;
        changingVariable.min = temp;
    }
};

DeterminantTankPosition.prototype._isHorizontalTunel = function( coordinateX, coordinateY, battleField )
{
    var upLeftIsWall    = this._isUnitIsWall( battleField.walls, coordinateY, coordinateX );
    var downLeftIsWall  = this._isUnitIsWall( battleField.walls, coordinateY+2, coordinateX );
    var downRightIsWall = this._isUnitIsWall( battleField.walls, coordinateY, coordinateX+1 );
    var upRightIsWall   = this._isUnitIsWall( battleField.walls, coordinateY+2, coordinateX+1 ); 
    return upLeftIsWall && downLeftIsWall && downRightIsWall && upRightIsWall;
};

DeterminantTankPosition.prototype._isVerticalTunel = function( coordinateX, coordinateY, battleField )
{
    var upLeftIsWall    = this._isUnitIsWall( battleField.walls, coordinateY, coordinateX );
    var downLeftIsWall  = this._isUnitIsWall( battleField.walls, coordinateY, coordinateX + 2 );
    var downRightIsWall = this._isUnitIsWall( battleField.walls, coordinateY+1, coordinateX );
    var upRightIsWall   = this._isUnitIsWall( battleField.walls, coordinateY+1, coordinateX+2 ); 
    return upLeftIsWall && downLeftIsWall && downRightIsWall && upRightIsWall;
};

DeterminantTankPosition.prototype._isUnitIsWall = function( walls, coordinateX, coordinateY )
{
    var isNotOutOfBounds = coordinateX >= 0 && coordinateX < walls.length && coordinateY >= 0 && coordinateY < walls[0].length;
    if ( isNotOutOfBounds )
    {
        return !walls[coordinateX][coordinateY].isGrass();
    }
    return false;
};

module.exports = new DeterminantTankPosition();