var MenuHandler = function()
{
    this.playerCount = {};
    this.timer       = {};
    this.frags       = {};
    this.dead        = {};
};

MenuHandler.prototype.init = function()
{
    this.playerCount = $( '#countGamers' );
    this.timer       = $( '#timer' );
    this.frags       = $( '#frags' );
    this.dead        = $( '#death' );

    this._setLogoutButton();
};

MenuHandler.prototype.update = function( menu )
{
    this._setTimer( menu.time );
    this._setGamerCounts( menu.gamerCount );
    this._setFrags( menu.frag );
    this._setDead( menu.dead );
};

MenuHandler.prototype._setLogoutButton = function()
{
    $( '#exit' ).click(
        function()
        {
            window.location = 'http://' + setting.SITE_HOST + '/index.php';
        }
    );
};

MenuHandler.prototype._setGamerCounts = function( count )
{
    this.playerCount.html( count );
};

MenuHandler.prototype._setFrags = function( count )
{
    this.frags.html( count );
};

MenuHandler.prototype._setDead = function( count )
{
    this.dead.html( count );
};

MenuHandler.prototype._setTimer = function( time )
{
    var minute = parseInt( time / ( 60 * 1000 ) );
    var second = parseInt( time % ( 60 * 1000 ) / 1000 );
    second = ( ( second < 10 ) && ( second >= 0 ) ) ? '0' + second : second;  

    this.timer.html( minute + ':' + second );
};