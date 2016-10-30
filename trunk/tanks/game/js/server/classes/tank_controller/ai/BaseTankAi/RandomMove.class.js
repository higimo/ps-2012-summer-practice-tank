var MathUtils   = require( '../../../../../common/utils/mathUtils.class' );
var TankMoving  = require( '../../TankMoving.class' );
var settings    = require( '../../../../GameSettings' );
var DeterminantTankPosition = require( '../../../utils/DeterminantTankPosition.class' );

var RandomMove = function()
{
    this.chanceMoveInTunel  = 0.001;
    this.chanceMoveOutTunel = 0.01; 
    this.indexTankAi        = null;
};

RandomMove.prototype.move = function( battleField, indexTankAi )
{  
    this._rememberTankInfo( indexTankAi );
    var currentTank = battleField.tanks[this.indexTankAi];
    
    if ( this._isMustRandomRoute( battleField ) )
    {
        this._doNextStepRandom( battleField, currentTank );
    }
    else
    {
        TankMoving.doNextStep( battleField, currentTank, currentTank.route );
    }
};

RandomMove.prototype._rememberTankInfo = function( indexTankAi )
{
    this.indexTankAi = indexTankAi;
};

RandomMove.prototype._isMustRandomRoute = function( battleField )
{
    var isRandomRoute = this._isRandomRoute( battleField );
    var currentTank = battleField.tanks[this.indexTankAi];
    var canNextStepWithoutRandom = TankMoving.canNextStep( battleField, currentTank, currentTank.route );
    return ( isRandomRoute || !canNextStepWithoutRandom );
};
    
RandomMove.prototype._doNextStepRandom = function( battleField, currentTank )
{
    var canNextStep = false;
    while ( !canNextStep )
    {
        var randomRoute = this._getRandomRoute();
        canNextStep = TankMoving.canNextStep( battleField, currentTank, randomRoute );
    }
    TankMoving.doNextStep( battleField, currentTank, randomRoute );
};

RandomMove.prototype._isRandomRoute = function( battleField )
{
    var chanceTurn = MathUtils.getRandomRealNumber( 0, 1 );
    var isTunel = ( DeterminantTankPosition.isTankTunel( battleField.tanks[this.indexTankAi], battleField ) ); 
    return ( isTunel ) ? chanceTurn < this.chanceMoveInTunel : chanceTurn < this.chanceMoveOutTunel;
};

RandomMove.prototype._getRandomRoute = function()
{    
    var directions = [settings.DIRECTION.UP, settings.DIRECTION.DOWN, settings.DIRECTION.LEFT, settings.DIRECTION.RIGHT];
    var countDirections = directions.length;
    var randomDirectionIndex = MathUtils.getRandomInteger( 0, countDirections - 1 );
    return directions[randomDirectionIndex];
};

module.exports = RandomMove;