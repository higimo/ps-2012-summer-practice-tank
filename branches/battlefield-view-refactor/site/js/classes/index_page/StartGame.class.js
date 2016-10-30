var StartGameHandler = function() {};

StartGameHandler.prototype.setEvents = function()
{
    var thisPtr = this;
    $( '#startGame' ).click(
        function()
        {
            var startGameModal = $( '#startNewGame' ).attr( 'class', 'shadow' );

            utils.setExitButton( '#exitButtonStart', startGameModal );

            $( '#startSubmit' ).click( function()
            {
                thisPtr.clickOnStartHandler(thisPtr);
            } );

            $( '#gameName'  ).keypress( thisPtr.unfreezeStartButton );
            $( '#gamerName' ).keypress( thisPtr.unfreezeStartButton );
            $( '#gameName'  ).blur( thisPtr.unfreezeStartButton );
            $( '#gamerName' ).blur( thisPtr.unfreezeStartButton );
        }
    );
};

StartGameHandler.prototype.clickOnStartHandler = function( thisPtr )
{
    $( this ).attr( 'disabled', 'true' );
    $( '#loader' ).attr( 'class', 'loader' );
    $.get(
        'get_game_id.php',
        {
            name:       $( '#gameName' ).val(),
            battleType: $( '#gameMode' ).val(),
            mapType:    $( '#mapName'  ).val(),
            botCount:   $( '#botCount' ).val(),
        },
        function( id )
        {
            thisPtr.sendForm( parseInt( id, 10 ) );
        }
    );
};

StartGameHandler.prototype.unfreezeStartButton = function()
{
    var button = $( '#startSubmit' );
    if ( ( $( '#gameName' ).val() != '' ) && ( $( '#gamerName' ).val() != '' ) )
    {
        button.removeAttr( 'disabled' );
    }
    else
    {
        button.attr( 'disabled', 'true' );
    }
};

StartGameHandler.prototype.correctForm = function()
{
    var gameName   = $( '#gameName'  ).val();
    var playerName = $( '#gamerName' ).val();

    return ( ( gameName   != '' ) && ( gameName.length   < setting.MAX_GAME_NAME_LEN  ) &&
             ( playerName != '' ) && ( playerName.length < setting.MAX_GAMER_NAME_LEN ) );

};

StartGameHandler.prototype.sendForm = function( id )
{
    var form        = $( '#newGame' );
    var gameIdField = $( '#gameId'  );

    if ( this.correctForm() )
    {
        gameIdField.val( id );
        form[0].submit();
    }

};

$( window ).ready(
    function()
    {
        var startGameHandler = new StartGameHandler();
        startGameHandler.setEvents();
    }
);