var BattleFieldView = function()
 {
    this.width     = 0;
    this.height    = 0;
    this.tanks     = new Array();
    this.weapons   = new Array();
    this.walls     = new Array();
    this.explosion = new Array();
    this.smoke     = new Array();
    this.id        = -1;
    this.menuInfo  = {};
    this.draw      = new Draw();
    this.menuHandler = new MenuHandler();
};

BattleFieldView.prototype.start = function()
{
    var canvas    = $( '#canvas' )[0];
    var context   = canvas.getContext( '2d' );
    canvas.width  = this.width;
    canvas.height = this.height;
    
    this.menuHandler.init();
    this.draw.init();

    var thisPtr = this;

    setting.NUMBER_OF_BRICKS_IN_WIDTH  = this.width  / this.walls[0][0].dimension.width;
    setting.NUMBER_OF_BRICKS_IN_HEIGHT = this.height / this.walls[0][0].dimension.height;


    var animationHandler = function()
    {
        window.requestAnimationFrame( animationHandler, canvas );
        thisPtr.drawFrame();
    };     
    window.requestAnimationFrame( animationHandler, canvas );
};

BattleFieldView.prototype.drawFrame = function()
{   
    this.draw.clearCanvas();
    this.drawATerrain();
    this.drawWeapons();
    this.drawSmoke();
    this.updateSmoke();
    this.drawTanks();
    this.drawDead();
    this.updateMenu();
}

BattleFieldView.prototype.getSmoke = function()
{
    for ( var i = 0, l = this.weapons.length; i < l; i++ )
    {    
        if ( this.weapons[i].damege != 0 )
        {
            this.makeSmoke( 1, this.weapons[i] );
        }
    }
};

BattleFieldView.prototype.makeSmoke = function( count, weapon )
{
    var getFreePos = this.getFreeSpace( this.smoke );
    var route      = weapon.route;
    var fireMargin = 10;
    var point      = weapon.point;
    var dimension  = weapon.dimension;
    var random     = utils.getRandom( 1, 8 );

    var xPos = ( route == 'up'   || route == 'down'  ) ? point.x + ( dimension.width / 2 ) - random : 
                                   ( route == 'left' ) ? point.x + dimension.width + fireMargin + random :
                                                         point.x - dimension.width - fireMargin + random;
    
    var yPos = ( route == 'left' || route == 'right' ) ? point.y + ( dimension.height / 2 ) - random : 
                                   ( route == 'up'   ) ? point.y + dimension.height + fireMargin + random :
                                                         point.y - (fireMargin * 2) - random;
    if ( this.smoke[getFreePos] )
    {
        delete this.smoke[getFreePos];
    }
    this.smoke[getFreePos] = new Smoke( xPos , yPos );
};

BattleFieldView.prototype.getFreeSpace = function( arr )
{
    var result = arr.length;
    for ( var i = 0, l = arr.length; i < l; i++ )
    {
        if ( arr[i].timeLife <= 0 )
        {
            result = i;
            break;
        }
    }
    return result;
};

BattleFieldView.prototype.updateSmoke = function()
{
    for ( var i = 0, l = this.smoke.length; i < l; i++ )
    {
        if ( this.smoke[i].timeLife > 0 )
        {
            this.smoke[i].timeLife -= setting.GAME_INTERVAL;
        }
    }
};

BattleFieldView.prototype.updateMenu = function()
{
    var menu = this.tanks[this.id].menu;
    this.menuHandler.setTimer( this.menuInfo.time );
    this.menuHandler.setGamerCounts( menu.numGamer );
    this.menuHandler.setFrags( menu.frag );
    this.menuHandler.setDead( menu.dead );
};

BattleFieldView.prototype.updateBattleFieldView = function( data )
{                                                                 
    this.tanks     = data[0];
    this.weapons   = data[1];
    this.explosion = data[2];
    this.point     = data[3];
    this.menuInfo  = data[4];
};

BattleFieldView.prototype.drawDead = function()
{
    var explosionImg = $( '#explosion' )[0];
    for ( var i = 0, l = this.explosion.length; i < l; i++ )
    {    
        if ( this.explosion[i].timeLife > 0 )
        {
            this.explosion[i].image = explosionImg;
            this.draw.explosion( this.explosion[i] );
        }
    }
}

BattleFieldView.prototype.drawWeapons = function()
{
    for ( var i = 0, l = this.weapons.length; i < l; i++ )
    {    
        var weapon = this.weapons[i];
        if ( weapon.damege != 0 )
        {
            switch( weapon.route )
            {
                case 'up':
                {
                    this.setRotateRocket( weapon, 'Up' );
                    break;
                }   
                case 'down':
                {
                    this.setRotateRocket( weapon, 'Down' );
                    break;
                }   
                case 'left':
                {
                    this.setRotateRocket( weapon, 'Left' );
                    break;
                }   
                case 'right':
                {
                    this.setRotateRocket( weapon, 'Right' );
                    break;
                }  
                default:
                    break;  
            }
            this.draw.rocket( weapon )
            this.draw.flame(  weapon.fire );
        }
    }
};

BattleFieldView.prototype.setRotateRocket = function( weapon, rotate )
{
    weapon.image      = $( '#rocket' + rotate )[0];
    weapon.fire.image = $( '#fire'   + rotate )[0];
};

BattleFieldView.prototype.drawATerrain = function()
{
    var img =
    {
        metall: $( '#wall'  )[0],
        grass:  $( '#grass' )[0]
    };
    for ( var i = 0; i < setting.NUMBER_OF_BRICKS_IN_HEIGHT; i++ )
    {   
        for ( var j = 0; j < setting.NUMBER_OF_BRICKS_IN_WIDTH; j++ )
        {
            var wall   = this.walls[i][j];
            wall.image = ( wall.type == setting.METALL_WALLS ) ? img.metall : img.grass;
            this.draw.terrain( wall );
        }
    }
};

BattleFieldView.prototype.drawTanks = function()
{
    var image =
    {
        ally:  $( '#ally'  )[0],
        enemy: $( '#enemy' )[0],
        me:    $( '#tank'  )[0]
    };
    for ( var i = 0; i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health > 0 )
        {
            if ( this.id != setting.SPECTATOR )
            {
                if ( i == this.id )
                {
                    this.tanks[i].image = image.me
                }
                else
                {
                    if ( this.tanks[this.id].group == this.tanks[i].group )
                    {
                        this.tanks[i].image = image.ally;
                    }
                    else
                    {
                        this.tanks[i].image = image.enemy;
                    }
                }
                this.draw.tank( this.tanks[i] );
            }
            else
            {
                if ( this.tanks[i].group == MY_TANK_GROUP )
                {
                    this.tanks[i].image = image.ally;
                }
                else
                {
                    this.tanks[i].image = image.enemy;
                }
                this.draw.tank( this.tanks[i] );
            }
        }
    }
};

BattleFieldView.prototype.drawSmoke = function()
{
    this.getSmoke();

    var smokeImg = $( '#smoke' )[0];
    for ( var i = 0, l = this.smoke.length; i < l; i++ )
    {    
        if ( this.smoke[i].timeLife > 0 )
        {
            this.smoke[i].image = smokeImg;
            this.draw.smoke( this.smoke[i] );
        }
    }
};

BattleFieldView.prototype.getBattleFieldView = function( getBattleField, id )
{                                                         
    this.width     = getBattleField.width;
    this.height    = getBattleField.height;
    this.tanks     = getBattleField.tanks;
    this.weapons   = getBattleField.weapons;
    this.walls     = getBattleField.walls;
    this.explosion = getBattleField.explosion;
    this.id        = id;
};

var battleFieldView = new BattleFieldView();

function startBattleFieldView( getBattleField, id )
{
    battleFieldView.getBattleFieldView( getBattleField, id );
    battleFieldView.start();
};