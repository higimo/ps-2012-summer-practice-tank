var MathUtils   = require( '../../../common/utils/mathUtils' );

var SimpleAI = function()
{
};

SimpleAI.prototype.doStep = function( BattleField, j )
{
    if ( BattleField.tanks[j].shot.recharge <= 0 )
    {
        turnAndFiring( BattleField, j );
    }
    this.moveRandom( BattleField, j );
}

SimpleAI.prototype.moveRandom = function(BattleField, j)
{
    var randomNumber      = MathUtils.getRandomArbitary( 1, 5);
    var accidentalTurn    = MathUtils.getRandomArbitary( 0, 1)
    var point             = BattleField.getNextGamerStep( j );
    nextGamerStep         = new Tank();
    nextGamerStep.point.x = point.x;
    nextGamerStep.point.y = point.y;    
    var isCanNextStep = MathUtils.getIsCanNextStep( BattleField, j, nextGamerStep ); 
    if ( accidentalTurn < 0.01 && isCanNextStep )
    {
        isCanNextStep = false;  // внесение случайных поворотов
    }
    while ( ! isCanNextStep )
    {
        if ( randomNumber >= 1 && randomNumber < 2 )
        {
            BattleField.tanks[j].route = 'up';
            BattleField.tanks[j].moves = true;
        }
        if ( randomNumber >= 2 && randomNumber < 3 )
        {
            BattleField.tanks[j].route = 'down';
            BattleField.tanks[j].moves = true;
        }
        if ( randomNumber >= 3 && randomNumber < 4 )
        { 
            BattleField.tanks[j].route = 'left';
            BattleField.tanks[j].moves = true;
        }
        if ( randomNumber >= 4 && randomNumber <= 5 )
        { 
            BattleField.tanks[j].route = 'right';
            BattleField.tanks[j].moves = true;
        }
        point                 = BattleField.getNextGamerStep( j );
        nextGamerStep.point.x = point.x;
        nextGamerStep.point.y = point.y; 
        randomNumber          = MathUtils.getRandomArbitary( 1, 5);
        isCanNextStep         = MathUtils.getIsCanNextStep( BattleField, j, nextGamerStep ); 
    }
    BattleField.tanks[j].point.x = nextGamerStep.point.x;
    BattleField.tanks[j].point.y = nextGamerStep.point.y;
    delete nextGamerStep;
}                      

function _turnAndFiring( BattleField, j ) //j - индекс танка с ИИ
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

        var isLife = ( BattleField.tanks[i].typeGamer == 'player' ) && ( BattleField.tanks[i].health > 0 );
        if ( isLife )
        {
            var isCollisionUp = ( y1 < y2 + h2 ) && ( y2 < y1 + h1 ) && ( !MathUtils.isBarrierBetween( 'constY', BattleField, aiTank, BattleField.tanks[i] ) );
            var isCollisionDown = ( x1 < x2 + w2 ) && ( x2 < x1 + w1 ) && ( !MathUtils.isBarrierBetween( 'constX', BattleField, aiTank, BattleField.tanks[i] ) );
            if ( isCollisionUp )
            {
                shot = true;
                if (BattleField.tanks[i].point.x <= aiTank.point.x )
                {
                    aiTank.route = 'left';
                }
                else
                {
                    aiTank.route = 'right';                                   
                }
            }
            else if ( isCollisionDown )
            {
                shot = true;
                if (BattleField.tanks[i].point.y <= aiTank.point.y )
                {
                    aiTank.route = 'up';
                }
                else
                {
                    aiTank.route = 'down';
                }
            }
            if ( shot )
            {
                BattleField.shot( j ); 
            }
        }
    }
}

const  SimpleAIUtils = {   
    'brain': SimpleAI,
    'doStep': SimpleAI.doStep
}

module.exports = SimpleAIUtils;
