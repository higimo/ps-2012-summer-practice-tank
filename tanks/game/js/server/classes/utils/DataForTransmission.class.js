var DataForTransmission = function() {};

DataForTransmission.prototype.getFormedUpdateData = function( battleField )
{
    return {
        tanks:         this._getTankData( battleField.tanks ),
        weapons:       this._getWeaponData( battleField.weapons ),
        explosion:     this._getExplosionData( battleField.explosion ),
        point:         battleField.point,
        timeToGameEnd: this._getTimeToEndGame ( battleField.completionGameChecker ),
        informationAboutCaptureFlagGame: this._getInformationAboutCaptureFlagGame( battleField.completionGameChecker )
    }
};

DataForTransmission.prototype.getFormedDataOfNewBattleField = function( battleField )
{
    return {
        width:         battleField.width,
        height:        battleField.height,
        walls:         battleField.walls,
        tanks:         this._getTankData( battleField.tanks ),
        weapons:       this._getWeaponData( battleField.weapons ),
        explosion:     this._getExplosionData( battleField.explosion )
    }
};

DataForTransmission.prototype._getTankData = function( tanks )
{
    var tankFormedData = new Array();
    for ( var i = 0; i < tanks.length; i++ )
    {
        tankFormedData[i] = this._getFormedDataAboutOneTank( tanks[i] );
    }
    return tankFormedData;
};

DataForTransmission.prototype._getFormedDataAboutOneTank = function( tank )
{
    return ( tank == null ) ? null :  {
        point: tank.point,
        dimension: tank.dimension,
        health: tank.health,
        route: tank.route,
        group: tank.group,
        tankName: tank.tankName,
        menu: tank.menu,
        directInBottleneck: tank.directInBottleneck
    }
};

DataForTransmission.prototype._getWeaponData = function( weapons )
{
    var weaponsFormedData = new Array();
    for ( var i = 0; i < weapons.length; i++ )
    {
        weaponsFormedData[i] = this._getFormedDataAboutOneWeapon( weapons[i] );
    }
    return weaponsFormedData;
};

DataForTransmission.prototype._getFormedDataAboutOneWeapon = function( weapon )
{
    return {
        point: weapon.point,
        dimension: weapon.dimension,
        route: weapon.route,
        fire: weapon.fire,
        damage: weapon.damage
    }
};

DataForTransmission.prototype._getExplosionData = function( explosion )
{
    var explosionFormedData = new Array();
    for ( var i = 0; i < explosion.length; i++ )
    {
        explosionFormedData[i] = this._getFormedDataAboutOneExplosion( explosion[i] );
    }
    return explosionFormedData;
};

DataForTransmission.prototype._getFormedDataAboutOneExplosion = function( explosion )
{
    return {
        point: explosion.point,
        dimension: explosion.dimension,
        rotate: explosion.rotate,
        type: explosion.type,
        timeLife: explosion.timeLife
    }
};

DataForTransmission.prototype._getTimeToEndGame = function( completionGameChecker )
{
    return completionGameChecker.getTime();
};

DataForTransmission.prototype._getInformationAboutCaptureFlagGame = function( completionGameChecker )
{
    if ( completionGameChecker.flag != null )
    {
        return {
            flag: completionGameChecker.flag,
            capture: completionGameChecker.flagRadar.capture
        }
    }
    return false;
};

module.exports = new DataForTransmission();