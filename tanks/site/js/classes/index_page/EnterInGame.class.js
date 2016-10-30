updateGameInfo();
setInterval( updateGameInfo, 3000 );

function updateGameInfo()
{
    $.ajax({
        type: "POST",
        url: "get_open_games.php",
        data: "",
        success: function( msg ){
            $( "#openGames" ).html( msg );
        }
    });
}

var enterInGameHandler = function()
{
    $( '.enterInGame' ).click(
        function()
        {
            console.log("click");
            var gameId = parseInt( this.id, 10 );
            var playerCount = parseInt( $( '#countUsers' + gameId ).html() );
            if ( playerCount <= 8 )
            {
            	var modal = $( '#enterInGame' ).attr( 'class', 'shadow' );
            	var gameName = $( '#gameName'   + gameId ).html();
                utils.setExitButton( '#exitButtonEnter', modal );

	        $( '#gameNameModal'   ).html( $( '#gameName'   + gameId ).html() );
                $( '#gamerCountModal' ).html( $( '#countUsers' + gameId ).html() );
                $( '#timeOutModal'    ).html( $( '#datBegin'   + gameId ).html() );
                $( '#gameIdEnter'     ).val( gameId );              
                $( '#gameNameEnter'   ).val( gameName );

                $( '#enterSubmit' ).click(
                    function()
                    {
                        $( '#enterLoader' ).attr( 'class', 'loader' );
                    }
                );

                $( '#gamerNameEnter' ).keypress( function()
                    {
                        var button = $( '#enterSubmit' );
                        if ( $( '#gamerNameEnter' ).val() != '' )
                        {
                            button.removeAttr( 'disabled' );
                        }
                        else
                        {
                            button.attr( 'disabled', 'true' );
                        }
                    }
                );
            }
        }
    );
};

$( window ).ready( setInterval( enterInGameHandler ), 3000 );