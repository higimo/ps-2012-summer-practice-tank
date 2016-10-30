var settings = require( '../../../GameSettings' );
var CleverAi = require( './CleverAi/CleverAi.class' );
var SimpleAi = require( './SimpleAi/SimpleAi.class' );

var TankAi = function( battleField, indexTankAi )
{
    this.ai = ( settings.TYPE_AI == 'simple' ) ?  new SimpleAi( battleField, indexTankAi ) : new CleverAi( battleField, indexTankAi ) ;
};

TankAi.prototype.doStep = function()
{
     this.ai.doStep();
};

module.exports = TankAi;
