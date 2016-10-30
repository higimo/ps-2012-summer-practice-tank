var SmokeHandler = function()
{
    this.smoke = new Array();
};

SmokeHandler.prototype.getSmokeByWeapons = function( weapons )
{
    for ( var i = 0, l = weapons.length; i < l; i++ )
    {    
        if ( weapons[i].damage != 0 )
        {
            this._makeSmoke( weapons[i] );
        }
    }
};

SmokeHandler.prototype.updateSmoke = function()
{
    for ( var i = 0, l = this.smoke.length; i < l; i++ )
    {
        if ( this.smoke[i].timeLife > 0 )
        {
            this.smoke[i].timeLife -= setting.GAME_INTERVAL;
        }
    }
};

SmokeHandler.prototype.getSmoke = function()
{
    return this.smoke;
};
SmokeHandler.prototype._makeSmoke = function( weapon )
{
    var freeIndex = this._getFreeSpace();
    var smokePosition = this._getSmokePosition( weapon );
    
    if ( this.smoke[freeIndex] )
    {
        delete this.smoke[freeIndex];
    }
    this.smoke[freeIndex] = new Smoke( smokePosition.x, smokePosition.y );
};

SmokeHandler.prototype._getSmokePosition = function( weapon )
{
    var randomDisplacement     = utils.getRandom( 1, 8 );
    return {
            x: this._getSmokePositionX( weapon, randomDisplacement ),
            y: this._getSmokePositionY( weapon, randomDisplacement )
        };
};

SmokeHandler.prototype._getSmokePositionX = function( weapon, randomDisplacement )
{
    var fireMargin = 10;  
    var xPos = 0;
    if ( weapon.route == setting.DIRECTION.UP || weapon.route == setting.DIRECTION.DOWN )
    {
        xPos = weapon.point.x + ( weapon.dimension.width / 2 ) - randomDisplacement;
    }
    if ( weapon.route == setting.DIRECTION.LEFT ) 
    {
        xPos = weapon.point.x + weapon.dimension.width + fireMargin + randomDisplacement;
    }
    if ( weapon.route == setting.DIRECTION.RIGHT ) 
    {
        xPos = weapon.point.x - weapon.dimension.width - fireMargin + randomDisplacement;
    }
    return xPos;
};

SmokeHandler.prototype._getSmokePositionY = function( weapon, randomDisplacement )
{
    var fireMargin = 10;
    var yPos = 0;

    if ( weapon.route == setting.DIRECTION.LEFT || weapon.route == setting.DIRECTION.RIGHT ) 
    {
        yPos = weapon.point.y + ( weapon.dimension.height / 2 ) - randomDisplacement;
    }
    if ( weapon.route == setting.DIRECTION.UP ) 
    {
        yPos = weapon.point.y + weapon.dimension.height + fireMargin + randomDisplacement;
    }
    if ( weapon.route == setting.DIRECTION.DOWN ) 
    {
        yPos = weapon.point.y - (fireMargin * 2) - randomDisplacement;
    }
    return yPos;
};

SmokeHandler.prototype._getFreeSpace = function()
{
    var result = this.smoke.length;
    for ( var i = 0, l = this.smoke.length; i < l; i++ )
    {
        if ( this.smoke[i].timeLife <= 0 )
        {
            result = i;
            break;
        }
    }
    return result;
};