var Draw = function()
{
    this.context = {};
};

Draw.prototype =
{
    init: function()
    {
        this.context = $( '#canvas' )[0].getContext( '2d' );
    },
    terrain: function( wall )
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
    },
    tank: function( tank )
    {
        var route    = tank.route;
        var rotate   = ( route == 'left' ) ? 180 : ( route == 'right' ) ? 1 : ( route == 'up' ) ? 270 : 90;
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
            var wordMiddle = ( tank.tankName.length * setting.PLAYER_NAME.CHAR_WIDTH ) / 2;
    
            this.context.save();
            this.context.font      = 'bold ' + setting.PLAYER_NAME.SIZE + 'px monospace';
            this.context.fillStyle = setting.PLAYER_NAME.COLOR;
            this.context.translate( tank.point.x + tankCenter.x, tank.point.y )
            this.context.fillText(
                tank.tankName,
               -wordMiddle,
               -setting.PLAYER_NAME.MARGIN
            );
            this.context.restore();
        }
    
        var healthWidth  = tank.health / 3;
        var healthPos =
        {
            x: tank.point.x,
            y: tank.point.y - 3
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
    },
    rocket: function( rocket )
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
    },
    flame: function( flame )
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
    },
    explosion: function( explosion )
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
    },
    smoke: function( smoke )
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
    },
    clearCanvas: function()
    {
        this.context.clearRect( 0, 0, this.width, this.height );
    }
};