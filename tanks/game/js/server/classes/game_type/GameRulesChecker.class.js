var CaptureFlagGame = require( './capture_flag_game/CaptureFlagGame.class' );
var TimeLimitedGame = require( './time_limited_game/TimeLimitedGame.class' );
var AiGame          = require( './ai_game/AiGame.class' );
var gameTypes       = require( '../../GameSettings' ).GAME_TYPES;

var GameRulesChecker = function( battleField )
{
    switch ( battleField.typeOfGame )
    {
        case gameTypes.FLAG_CAPTURE:
            return new CaptureFlagGame( battleField );
        case gameTypes.TIMER:
            return new TimeLimitedGame();
        case gameTypes.AI:
            return new AiGame( battleField );
        default:
            return null;
    }
};

module.exports = GameRulesChecker;