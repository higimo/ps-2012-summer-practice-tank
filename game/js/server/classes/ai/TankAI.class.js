var settings   = require( '../../GameSettings' );
var MathUtils   = require( '../../../common/utils/mathUtils' );
var cleverAI = require( './CleverAI.class' );
var simpleAI = require( './SimpleAI.class' ); 

if (settings.TYPE_AI == 'clever')
{
	var ai = new cleverAI.brain();
}
else
{
	var ai = new simpleAI.brain();	
}

function doStep( BattleField, j )
{
    if ( BattleField.tanks[j].health > 0 )
    {
        ai.doStep( BattleField, j );
    }
}

var  simpleAiUtils = {
    'doStep': doStep
}

module.exports = simpleAiUtils;