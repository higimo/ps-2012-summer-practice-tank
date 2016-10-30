var CollisionsDeterminant = function() {};

CollisionsDeterminant.prototype.isCollisionWithObjects = function ( battleField, currentTank )
{
    return ( this.isCollisionWithWalls( currentTank, battleField.walls ) 
            || this.isCollisionWithTanks( currentTank, battleField.tanks ) );
};

CollisionsDeterminant.prototype.isCollisionWithWalls = function( object, walls )
{
    for (var i = 0; i < walls.length; i++)
    {
        for (var j = 0; j < walls[i].length; j++)
        {
            if ( !walls[i][j].isGrass() && this.intersectionQuadrate( walls[i][j] , object ) )
            {
                return true;
            }
        }
    }
    return false;
};

CollisionsDeterminant.prototype.isCollisionWithTanks = function( object, tanks )
{
    for ( var i = 0; i < tanks.length; i++ )
    {
        if ( tanks[i].health > 0 && tanks[i] != object && this.intersectionQuadrate( object, tanks[i] ))
        {
            return true;
        }
    }
    return false;
};

CollisionsDeterminant.prototype.getTankCollidedWithObject = function( object, tanks )
{
    for ( var i = 0; i < tanks.length; i++ )
    {
        if ( tanks[i].health > 0 && this.intersectionQuadrate( object, tanks[i] ) )
        {
            return i;
        }
    }
    return false;
};

CollisionsDeterminant.prototype.intersectionQuadrate = function( object1, object2 )
{
    var first = {
        beginX:object1.point.x,
        beginY:object1.point.y,
        endX:object1.dimension.width + object1.point.x,
        endY:object1.dimension.height + object1.point.y
    };

    var second = {
        beginX:object2.point.x,
        beginY:object2.point.y,
        endX:object2.dimension.width + object2.point.x,
        endY:object2.dimension.height + object2.point.y
    };

    var intersectionProjectionX   = ( ( first.beginX < second.endX  ) && ( first.endX  > second.beginX ) );
    var intersectionProjectionY   = ( ( first.beginY < second.endY ) && ( first.endY > second.beginY ) );

    return intersectionProjectionX && intersectionProjectionY;
};

CollisionsDeterminant.prototype.isGoToBottleneck = function( currentTank, route, walls )
{
    var isGoToBottleneck = false;
    var newRoute = '';
    var halfDimensionTank = settings.TANK_SIZE / 2;
    var cellSize = settings.MAP_PARAMS.CELL_WIDTH;
    
    if (route == settings.DIRECTION.UP || route == settings.DIRECTION.DOWN)
    {
        var rightX = Math.round( (currentTank.point.x + halfDimensionTank) / cellSize );
        var leftX = Math.round( (currentTank.point.x - halfDimensionTank) / cellSize );
        var y = (route == settings.DIRECTION.UP) ? Math.round( (currentTank.point.y - settings.TANK_SIZE) / cellSize ) :
            Math.round( (currentTank.point.y + settings.TANK_SIZE) / cellSize );        
        if (walls[y][rightX].type == 0 || walls[y][leftX].type == 0)
        {
            newRoute = (walls[y][rightX].type == 0) ? settings.DIRECTION.RIGHT : settings.DIRECTION.LEFT;
            isGoToBottleneck = true;
        }
    } else
    if (route == settings.DIRECTION.LEFT || route == settings.DIRECTION.RIGHT)
    {
        var upY = Math.round( (currentTank.point.y - halfDimensionTank) / cellSize );
        var downY = Math.round( (currentTank.point.y + halfDimensionTank) / cellSize );
        var x = ( route == settings.DIRECTION.LEFT ) ? Math.round( (currentTank.point.x - settings.TANK_SIZE) / cellSize ) :
            Math.round( (currentTank.point.x + settings.TANK_SIZE) / cellSize );
        if (walls[upY][x].type == 0 || walls[downY][x].type == 0)
        {
            newRoute = (walls[downY][x].type == 0) ? settings.DIRECTION.DOWN : settings.DIRECTION.UP;
            isGoToBottleneck = true;
        }
    }
    return { goToBottleneck: isGoToBottleneck, route: newRoute };
}

module.exports = new CollisionsDeterminant();

