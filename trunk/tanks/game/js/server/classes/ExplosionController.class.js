var settings   = require( '../GameSettings' );
var Explosion  = require( './Explosion.class' );

var ExplosionController = function() {};

ExplosionController.prototype.updateExplosion = function( battleField )
{
    for ( var i = 0; i < battleField.explosion.length; i++ )
    {
        if ( battleField.explosion[i].timeLife > 0 )
        {
            battleField.explosion[i].timeLife -= settings.GAME_INTERVAL;

            if ( battleField.explosion[i].type == settings.TANK )
            {
                this._changeExplosionSize( battleField.explosion[i], 50,   100, 50 );
                this._changeExplosionSize( battleField.explosion[i], 100,  150, 35 );
                this._changeExplosionSize( battleField.explosion[i], 150,  200, 25 );
                this._changeExplosionSize( battleField.explosion[i], 200,  250, 15 );
                this._changeExplosionSize( battleField.explosion[i], 250,  300, 10 );
            }
            if ( battleField.explosion[i].type == settings.ROCKET )
            {
                this._changeExplosionSize( battleField.explosion[i], 0,   30,  30 );
                this._changeExplosionSize( battleField.explosion[i], 30,  60,  25 );
                this._changeExplosionSize( battleField.explosion[i], 60,  90,  15 );
                this._changeExplosionSize( battleField.explosion[i], 90,  120, 10 );
                this._changeExplosionSize( battleField.explosion[i], 120, 150, 5 );
            }
        }
    }
};

ExplosionController.prototype.explodeTank = function( tank, battleField )
{
    this._effectExplosion( tank, settings.MAX_EXPLOSION, settings.MAX_EXPLOSION, settings.TANK, battleField );
};

ExplosionController.prototype.explodeRocket = function( rocket, battleField )
{
    this._effectExplosion( rocket, settings.MIN_EXPLOSION, settings.MIN_EXPLOSION, settings.ROCKET, battleField );
};

ExplosionController.prototype._changeExplosionSize = function( explosion, minTime, maxTime, dimension )
{
    if ( ( explosion.timeLife > minTime ) && ( explosion.timeLife < maxTime ) )
    {
        explosion.dimension.width  = dimension;
        explosion.dimension.height = dimension;
    }
};

ExplosionController.prototype._effectExplosion = function( weapons, width, height, type, battleField )
{
        var index = this._getFreeExplosionIndex( battleField );
        if ( battleField.explosion[index] )
        {
            delete battleField.explosion[index];
        }
        battleField.explosion[index] = new Explosion();

        if ( type != settings.ROCKET )
        {
            battleField.explosion[index].type = settings.TANK;
            battleField.explosion[index].timeLife = settings.TIME_LIFE_EXPLOSION;
        }

        battleField.explosion[index].dimension.width  = width;
        battleField.explosion[index].dimension.height = height;
        battleField.explosion[index].point.x = weapons.point.x + ( weapons.dimension.width  / 2 );
        battleField.explosion[index].point.y = weapons.point.y + ( weapons.dimension.height / 2 );
};

ExplosionController.prototype._getFreeExplosionIndex = function( battleField )
{
    var freeExplosionIndex = battleField.explosion.length;
    for ( var i = 0; i < freeExplosionIndex; ++i )
    {
        if ( battleField.explosion[i].timeLife <= 0 )
        {
            freeExplosionIndex = i;
            break;
        }
    }
    return freeExplosionIndex;
};

module.exports = new ExplosionController();