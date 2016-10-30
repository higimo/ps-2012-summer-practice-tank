keyboardEventStart = function() //TODO: Почему не через var
{          
    var keyRoutePress  = 0;
    var isShotPress    = false;           
    var keyDownHandler = function( event )
    {
        event.preventDefault();                                 
        switch ( event.keyCode )
        {
            case 37:
            case 38:
            case 39:
            case 40:
                if ( keyRoutePress != event.keyCode )
                {
                    keyPress( event.keyCode );
                    keyRoutePress = event.keyCode;          
                }
                break;
            case 32:
                if ( !isShotPress )
                {
                    keyPress( event.keyCode );
                    isShotPress = true;                    
                }
            default:
                break;
        }
    };
    var onKeyboardEvent = function( event )
    {
        switch ( event.keyCode )
        {
            case 37:
            case 38:
            case 39:
            case 40:
                if ( keyRoutePress == event.keyCode )
                {
                    keyPressFree( event.keyCode );
                    keyRoutePress = 0;                          
                }
                break;
            case 32:
                if ( isShotPress )
                {
                    keyPressFree( event.keyCode );
                    isShotPress = false;                       
                }
                break;
            default:
                break;
        }
    };
    window.onkeydown = keyDownHandler;
    window.onkeyup   = onKeyboardEvent;
}