var getRandomArbitary = function( min, max ) 
{
    return Math.random() * ( max - min ) + min;
}

var intersectionQuadrate = function( object1, object2 )
{
    var first =
    {
        x:       object1.point.x,
        y:       object1.point.y,
        width:   object1.dimension.width  + object1.point.x,
        height:  object1.dimension.height + object1.point.y
    }

    var second =
    {
        x:       object2.point.x,
        y:       object2.point.y,
        width:   object2.dimension.width  + object2.point.x,
        height:  object2.dimension.height + object2.point.y
    }

    var intersectionProjectionX   = ( ( first.x < second.width  ) && ( first.width  > second.x ) );
    var intersectionProjectionY   = ( ( first.y < second.height ) && ( first.height > second.y ) );

    var isIntersectionSquares = ( intersectionProjectionX && intersectionProjectionY );
    return isIntersectionSquares;
}

function getIsCanNextStep( battleField, id, nextGamerStep )
{   
    var collision = collisionWithWalls( nextGamerStep, battleField );
    if ( collision )
    {
        return false;
    }
    for ( var i = 0; i < battleField.tanks.length; i++ )
    {
        if ( battleField.tanks[i].health > 0 && i != id )
        {
            collision = intersectionQuadrate( nextGamerStep, battleField.tanks[i] );
            if ( collision )
            {
                return false;
            }
        }
    }
    return true;
}

function isOnOneLine( wall, object1, object2 )
{
    var y1 = object1.point.y;
    var y2 = object2.point.y;
    return ( ( wall.y >= y1 ) && ( wall.y <= y2 ) ) ? true : false;
}

function isBarrierBetween( constVar, BattleField, object1, object2 )
{
    var x1 = object1.point.x;
    var y1 = object1.point.y;
    var x2 = object2.point.x;
    var y2 = object2.point.y;
    var h  = BattleField.walls[0][0].dimension.height;
    
    var temp             = null;
    var constantVariable = null;
    var changingVariable = {
       min: null,
       max: null
    };
    if ( constVar == 'constY' )
    {
        constantVariable     = Math.floor( y1 / h );
        changingVariable.min = Math.floor( x1 / h );
        changingVariable.max = Math.floor( x2 / h );
        if ( changingVariable.max < changingVariable.min )
        {
            temp                 = changingVariable.max;
            changingVariable.max = changingVariable.min;
            changingVariable.min = temp;
        }
        for ( var i = changingVariable.min; i < changingVariable.max; i ++ )
        {
            if ( BattleField.walls[constantVariable][i] != 0) 
            {         
                  return true;
            }
        }
    }
    if ( constVar == 'constX' )
    {
        constantVariable     = Math.floor( x1 / h);
        changingVariable.min = Math.floor( y1 / h);
        changingVariable.max = Math.floor( y2 / h);
        if (changingVariable.max < changingVariable.min)
        {
            temp                 = changingVariable.max;
            changingVariable.max = changingVariable.min;
            changingVariable.min = temp;

        }
        for ( i = changingVariable.min; i <= changingVariable.max; i ++ )
        {
            if ( BattleField.walls[i][constantVariable] != 0 )
            {
                return true;
            }
        }

    }
    return false;

}

function isCollision( wall, object )
{
    var result = false;
    if ( wall.type != 0 ) //is`t grass
    {
        var collision = intersectionQuadrate( object, wall );
        if ( collision )
        {
            result = true;
        }
    }
    return result;
}

function collisionWithWalls( object, battleField )
{
    var x         = Math.floor( object.point.x / battleField.walls[0][0].dimension.width  );
    var y         = Math.floor( object.point.y / battleField.walls[0][0].dimension.height );    
    var collision = isCollision( battleField.walls[y][x], object );
    if ( collision )
    {
        return true;
    }
    x++;
    var collision = isCollision( battleField.walls[y][x], object );
    if ( collision )
    {
        return true;
    }
    y++;
    var collision = isCollision( battleField.walls[y][x], object );
    if ( collision )
    {
        return true;
    }
    x--;
    var collision = isCollision( battleField.walls[y][x], object );
    if ( collision )
    {
        return true;
    }
    return false;
}

function isTankTunel( tank, battleField )
{
    var isTunel         = false;
    var upLeftIsWall    = 0;
    var upRightIsWall   = 0;
    var downLeftIsWall  = 0;
    var downRightIsWall = 0;
    var x               = 0;
    var y               = 0;
                                               
    if ( tank.route == 'left' || tank.route == 'right' )
    {
        y = Math.floor( ( tank.point.y - tank.dimension.width ) / battleField.walls[0][0].dimension.width );
        x = Math.floor( tank.point.x / battleField.walls[0][0].dimension.height );

        upLeftIsWall   = ( battleField.walls[y][x]         != 0 ) ? 1 : 0;
        downLeftIsWall = ( battleField.walls[y + 2][x]     != 0 ) ? 1 : 0;
        upRightIsWall  = ( battleField.walls[y][x + 1]     != 0 ) ? 1 : 0;
        upRightIsWall  = ( battleField.walls[y + 2][x + 1] != 0 ) ? 1 : 0;
    }
    else
    {
        x = Math.floor( ( tank.point.x - tank.dimension.width ) / battleField.walls[0][0].dimension.width );
        y = Math.floor( tank.point.y / battleField.walls[0][0].dimension.height );

        upLeftIsWall  = ( battleField.walls[y][x]          != 0 ) ? 1 : 0;
        downLeftIsWall = ( battleField.walls[y][x + 2]     != 0 ) ? 1 : 0;
        upRightIsWall  = ( battleField.walls[y + 1][x]     != 0 ) ? 1 : 0;
        upRightIsWall  = ( battleField.walls[y + 1][x + 2] != 0 ) ? 1 : 0;
    }                                                                                   
    isTunel = ( upLeftIsWall + downLeftIsWall + downRightIsWall + upRightIsWall >= 3 ) ? true : false;
    return isTunel;
}

function getRadar( BattleField, numTankAI )
{
    var radar = new Array();
    var j = 0;
    var y = Math.floor( BattleField.tanks[numTankAI].point.y / BattleField.walls[0][0].dimension.width ) - 4;
    var x = Math.floor( BattleField.tanks[numTankAI].point.x / BattleField.walls[0][0].dimension.height ) - 4;
    var ty = 0;
    var tx = 0;
    var dx = 0;
    var dy = 0;

    for ( var i = 0; i < 9; i++ )
    {
        radar[i] = new Array();
        for ( var j = 0; j < 9; j++ )
        {
            radar[i][j] = 0;
        }
    }
    for ( i = 0; i < 9; i++ )
    {
        for ( j = 0; j < 9; j++ )
        {
            if ( typeof BattleField.walls[i + y] == 'undefined' || BattleField.walls[i + y][j + x] != 0 )
            {
                radar[i][j] = -1;
            }
        }
    }
    x += 4;
    y += 4;
    for ( i = 0; i < BattleField.tanks.length; i++ )
    {
        if ( BattleField.tanks[i].health > 0 )
        {
            ty = Math.floor( BattleField.tanks[i].point.y / BattleField.walls[0][0].dimension.width );
            tx = Math.floor( BattleField.tanks[i].point.x / BattleField.walls[0][0].dimension.height );
            dy = y - ty;
            dx = x - tx;
            if ( ( dx >= -4 && dx <= 4 ) && ( dy >= -4 && dy <= 4 ) )
            {
                if ( BattleField.tanks[i].typeGamer == 'tankAI' && numTankAI != i)
                {
                    radar[4 - dy][4 - dx] = -1;
                }
                else if ( BattleField.tanks[numTankAI].group == BattleField.tanks[i].group )
                {
                    radar[4 - dy][4 - dx] = 1;
                }
                else
                {
                    radar[4 - dy][4 - dx] = -2;
                }
            }
        }        
    }
    return radar;
}
    
module.exports = {
    'getRandomArbitary':    getRandomArbitary,
    'intersectionQuadrate': intersectionQuadrate,
    'getIsCanNextStep':     getIsCanNextStep,
    'collisionWithWalls':   collisionWithWalls,
    'isBarrierBetween':     isBarrierBetween,
    'isTankTunel':          isTankTunel,
    'getRadar':             getRadar
};