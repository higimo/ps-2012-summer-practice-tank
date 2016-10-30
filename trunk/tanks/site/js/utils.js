if ( !window.requestAnimationFrame )
{
    window.requestAnimationFrame = ( 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function( callback )
        {
            return window.setTimeout( callback, 17 );
        }
    );
};

if ( !window.cancelRequestAnimationFrame )
{
    window.cancelRequestAnimationFrame = ( 
        window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.clearTimeout
    );
};

var Utils = function()
{
    //this for all utils from clients.
};

Utils.prototype.getRandom = function( min, max )
{
    return Math.random() * ( max - min ) + min;
};

/*
 * делает невидимым модальное окно используя jquery
 * 
 * @param exitButton селектор кнопки выхода
 * @modalWind exitButton jquery–объект модального окна
 */
Utils.prototype.setExitButton = function( exitButton, modalWind )
{
    $( exitButton ).click(
        function()
        {
            modalWind.attr( 'class', 'no_display' );
        }
    );
};
    
/*
 * Обрабатывает нажатие кнопки создания новой игры
 */
Utils.prototype.clickOnStartHandler = function()
{
    $( this ).attr( 'disabled', 'true' );
    $( '#loader' ).attr( 'class', '' );
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
            sendForm( parseInt( id, 10 ) );
        }
    );
};

var utils = new Utils();