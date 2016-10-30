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

// Делает видимым/невидимым поле для выбора файла в зависимости от gameMode
Utils.prototype.toggleFileSelectionField = function( id, gameMode )
{
    var fileSelectionField = $( '#' + id ).parent();
    if ( gameMode == 'ai' )
    {
        fileSelectionField.removeClass( 'no_display' );
    }
    else
    {
        fileSelectionField.addClass( 'no_display' );
    }
};

Utils.prototype.isGameNameValid = function( gameName )
{
    return ( gameName.trim() != '' ) && ( gameName.length < setting.MAX_GAME_NAME_LEN );
};

Utils.prototype.isPlayerNameValid = function( playerName )
{
    return ( playerName.trim() != '' ) && ( playerName.length < setting.MAX_GAMER_NAME_LEN );
};

Utils.prototype.getMaxOfArray = function( numericArray )
{
    return Math.max.apply( null, numericArray );
};

// returns array with only unique elements
Utils.prototype.getUniqueArray = function( array )
{
    return array.filter(
        function( value, index, self )
        {
            return self.indexOf( value ) === index;
        }
    );
};

var utils = new Utils();