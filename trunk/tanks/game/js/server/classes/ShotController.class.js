var Rocket     = require( './Weapon.class' );
var Flame      = require( './Flame.class' );
var settings   = require( '../GameSettings' );

var ShotController = function() {};

ShotController.prototype.updateShots = function( battleField )
{
    for ( var i = 0; i < battleField.tanks.length; ++i )
    {
        var needMakeShot = battleField.tanks[i].health > 0 && battleField.tanks[i].attack && battleField.tanks[i].shot.recharge <= 0;
        if ( needMakeShot )
        {
            this.makeShot( i, battleField );
        }
    }
};

ShotController.prototype.makeShot = function( id, battleField )
{
    var freeWeaponIndex = this._getFreeWeaponIndex( battleField );
    this._checkAndDeleteWeapon( freeWeaponIndex, battleField );
    this._createWeapon( freeWeaponIndex, id, battleField );

    switch( battleField.weapons[freeWeaponIndex].route )
    {
        case settings.DIRECTION.UP:
            this._shotRouteUpOrDown( id, freeWeaponIndex, -1, 1, settings.DIRECTION.UP, battleField );
            break;
        case settings.DIRECTION.DOWN:
            this._shotRouteUpOrDown( id, freeWeaponIndex, 1, -1, settings.DIRECTION.DOWN, battleField );
            break;
        case settings.DIRECTION.LEFT:
            this._shotRouteLeftOrRight( id, freeWeaponIndex, -1, 1, settings.DIRECTION.LEFT, battleField );
            break;
        case settings.DIRECTION.RIGHT:
            this._shotRouteLeftOrRight( id, freeWeaponIndex, 1, -1, settings.DIRECTION.RIGHT, battleField );
            break;
    }
    battleField.tanks[id].shot.recharge = battleField.tanks[id].shot.speed;
    battleField.weapons[freeWeaponIndex].tankId = id;
};

ShotController.prototype._checkAndDeleteWeapon = function( freeWeaponIndex, battleField )
{
    if ( battleField.weapons[freeWeaponIndex] )
    {
        delete battleField.weapons[freeWeaponIndex].fire;
        delete battleField.weapons[freeWeaponIndex];
    }
};

ShotController.prototype._createWeapon = function( freeWeaponIndex, id, battleField )
{
    battleField.weapons[freeWeaponIndex]       = new Rocket();
    battleField.weapons[freeWeaponIndex].route = battleField.tanks[id].route;
    battleField.weapons[freeWeaponIndex].fire  = new Flame();
};

ShotController.prototype._shotRouteUpOrDown = function( id, freeIndex, dirY, spaceIndex, direction, battleField )
{
    battleField.weapons[freeIndex].point.x = battleField.tanks[id].point.x + ( ( battleField.tanks[id].dimension.width - battleField.weapons[freeIndex].dimension.height ) / 2 );
    var width = ( direction == settings.DIRECTION.UP ) ? battleField.weapons[freeIndex].dimension.width : battleField.tanks[id].dimension.width;
    battleField.weapons[freeIndex].point.y = battleField.tanks[id].point.y + dirY * width;
    var tempWidth = battleField.weapons[freeIndex].dimension.width;
    battleField.weapons[freeIndex].dimension.width  = battleField.weapons[freeIndex].dimension.height;
    battleField.weapons[freeIndex].dimension.height = tempWidth;
    tempWidth = battleField.weapons[freeIndex].fire.dimension.width;
    battleField.weapons[freeIndex].fire.dimension.width = battleField.weapons[freeIndex].fire.dimension.height;
    battleField.weapons[freeIndex].fire.dimension.height = tempWidth;
    battleField.weapons[freeIndex].fire.point.x = battleField.weapons[freeIndex].point.x;
    var height = ( direction == settings.DIRECTION.UP ) ? battleField.weapons[freeIndex].dimension.height : battleField.weapons[freeIndex].fire.dimension.height;
    battleField.weapons[freeIndex].fire.point.y = battleField.weapons[freeIndex].point.y + spaceIndex * height + spaceIndex * settings.EMPTY_SPACE;
    battleField.weapons[freeIndex].fire.speed = battleField.weapons[freeIndex].speed;
};

ShotController.prototype._shotRouteLeftOrRight = function( id, freeIndex, dirX, spaceIndex, direction, battleField )
{
    var width = ( direction == settings.DIRECTION.LEFT ) ? battleField.weapons[freeIndex].dimension.width : battleField.tanks[id].dimension.width;
    battleField.weapons[freeIndex].point.x = battleField.tanks[id].point.x + dirX * width;
    battleField.weapons[freeIndex].point.y = battleField.tanks[id].point.y + ( ( battleField.tanks[id].dimension.width - battleField.weapons[freeIndex].dimension.height ) / 2 );
    width = ( direction == settings.DIRECTION.LEFT ) ? battleField.weapons[freeIndex].dimension.width : battleField.weapons[freeIndex].fire.dimension.width;
    battleField.weapons[freeIndex].fire.point.x = battleField.weapons[freeIndex].point.x + spaceIndex * width + spaceIndex * settings.EMPTY_SPACE;
    battleField.weapons[freeIndex].fire.point.y = battleField.weapons[freeIndex].point.y;
    battleField.weapons[freeIndex].fire.speed   = battleField.weapons[freeIndex].speed;
};

ShotController.prototype._getFreeWeaponIndex = function( battleField )
{
    var freeWeaponIndex = battleField.weapons.length;
    for ( var i = 0; i < freeWeaponIndex; i++ )
    {
        if ( battleField.weapons[i].damage <= 0 )
        {
            freeWeaponIndex = i;
            break;
        }
    }
    return freeWeaponIndex;
};


module.exports = new ShotController();