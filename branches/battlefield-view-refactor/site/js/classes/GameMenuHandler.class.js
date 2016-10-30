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

    $( '#exit' ).click(
        function()
        {
            window.location = "/index.php";
        }
    );
};

MenuHandler.prototype.setGamerCounts = function( count )
{
    this.playerCount.html( count );
};

MenuHandler.prototype.setFrags = function( count )
{
    this.frags.html( count );
};

MenuHandler.prototype.setDead = function( count )
{
    this.dead.html( count );
};

MenuHandler.prototype.setTimer = function( time )
{
    var minute = parseInt( time / ( 60 * 1000 ) );
    var second = parseInt( time % ( 60 * 1000 ) / 1000 );
    second = ( ( second < 10 ) && ( second >= 0 ) ) ? '0' + second : second;  

    this.timer.html( minute + ':' + second );
};