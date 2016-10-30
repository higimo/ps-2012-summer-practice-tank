var settings   = require( '../GameSettings' );
var MathUtils  = require( '../../common/utils/mathUtils.class' );

var RocketController = function() {};

RocketController.prototype.updateRockets = function( battleField )
{
    for ( var i = 0; i < battleField.weapons.length; ++i )
    {
        if ( battleField.weapons[i].damage > 0 )
        {
            this._updateRocket( i, battleField );
        }
    }
};

RocketController.prototype._updateRocket = function( i, battleField )
{
    var fire = battleField.weapons[i].fire;
    var randomNumber = MathUtils.getRandomRealNumber( 6, 15 ); //TODO: Why 6 & 15?
    switch( battleField.weapons[i].route )
    {
        case settings.DIRECTION.UP:
            battleField.weapons[i].point.y -= battleField.weapons[i].speed;
            fire.point.y -= fire.speed;
            fire.dimension.height = randomNumber;
            break;
        case settings.DIRECTION.DOWN:
            battleField.weapons[i].point.y += battleField.weapons[i].speed;
            fire.point.y += fire.speed;
            fire.dimension.height = randomNumber;
            break;
        case settings.DIRECTION.LEFT:
            battleField.weapons[i].point.x -= battleField.weapons[i].speed;
            fire.point.x -= fire.speed;
            fire.dimension.width = randomNumber;
            break;
        case settings.DIRECTION.RIGHT:
            battleField.weapons[i].point.x += battleField.weapons[i].speed;
            fire.point.x += fire.speed;
            fire.dimension.width = randomNumber;
            break;
    }
};

module.exports = new RocketController();