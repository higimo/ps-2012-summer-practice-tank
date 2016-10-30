var supportCanvasHandler = function()
{
    try
    {
        document.createElement( 'canvas' ).getContext( '2d' )
    }
    catch (e)
    {
        $( '#errorHtml5' ).attr( 'class', 'shadow' ); 
           return;
    }    
}

$( window ).ready(
    function()
    {
        supportCanvasHandler();
    }
);