var DrawUtils = function()
{
    this.canvas  = {};
    this.context = {};
};

DrawUtils.prototype.initCanvas = function( width, height )
{
    this.canvas   = $( '#canvas' )[0];
    this.context  = this.canvas.getContext( '2d' );
    this.canvas.width  = width;
    this.canvas.height = height;
    this.scaleTankHealth = 3;
    this.scaleFlagCapture = 25;
};

DrawUtils.prototype.getCanvas = function()
{
    return this.canvas;
};

DrawUtils.prototype.flag = function( flag )
{
    this.context.save();
    this.context.drawImage(
        flag.image,
        flag.point.x,
        flag.point.y,
        flag.dimension.width,
        flag.dimension.height
    );
    this.context.restore();
};

DrawUtils.prototype.terrain = function( wall )
{
    var position = wall.point;
    var size     = wall.dimension;

    this.context.save();
    this.context.drawImage(
        wall.image,
        position.x,
        position.y,
        size.width,
        size.height
    );
    this.context.restore();
};

DrawUtils.prototype.tank = function( tank )
{
    var route    = (tank.directInBottleneck.isBottleneck) ? tank.directInBottleneck.route : tank.route;
    var rotate   = ( route == setting.DIRECTION.LEFT ) ? 180 : ( route == setting.DIRECTION.RIGHT ) ? 1 : ( route == setting.DIRECTION.UP ) ? 270 : 90;
    var tankSize = tank.dimension;
    var tankCenter = 
    {
        x: tankSize.width  / 2,
        y: tankSize.height / 2
    };

    this.context.save();
    this.context.translate( tank.point.x + tankCenter.x, tank.point.y + tankCenter.y );
    this.context.rotate( rotate * Math.PI / 180 );
    this.context.drawImage(
        tank.image,
       -tankCenter.x,
       -tankCenter.y,
        tankSize.width,
        tankSize.height
    );
    this.context.restore();

    if ( tank.tankName )
    {
        this.tankName( tank, tankCenter );
    }

    this.tankHealth( tank );
};

DrawUtils.prototype.tankName = function( tank, tankCenter )
{
    var wordMiddle = ( tank.tankName.length * setting.PLAYER_NAME.CHAR_WIDTH ) / 2;

    this.context.save();
    this.context.font      = 'bold ' + setting.PLAYER_NAME.SIZE + 'px monospace';
    this.context.fillStyle = setting.PLAYER_NAME.COLOR;
    this.context.translate( tank.point.x + tankCenter.x, tank.point.y );
    this.context.fillText(
        tank.tankName,
        -wordMiddle,
        -setting.PLAYER_NAME.MARGIN
    );
    this.context.restore();
};

DrawUtils.prototype.tankHealth = function( tank )
{
    var healthWidth  = tank.health / this.scaleTankHealth;
    var healthPos =
    {
        x: tank.point.x,
        y: tank.point.y
    };

    this.context.save();
    this.context.fillStyle = setting.HEALTH.COLOR;
    this.context.fillRect(
        healthPos.x,
        healthPos.y - setting.HEALTH.MARGIN,
        healthWidth,
        setting.HEALTH.HEIGHT
    );
    this.context.restore();
};

DrawUtils.prototype.flagCaptureByAllies = function( flagPoint, mark )
{
    var width  = mark / this.scaleFlagCapture;
    var pos = {
        x: flagPoint.x,
        y: flagPoint.y - setting.FLAG_CAPTURE.MARGIN_FOR_ALLY
    };

    this.context.save();
    this.context.fillStyle = setting.FLAG_CAPTURE.ALLY_COLOR;
    this.context.fillRect(
        pos.x,
        pos.y,
        width,
        setting.FLAG_CAPTURE.HEIGHT
    );
    this.context.restore();
};

DrawUtils.prototype.flagCaptureByEnemies = function( flagPoint, mark )
{
    var width  = mark / this.scaleFlagCapture;
    var pos = {
        x: flagPoint.x,
        y: flagPoint.y - setting.FLAG_CAPTURE.MARGIN_FOR_ENEMY
    };

    this.context.save();
    this.context.fillStyle = setting.FLAG_CAPTURE.ENEMY_COLOR;
    this.context.fillRect(
        pos.x,
        pos.y,
        width,
        setting.FLAG_CAPTURE.HEIGHT
    );
    this.context.restore();
};

DrawUtils.prototype.rocket = function( rocket )
{
    this.context.save();

    this.context.drawImage( 
        rocket.image,
        rocket.point.x,
        rocket.point.y,
        rocket.dimension.width,
        rocket.dimension.height
    );

    this.context.restore();
};

DrawUtils.prototype.flame = function( flame )
{
    this.context.save();

    this.context.drawImage( 
        flame.image,
        flame.point.x,
        flame.point.y,
        flame.dimension.width,
        flame.dimension.height
    );

    this.context.restore();
};

DrawUtils.prototype.explosion = function( explosion )
{
    this.context.save();

    this.context.drawImage(
        explosion.image,
        explosion.point.x - ( explosion.dimension.width  / 2 ),
        explosion.point.y - ( explosion.dimension.height / 2 ),
        explosion.dimension.width,
        explosion.dimension.height
    );

    this.context.restore();
};

DrawUtils.prototype.smoke = function( smoke )
{
    this.context.save();

    this.context.drawImage( 
        smoke.image,
        smoke.point.x,
        smoke.point.y,
        smoke.dimension.width,
        smoke.dimension.height
    );

    this.context.restore();
};

DrawUtils.prototype.clearCanvas = function()
{
    this.context.clearRect( 0, 0, this.width, this.height );
};