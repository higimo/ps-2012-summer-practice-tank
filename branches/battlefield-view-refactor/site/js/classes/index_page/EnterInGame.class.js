var enterInGameHandler = function()
{
    $( '.enterInGame' ).click(
        function()
        {
            var modal = $( '#enterInGame' ).attr( 'class', 'shadow' );
            
            utils.setExitButton( '#exitButtonEnter', modal );

            var gameId = parseInt( this.id, 10 );

            $( '#gameNameModal'   ).html( $( '#gameName'   + gameId ).html() );
            $( '#gamerCountModal' ).html( $( '#countUsers' + gameId ).html() );
            $( '#timeOutModal'    ).html( $( '#datBegin'   + gameId ).html() ); 
            $( '#gameIdEnter'     ).val( gameId );

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
    );
};

$( window ).ready( enterInGameHandler );