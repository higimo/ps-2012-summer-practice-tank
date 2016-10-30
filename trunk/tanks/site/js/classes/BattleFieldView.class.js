var BattleFieldView = function()
 {
    this.width          = 0;
    this.height         = 0;
    this.tanks          = new Array();
    this.weapons        = new Array();
    this.walls          = new Array();
    this.explosion      = new Array();
    this.id             = -1;
    this.timeToGameEnd  = 0;
    this.drawUtils      = new DrawUtils();
    this.menuHandler    = new MenuHandler();
    this.smokeHandler   = new SmokeHandler();
};

BattleFieldView.prototype.startBattleFieldView = function( data )
{
    battleFieldView._init( data );
    battleFieldView._start();
};

BattleFieldView.prototype.updateBattleFieldView = function( data )
{
    this.tanks = data.tanks;
    this.weapons = data.weapons;
    this.explosion = data.explosion;
    this.point = data.point;
    this.timeToGameEnd = data.timeToGameEnd;
    this.informatiomAboutCaptureFlagGame = data.informationAboutCaptureFlagGame;
};

BattleFieldView.prototype._init = function( data )
{
    var isNewGamer = this.width == 0;

    if ( isNewGamer )
    {
        this.id        = data.gamerId;
        this.width     = data.formedBattleField.width;
        this.height    = data.formedBattleField.height;
        this.tanks     = data.formedBattleField.tanks;
        this.weapons   = data.formedBattleField.weapons;
        this.walls     = data.formedBattleField.walls;
        this.explosion = data.formedBattleField.explosion;
    }
};

BattleFieldView.prototype._start = function()
{    
    this.menuHandler.init();
    this.drawUtils.initCanvas( this.width, this.height );
    this._setSettings();
    this._runAnimationFrame();
};

BattleFieldView.prototype._runAnimationFrame = function()
{
    var canvas  = this.drawUtils.getCanvas();
    var thisPtr = this;
    
    var animationHandler = function()
    {
        window.requestAnimationFrame( animationHandler, canvas );
        thisPtr._updateFrame();
    };     
    window.requestAnimationFrame( animationHandler, canvas );
};

BattleFieldView.prototype._updateFrame = function()
{
    this._updateSmoke();
    this._updateMenu();
    this._drawFrame();
};

BattleFieldView.prototype._updateSmoke = function()
{
    this.smokeHandler.getSmokeByWeapons( this.weapons );
    this.smokeHandler.updateSmoke();
};

BattleFieldView.prototype._updateMenu = function()
{
    if ( this.id != setting.SPECTATOR )
    {
        var menu = this.tanks[this.id].menu;
    }
    else
    {
        var menu = { gamerCount: 0, frag: 0, dead: 0, mark: 0 };
    }
    menu.time = this.timeToGameEnd;
    this.menuHandler.update( menu );
};

BattleFieldView.prototype._setSettings = function()
{
    setting.NUMBER_OF_BRICKS_IN_WIDTH  = this.width  / this.walls[0][0].dimension.width;
    setting.NUMBER_OF_BRICKS_IN_HEIGHT = this.height / this.walls[0][0].dimension.height;
};

BattleFieldView.prototype._drawFrame = function()
{   
    this.drawUtils.clearCanvas();
    this._drawTerrain();
    this._drawWeapons();
    this._drawSmoke();
    this._drawTanks();
    this._drawDead();
};

BattleFieldView.prototype._drawDead = function()
{
    var explosionImg = $( '#explosion' )[0];
    for ( var i = 0, l = this.explosion.length; i < l; i++ )
    {    
        if ( this.explosion[i].timeLife > 0 )
        {
            this.explosion[i].image = explosionImg;
            this.drawUtils.explosion( this.explosion[i] );
        }
    }
};

BattleFieldView.prototype._drawWeapons = function()
{
    for ( var i = 0, l = this.weapons.length; i < l; i++ )
    {    
        var weapon = this.weapons[i];
        if ( weapon.damage != 0 )
        {
            this._setRocketImage( weapon );
            this.drawUtils.rocket( weapon );
            this.drawUtils.flame( weapon.fire );
        }
    }
};

BattleFieldView.prototype._setRocketImage = function( weapon )
{
    var route = this._makeTheFirstLetterOfLarge( weapon.route );
    weapon.image = $( '#rocket' + route )[0];
    weapon.fire.image = $( '#fire'   + route )[0];
};

BattleFieldView.prototype._makeTheFirstLetterOfLarge = function( str )
{
    var first = str.charAt(0).toUpperCase();
    return first + str.substr(1);
};

BattleFieldView.prototype._drawTerrain = function()
{
    for ( var i = 0; i < setting.NUMBER_OF_BRICKS_IN_HEIGHT; i++ )
    {   
        for ( var j = 0; j < setting.NUMBER_OF_BRICKS_IN_WIDTH; j++ )
        {
            var wall   = this.walls[i][j];
            wall.image = this._getImageForTerrain( wall );
            this.drawUtils.terrain( wall );
        }
    }
    if ( this.informatiomAboutCaptureFlagGame )
    {
        this._drawInformatiomAboutCaptureFlagGame();
    }
};

BattleFieldView.prototype._drawInformatiomAboutCaptureFlagGame = function()
{
    this._drawFlag();
    this._drawCaptureFlag();
};

BattleFieldView.prototype._drawFlag = function()
{
    this.informatiomAboutCaptureFlagGame.flag.image = $( '#flag' )[0];
    this.drawUtils.flag( this.informatiomAboutCaptureFlagGame.flag );
};

BattleFieldView.prototype._drawCaptureFlag = function()
{
    var capture = this.informatiomAboutCaptureFlagGame.capture;
    var flagPoint = this.informatiomAboutCaptureFlagGame.flag.point;

    var isView = this.id == setting.SPECTATOR;
    if ( !isView )
    {
        var allyMark = ( this.tanks[this.id].group == 0 ) ? capture.first: capture.second;
        var enemyMark = ( this.tanks[this.id].group == 0 ) ? capture.second: capture.first;

        this.drawUtils.flagCaptureByAllies( flagPoint,  allyMark );
        this.drawUtils.flagCaptureByEnemies( flagPoint,  enemyMark );
    }
};

BattleFieldView.prototype._getImageForTerrain = function( wall )
{
    var images =
    {
        metall: $( '#wall'  )[0],
        grass:  $( '#grass' )[0]
    };
    return ( wall.type == setting.METALL_WALLS ) ? images.metall : images.grass;
};

BattleFieldView.prototype._drawTanks = function()
{
    for ( var i = 0; i < this.tanks.length; i++ )
    {
        if ( this.tanks[i].health > 0 )
        {
            this.tanks[i].image = this._getImageForTank( i );
            this.drawUtils.tank( this.tanks[i] );
        }
    }
};

BattleFieldView.prototype._getImageForTank = function( index )
{
    var images =
    {
        ally:  $( '#ally'  )[0],
        enemy: $( '#enemy' )[0],
        me:    $( '#tank'  )[0]
    };
    var image = null;
    
    var isView = this.id == setting.SPECTATOR;
    
    if ( isView )
    {
        var isAllyTank = this.tanks[index].group == setting.MY_TANK_GROUP;
        image = isAllyTank ? images.ally : images.enemy;
    }
    else
    {
        var isMyTank = index == this.id;
        var isAllyTank = this.tanks[index].group == this.tanks[this.id].group;
        image = isMyTank ? images.me : isAllyTank ? images.ally : images.enemy;
    }
    
    return image;
};

BattleFieldView.prototype._drawSmoke = function()
{
    var smoke = this.smokeHandler.getSmoke();
    var smokeImg = $( '#smoke' )[0];
    for ( var i = 0, l = smoke.length; i < l; i++ )
    {    
        if ( smoke[i].timeLife > 0 )
        {
            smoke[i].image = smokeImg;
            this.drawUtils.smoke( smoke[i] );
        }
    }
};

var battleFieldView = new BattleFieldView();