var KeyboardHandler = function()
{
    this.keyCode =
    {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
    };

    this.onKeyDown = null;
    this.onKeyUp = null;

    this.keyRoutePress = 0;
    this.isShotPress = false;
    window.onkeydown = handler( this, '_keyDownHandler' );
    window.onkeyup = handler( this, '_keyUpHandler' );
};

KeyboardHandler.prototype._keyDownHandler = function( event )
{
    event.preventDefault();
    switch ( event.keyCode )
    {
        case this.keyCode.LEFT:
        case this.keyCode.UP:
        case this.keyCode.RIGHT:
        case this.keyCode.DOWN:
            if ( this.keyRoutePress != event.keyCode )
            {
                this.onKeyDown( event.keyCode );
                this.keyRoutePress = event.keyCode;
            }
            break;
        case this.keyCode.SPACE:
            if ( !this.isShotPress )
            {
                this.onKeyDown( event.keyCode );
                this.isShotPress = true;
            }
        default:
            break;
    }
};

KeyboardHandler.prototype._keyUpHandler = function( event )
{
    switch ( event.keyCode )
    {
        case this.keyCode.LEFT:
        case this.keyCode.UP:
        case this.keyCode.RIGHT:
        case this.keyCode.DOWN:
            if ( this.keyRoutePress == event.keyCode )
            {
                this.onKeyUp( event.keyCode );
                this.keyRoutePress = 0;
            }
            break;
        case this.keyCode.SPACE:
            if ( this.isShotPress )
            {
                this.onKeyUp( event.keyCode );
                this.isShotPress = false;
            }
            break;
        default:
            break;
    }
};
