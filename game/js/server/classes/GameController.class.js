var BattleField    = require( './BattleField.class' );
var settings       = require( '../GameSettings' );
var DbClient    = require( './db/DbClient.class' );

var GameController = function()
{
    this.db = new DbClient();
    this.battleFields = new Array();
    this.battleType = null;
    this.countOfBots = 0;
    this.mapType = false;
    this.view = false;
    var thisPtr = this;
    setInterval( function(){ thisPtr._updateGameData(); }, settings.GAME_INTERVAL );
}

GameController.prototype.prepareGame = function( gameId )
{
    var exist = false;
    if ( this.battleFields.length != 0 )
    {
        exist = this._tryAddPlayer( gameId );
    }
    if ( !exist )
    {
        this._tryAddGame( gameId );
    }
    return exist;
}

GameController.prototype._tryAddPlayer = function( gameId )
{
    var exist = false;
    var i = this.getBattleField( gameId );

    if ( this.battleFields[i] != null )
    {
        var gamerId = this.battleFields[i].getNewGamerId();
        if ( gamerId >= settings.MAX_GAMER )
        {
            this._sendTooManyPlayersEvent();
        }
        else
        {
            this._addPlayer( gamerId, i, gameId );
        }
        exist = true;
    }

    return exist;
}

GameController.prototype._tryAddGame = function( gameId )
{
    if ( this.battleFields.length >= settings.MAX_GAMES )
    {
        this._sendTooManyGamesEvent();
    }
    else
    {
        this._loadGameParam( gameId );
    }
}

GameController.prototype._sendTooManyPlayersEvent = function()
{
    this.view = true;
}

GameController.prototype._sendTooManyGamesEvent = function( )
{
    console.log( 'too many games' );
    //TODO: modal window and redirect?
}

GameController.prototype._addPlayer = function( gamerId, i, gameId )
{
    this.battleFields[i].makeNewGamer( gamerId );
    ++this.battleFields[i].countPlayers;
    this.updateCountOfUser( this.battleFields[i].countPlayers, gameId );
}

GameController.prototype._loadGameParam = function( gameId )
{
    var thisPtr = this;
    this.db.getContentTable( 'game', gameId, function( results ){ thisPtr._onGameParamLoaded( results, gameId ) } );
}

GameController.prototype._onGameParamLoaded = function( results, gameId )
{
    var typeOfMap = ( results[0].map_type == 'default' ) ? false : true;
    this.mapType = true;
    this.battleType = results[0].battle_type;
    this.countOfBots = results[0].count_of_bots;
}

GameController.prototype.start = function( typeOfGame, typeOfMap, countOfBot, id )
{
    var len = this.battleFields.length;
    this.battleFields[len] = new BattleField( typeOfGame, typeOfMap, id );
    this.battleFields[len].completionGameChecker.beginGame();
    this.battleFields[len].createBot( countOfBot );
}

GameController.prototype.deleteGame = function( i )
{
    console.log( "die game:", this.battleFields[i].id );
    this.battleFields.splice( i, 1 );
}

GameController.prototype.addPlayerToHall = function( gamerId, gameId )
{
    var date = "";
    var i = this.getBattleField( gameId );
    var name = this.battleFields[i].tanks[gamerId].tankName;
    var frags = this.battleFields[i].tanks[gamerId].menu.frag;
    var death = this.battleFields[i].tanks[gamerId].menu.dead;
    var battleType = this.battleFields[i].typeOfGame;
    var day = this.battleFields[i].date.getDate();
    var month = this.battleFields[i].date.getMonth() + 1;
    var year = this.battleFields[i].date.getFullYear();
    date = day + "-" + month + "-" + year;
    this.db.insertToTablePlayer( gamerId, name, frags, death, battleType, date );
}

GameController.prototype.getBattleField = function( gameId )
{
    for ( var i = 0; i < this.battleFields.length; ++i )
    {
        if ( gameId == this.battleFields[i].id )
        {
            return i;
        }
    }
    return null;
}

GameController.prototype.checkNullGame = function( i )
{
    var countPlayers = this.battleFields[i].countPlayers;
    if ( countPlayers == 0 )
    {
        this.db.deleteField( this.battleFields[i].id );
        this.deleteGame( i );
    }
}

GameController.prototype.addGame = function( gameId )
{
    this.start( this.battleType, this.mapType, this.countOfBots, gameId );
    var gamerId = this.battleFields[this.battleFields.length - 1].getNewGamerId();
    this.battleFields[this.battleFields.length - 1].makeNewGamer( gamerId );
    ++this.battleFields[this.battleFields.length - 1].countPlayers;
}

GameController.prototype.updateCountOfUser = function( countPlayers, gameId )
{
    this.db.updateGameField( countPlayers, gameId );
}

GameController.prototype._updateGameData = function()
{
    if ( this.battleFields.length != 0 )
    {
        for ( var i = 0; i < this.battleFields.length; ++i )
        {
            this.battleFields[i].updateData();
        }
    }
}

module.exports = GameController;