var CaptureFlagGame = require( './capture_flag_game/CaptureFlagGame.class' );
var TimeLimitedGame = require( './time_limited_game/TimeLimitedGame.class' );
var gameTypes       = require( '../../GameSettings' ).GAME_TYPES;

var CompletionGameChecker = function( battleField )
{
    return ( battleField.typeOfGame == gameTypes.FLAG_CAPTURE )? new CaptureFlagGame( battleField ): new TimeLimitedGame();
};

module.exports = CompletionGameChecker;