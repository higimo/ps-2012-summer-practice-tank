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
                thisPtr.clickOnStartHandler( thisPtr, this );
            } );

            $( '#gameName'  ).keyup( function() { thisPtr.tryUnfreezeStartButton(); } );
            $( '#gamerName' ).keyup( function() { thisPtr.tryUnfreezeStartButton(); } );

            utils.toggleFileSelectionField( 'aiFileNewGame', $( '#gameMode' ).val() );
        }
    );

    $( '#gameMode' ).change(
        function( event )
        {
            utils.toggleFileSelectionField( 'aiFileNewGame', event.target.value );
        }
    );
};

StartGameHandler.prototype.clickOnStartHandler = function( form, button )
{
    $( button ).attr( 'disabled', 'true' );
    $( '#loader' ).attr( 'class', 'loader' );
    $.get(
        'get_game_id.php',
        {
            name:       $( '#gameName' ).val(),
            battleType: $( '#gameMode' ).val(),
            mapType:    $( '#mapName'  ).val(),
            botCount:   $( '#botCount' ).val()
        },
        function( id )
        {
            form.sendForm( parseInt( id, 10 ) );
        }
    );
};

StartGameHandler.prototype.tryUnfreezeStartButton = function()
{
    var button = $( '#startSubmit' );
    if ( this.isFormValid() )
    {
        button.removeAttr( 'disabled' );
    }
    else
    {
        button.attr( 'disabled', 'true' );
    }
};

StartGameHandler.prototype.isFormValid = function()
{
    var gameName   = $( '#gameName'  ).val();
    var playerName = $( '#gamerName' ).val();

    return utils.isGameNameValid( gameName ) && utils.isPlayerNameValid( playerName );
};

StartGameHandler.prototype.sendForm = function( id )
{
    var form        = $( '#newGame' );
    var gameIdField = $( '#gameId'  );

    if ( this.isFormValid() )
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
        startGameHandler.tryUnfreezeStartButton();
    }
);