var MathUtils   = require( '../../../common/utils/mathUtils' );
var settings  = require( '../../GameSettings' );

var CleverAI = function()
{
    this.lastRoute        = 'right';
    this.canNotRouteTime  = 0;
    this.radar            = [9][9];
    this.isEnemyRadar     = false;
    this.xcoordinateEnemy = 0;
    this.ycoordinateEnemy = 0;
    this.lengthToEnemy    = 0;
    this.routeToEnemy     = 'right';
};

CleverAI.prototype.doStep = function( BattleField, j )
{   
    this.radar = MathUtils.getRadar( BattleField, j );
    this.waveMoveTankAI( BattleField, j );
    this.getTankEnemy();
    if ( BattleField.tanks[j].shot.recharge <= 0 )
    {
        turnAndFiring( BattleField, j );
    }
    if ( this.isEnemyRadar )
    {
        this.getWayToEnemy();
        this.stepToEnemy( BattleField, j );

    }
    else
    {
        this.moveRandom( BattleField, j );
    }
}  

CleverAI.prototype.stepToEnemy = function( BattleField, codeTankAI )
{   
    var x = BattleField.tanks[codeTankAI].point.x;
    var y = BattleField.tanks[codeTankAI].point.y;
    var xDiagonal = x + BattleField.tanks[codeTankAI].dimension.width;
    var yDiagonal = y + BattleField.tanks[codeTankAI].dimension.height;
    var dimensionWall = BattleField.walls[0][0].dimension.width;
    var isAITankInOneCellX = ( Math.floor( x / dimensionWall ) == Math.floor( xDiagonal / dimensionWall ) ) ? true : false;    
    var isAITankInOneCellY = ( Math.floor( y / dimensionWall ) == Math.floor( yDiagonal / dimensionWall ) ) ? true : false;
    var isAITankInOneCell = ( isAITankInOneCellX || isAITankInOneCellY ) ? true : false;

    if ( this.routeToEnemy == 'up' || this.routeToEnemy == 'down' )
    {
        if ( !isAITankInOneCellX )
        {
            BattleField.tanks[codeTankAI].route = 'left';
        }
        else
        {
            BattleField.tanks[codeTankAI].route = this.routeToEnemy;
        }
    }
    else
    {
        if ( !isAITankInOneCellY )
        {
            BattleField.tanks[codeTankAI].route = 'up';
        }
        else
        {
            BattleField.tanks[codeTankAI].route = this.routeToEnemy;
        }
    }
        
    BattleField.tanks[codeTankAI].moves = true;
    var step              = BattleField.getNextGamerStep( codeTankAI );
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
                                         

    var isCanNextStep = MathUtils.getIsCanNextStep( BattleField, codeTankAI, nextGamerStep );
    if ( isCanNextStep )
    {
        var point = BattleField.getNextGamerStep( codeTankAI );    
        BattleField.tanks[codeTankAI].point.x = point.x;
        BattleField.tanks[codeTankAI].point.y = point.y;
    }
    else
    {
        BattleField.tanks[codeTankAI].moves = false;
    } 
}

CleverAI.prototype.getWayToEnemy = function()
{
    var upAI = 0;
    var downAI = 0;
    var leftAI = 0;
    var rightAI = 0;
    var i = this.ycoordinateEnemy;
    var j = this.xcoordinateEnemy;
    
    while ( this.radar[i][j] != 1 )
    {
        upAI = ( i != 0 ) ? this.radar[i - 1][j] : 0;
        downAI = ( i != this.radar.length - 1 ) ? this.radar[i + 1][j] : 0;
        leftAI = ( j != 0 ) ? this.radar[i][j - 1] : 0;
        rightAI = ( j != this.radar.length - 1 ) ? this.radar[i][j + 1] : 0;

        this.routeToEnemy = ( upAI == this.lengthToEnemy ) ? 'up' : this.routeToEnemy;
        this.routeToEnemy = ( downAI == this.lengthToEnemy ) ? 'down' : this.routeToEnemy;
        this.routeToEnemy = ( leftAI == this.lengthToEnemy ) ? 'left' : this.routeToEnemy;
        this.routeToEnemy = ( rightAI == this.lengthToEnemy ) ? 'right' : this.routeToEnemy;
    
        this.radar[i][j] = -3;
        this.lengthToEnemy--;
        switch ( this.routeToEnemy )
        {
            case 'up':
                i -= 1;
                break;
            case 'down':
                i += 1;
                break;
            case 'left':
                j -= 1;
                break;
            case 'right':
                j += 1;
                break;
            default:
                break;
        }
    }

    i = 4;
    j = 4;

    upAI = ( i != 0 ) ? this.radar[i - 1][j] : 0;
    downAI = ( i != this.radar.length - 1 ) ? this.radar[i + 1][j] : 0;
    leftAI = ( j != 0 ) ? this.radar[i][j - 1] : 0;
    rightAI = ( j != this.radar.length - 1 ) ? this.radar[i][j + 1] : 0;

    this.routeToEnemy = ( upAI == -3 ) ? 'up' : this.routeToEnemy;
    this.routeToEnemy = ( downAI == -3 ) ? 'down' : this.routeToEnemy;
    this.routeToEnemy = ( leftAI == -3 ) ? 'left' : this.routeToEnemy;
    this.routeToEnemy = ( rightAI == -3 ) ? 'right' : this.routeToEnemy;  
}

CleverAI.prototype.getTankEnemy = function()
{            
    var upAI = 0;
    var downAI = 0;
    var leftAI = 0;
    var rightAI = 0;
    var minLength = 0;
    var minOneLength = 0;
    var minX = 0;
    var minY = 0;

    for ( var i = 0; i < this.radar.length; i++ )
    {
        for ( var j = 0; j < this.radar.length; j++ )
        {
            if ( this.radar[i][j] == '-2' )
            {
                minOneLength = 0;
                // UP
                upAI = ( i != 0 ) ? this.radar[i - 1][j] : upAI;
                // DOWN                                                                  
                downAI = ( i != this.radar.length - 1 ) ? this.radar[i + 1][j] : downAI;
                // LEFT                                            
                leftAI = ( j != 0 ) ? this.radar[i][j - 1] : leftAI;
                // RIGHT
                rightAI = ( j != this.radar.length - 1 ) ? this.radar[i][j + 1] : rightAI;
                if ( upAI > 0 )
                {
                    minOneLength = upAI;
                }
                if ( downAI > 0 )
                {
                    if ( minOneLength == 0 )
                    {
                        minOneLength = downAI;
                    } else if ( minOneLength > downAI )
                    {
                        minOneLength = downAI;
                    }
                }
                if ( leftAI > 0 )
                {
                    if ( minOneLength == 0 )
                    {
                        minOneLength = leftAI;
                    } else if ( minOneLength > leftAI )
                    {
                        minOneLength = leftAI;
                    }
                }
                if ( rightAI > 0 )
                {
                    if ( minOneLength == 0 )
                    {
                        minOneLength = rightAI;
                    } else if ( minOneLength > rightAI )
                    {
                        minOneLength = rightAI;
                    }
                }
            }
            if ( minLength == 0 )
            {
                minLength = minOneLength;
                this.xcoordinateEnemy = j;
                this.ycoordinateEnemy = i;
                this.lengthToEnemy = minLength;
            } else if ( minLength > minOneLength )
            {
                minLength = minOneLength;
                this.xcoordinateEnemy = j;
                this.ycoordinateEnemy = i;
                this.lengthToEnemy = minLength;
            } 
        }
    }
    this.isEnemyRadar = ( minLength == 0 ) ? false : true;  
}

CleverAI.prototype.waveMoveTankAI = function( BattleField, codeTankAI )
{
    var square   = 0;
    var upAI     = 0;
    var downAI   = 0;
    var leftAI   = 0;
    var rightAI  = 0;
    var isStepAI = false;
    for ( var k = 0; k < 30; k++ )
    {    
        for ( var i = 0; i < this.radar.length; i++ )
        {
            for ( var j = 0; j < this.radar[i].length; j++ )
            {
                square = this.radar[i][j];
                isStepAI = ( square > 0 ) ? true : false;
                if ( isStepAI )     
                {
                    if ( i + 1 != this.radar.length )
                    {
                        upAI = this.radar[i + 1][j];
                        if ( upAI == 0 )
                        {
                            this.radar[i + 1][j] = square + 1;
                        }
                    }
                    if ( i != 0 )
                    {
                        downAI = this.radar[i - 1][j];
                        if ( downAI == 0 )
                        {
                            this.radar[i - 1][j] = square + 1;
                        }
                    }
                    if ( j + 1 != this.radar.length )
                    {
                        rightAI = this.radar[i][j + 1];
                        if ( rightAI == 0 )
                        {
                            this.radar[i][j + 1] = square + 1;
                        }
                    }
                    if ( j != 0 )
                    {
                        leftAI = this.radar[i][j - 1];
                        if ( leftAI == 0 )
                        {
                            this.radar[i][j - 1] = square + 1;
                        }

                    }                                         
                }
            }
        }
    }
}

CleverAI.prototype.moveRandom = function(BattleField, j)
{             
    var chanceTurn        = MathUtils.getRandomArbitary( 0, 1)
    var isTurn            = false;
    var isNotTunel        = true;
    var copyLastRoute     = BattleField.tanks[j].route;
    var point = BattleField.getNextGamerStep( j ); // get next coordination
    var nextGamerStep = {
        point : { 
            x : point.x,
            y : point.y
        },
        dimension : {
            width  : settings.TANK_SIZE,
            height : settings.TANK_SIZE
        },
        route : BattleField.tanks[j].route
    };
    var isCanNextStep     = MathUtils.getIsCanNextStep( BattleField, j, nextGamerStep ); 
    isNotTunel = ( ! MathUtils.isTankTunel( BattleField.tanks[j], BattleField ) ); 
    if ( isNotTunel )
    {
        isTurn = chanceTurn < 0.01;     
    }
    else
    {
        isTurn = chanceTurn < 0.001;
    }
    if ( isTurn && this.canNotRouteTime <= 0)
    {
        if ( isNotTunel )
        {
            isCanNextStep = false;
        }
        else
        {
            BattleField.tanks[j].route = contrastRoute( BattleField.tanks[j].route );
        }
    } 
    calculateNextGame( isCanNextStep, BattleField, nextGamerStep, point, j );

    if ( BattleField.tanks[j].moves && this.canNotRouteTime <= 0)
    {
        BattleField.tanks[j].point.x = nextGamerStep.point.x;
        BattleField.tanks[j].point.y = nextGamerStep.point.y;
    } 
    this.lastRoute = copyLastRoute;
    if ( copyLastRoute != BattleField.tanks[j].route )
    {   
        this.canNotRouteTime = 15;
    }   
    if ( this.canNotRouteTime > 0 )
    {
        this.canNotRouteTime--;
    }
}

function calculateNextGame( isCanNextStep, BattleField, nextGamerStep, point, j )
{   
    var countNotRoute     = 12;

    while ( ! isCanNextStep )
    {
        BattleField.tanks[j].route = getRoute();
        BattleField.tanks[j].moves = true;

        point                 = BattleField.getNextGamerStep( j );
        nextGamerStep.point.x = point.x;
        nextGamerStep.point.y = point.y;                           
        nextGamerStep.route   = BattleField.tanks[j].route;
        isCanNextStep         = MathUtils.getIsCanNextStep( BattleField, j, nextGamerStep );

        if ( nextGamerStep.route == contrastRoute( this.lastRoute ) && countNotRoute > 0 )
        {
            isCanNextStep = false;
            countNotRoute--;
        }
    }
}

function contrastRoute( route )
{
    var cRoute = 'up';

    switch ( route )
    {
        case 'up':
            cRoute = 'down';
            break;
        case 'down':
            cRoute = 'up';
            break;
        case 'left':
            cRoute = 'right';
            break;
        case 'right':
            cRoute = 'left';
            break;
        default:
           break;
    }
    return cRoute;
}

function getRoute()
{
    var getRandomRoute    = MathUtils.getRandomArbitary( 1, 5);
    var isMoveUp          = false;
    var isMoveDown        = false;
    var isMoveLeft        = false;
    var isMoveRight       = false;
    var route             = 'up';

    isMoveUp = ( getRandomRoute >= 1 && getRandomRoute < 2 ); 
    isMoveDown = ( getRandomRoute >= 2 && getRandomRoute < 3 );
    isMoveLeft = ( getRandomRoute >= 3 && getRandomRoute < 4 );
    isMoveRight = ( getRandomRoute >= 4 && getRandomRoute <= 5 );
    if ( isMoveUp )
    {
        route = 'up';
    }
    if ( isMoveDown )
    {
        route = 'down';  
    }
    if ( isMoveLeft )
    { 
        route = 'left';
    }
    if ( isMoveRight )
    { 
        route = 'right';          
    }
    return route;
}
                      
function turnAndFiring( BattleField, j ) //j - индекс танка с ИИ
{
    var aiTank = BattleField.tanks[j];
    var x1     = aiTank.point.x;
    var y1     = aiTank.point.y;
    var w1     = aiTank.dimension.width;
    var h1     = aiTank.dimension.height;
    var shot   = false;
    for ( var i = 0; i <= BattleField.tanks.length - 1; i++ )
    {
        shot   = false; 
        var x2 = BattleField.tanks[i].point.x;
        var y2 = BattleField.tanks[i].point.y;
        var w2 = BattleField.tanks[i].dimension.width;
        var h2 = BattleField.tanks[i].dimension.height;

        var isLife = ( BattleField.tanks[i].group != BattleField.tanks[j].group ) && ( BattleField.tanks[i].health > 0 );
        if ( isLife )
        {
            var isCollisionUp = ( y1 < y2 + h2 ) && ( y2 < y1 + h1 ) && ( !MathUtils.isBarrierBetween( 'constY', BattleField, aiTank, BattleField.tanks[i] ) );
            var isCollisionDown = ( x1 < x2 + w2 ) && ( x2 < x1 + w1 ) && ( !MathUtils.isBarrierBetween( 'constX', BattleField, aiTank, BattleField.tanks[i] ) );
            if ( isCollisionUp )
            {
                shot = true;
                if ( BattleField.tanks[i].point.x <= aiTank.point.x && this.canNotRouteTime <= 0 )
                {
                    aiTank.route = 'left';
                    this.canNotRouteTime = 15;
                }
                else if (this.canNotRouteTime <= 0 )
                {
                    aiTank.route = 'right';                         
                    this.canNotRouteTime = 15;          
                }
            }
            else if ( isCollisionDown )
            {
                shot = true;
                if (BattleField.tanks[i].point.y <= aiTank.point.y && this.canNotRouteTime <= 0 )
                {
                    aiTank.route = 'up';
                    this.canNotRouteTime = 15;
                }
                else if ( this.canNotRouteTime <= 0 )
                {
                    aiTank.route = 'down';
                    this.canNotRouteTime = 15;
                }
            }
            if ( shot )
            {
                BattleField.shot( j ); 
            }
        }
    }
    if ( this.canNotRouteTime > 0 )
    {
        this.canNotRouteTime--;
    }
}

const  CleverAIUtils = {
    'brain': CleverAI,
    'doStep': CleverAI.doStep
}

module.exports = CleverAIUtils;