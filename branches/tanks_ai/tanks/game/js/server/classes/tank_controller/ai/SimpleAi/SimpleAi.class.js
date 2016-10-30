var Gunner = require( '../BaseTankAi/Gunner.class' );
var RandomMove = require( '../BaseTankAi/RandomMove.class' );

var SimpleAi = function( battleField, indexTankAi )
{
    this.gunner      = new Gunner();
    this.randomMove  = new RandomMove();
    this.battleField = battleField;
    this.indexTankAi = indexTankAi;
};

SimpleAi.prototype.doStep = function()
{
    var isFired = this.gunner.attackIfSeeEnemy( this.battleField, this.indexTankAi );
    if ( !isFired )
    {
        this.randomMove.move( this.battleField, this.indexTankAi );
    }
};

module.exports = SimpleAi;
