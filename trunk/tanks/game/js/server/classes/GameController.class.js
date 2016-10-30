var BattleField         = require( './BattleField.class' );
var settings            = require( '../GameSettings' );
var DbClient            = require( './db/DbClient.class' );
var mapParams           = settings.MAP_PARAMS;
var DataForTransmission = require( './utils/DataForTransmission.class' );

var GameController = function()
{
    this.db           = new DbClient();
    this.battleFields = new Array();
    this.battleType   = null;
    this.countOfBots  = 0;
    this.mapType      = false;
    this.view         = false;
    this.intervals    = new Array();
};

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
};

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
            if ( !this.view )
            {
                this._addPlayer( gamerId, i, gameId );
            }
        }
        exist = true;
    }

    return exist;
};

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
};

GameController.prototype._sendTooManyPlayersEvent = function()
{
    this.view = true;
};

GameController.prototype._sendTooManyGamesEvent = function( )
{
    console.log( 'too many games' );
};

GameController.prototype._addPlayer = function( gamerId, i, gameId )
{
    this.battleFields[i].makeNewGamer( gamerId );
    ++this.battleFields[i].countPlayers;
    this.updateCountOfUser( this.battleFields[i].countPlayers, gameId );
};

GameController.prototype._loadGameParam = function( gameId )
{
    var thisPtr = this;
    this.db.getContentTable( 'game', gameId, function( results ){ thisPtr._onGameParamLoaded( results ) } );
};

GameController.prototype._onGameParamLoaded = function( results )
{
    this.battleType = results[0].type;
    var mapType = results[0].map_type;
    if ( this.battleType == settings.GAME_TYPES.FLAG_CAPTURE )
    {
        this.mapType = ( mapType == mapParams.DEFAULT_MAP ) ? mapParams.FLAG_DEFAULT_MAP : mapParams.FLAG_RANDOM_MAP;
    }
    else
    {
        this.mapType = mapType;
    }
    this.countOfBots = results[0].bot_count;
};

GameController.prototype.start = function( typeOfGame, typeOfMap, countOfBot, id )
{
    var len = this.battleFields.length;
    this.battleFields[len] = new BattleField( typeOfGame, typeOfMap, id );
    this.battleFields[len].completionGameChecker.beginGame();
    this.battleFields[len].createBots( countOfBot );
};

GameController.prototype.addAllPlayersToHall = function( tanks, gameId )
{
    for (var i = 0; i < tanks.length; i++)
    {
        if ( !tanks[i].isBot() )
        {
            this.addPlayerToHall( i, gameId );
        }
    }
};

GameController.prototype.addPlayerToHall = function( tankId, gameId )
{
    var i = this.getBattleField( gameId );
    var name = this.battleFields[i].tanks[tankId].tankName;
    var mark = this.battleFields[i].getTankMark( this.battleFields[i].tanks[tankId] );
    var frags = this.battleFields[i].tanks[tankId].menu.frag;
    var death = this.battleFields[i].tanks[tankId].menu.dead;
    var battleType = this.battleFields[i].typeOfGame;
    var date = this._getFormedDate( this.battleFields[i].date );
    this.db.insertToTablePlayer( tankId, name, mark, frags, death, battleType, date );
    this.db.deleteExtraPlayers();
};

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
};

GameController.prototype.areThereNotPlayers = function( i )
{
    return this.battleFields[i].countPlayers == 0;
};

GameController.prototype.deleteGame = function( i )
{
    console.log( "delete game", i );
    var gameId = this.battleFields[i].id;
    this.addAllPlayersToHall( this.battleFields[i].tanks, gameId);
    this.db.deleteField( gameId );
    this.battleFields.splice( i, 1 );

    console.log( "die game:", gameId );
};

GameController.prototype.addGame = function( gameId )
{
    var thisPtr = this;
    this.start( this.battleType, this.mapType, this.countOfBots, gameId );
    this._tryAddPlayer( gameId );
    this.intervals[gameId] = setInterval( function(){ thisPtr._updateGameData( gameId ); }, settings.GAME_INTERVAL )
};

GameController.prototype.updateCountOfUser = function( countPlayers, gameId )
{
    this.db.updateGameField( countPlayers, gameId );
};

GameController.prototype.getIndexBattleField = function( index )
{
    return this.battleFields[index].id;
};

GameController.prototype._getFormedDate = function( date )
{
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
};

GameController.prototype._updateGameData = function( gameId )
{
    var i = this.getBattleField( gameId );
    if ( this.battleFields.length != 0 && this.battleFields[i] )
    {
        this.battleFields[i].updateData();
    }
};

GameController.prototype.isGameEnded = function( i )
{
    return this.battleFields[i].isGameEnded();
};

GameController.prototype.getUpdatedData = function( battleField )
{
    return DataForTransmission.getFormedUpdateData( battleField );
};

GameController.prototype.getTheFirstDataForTransmission = function( battleField, gamerId  )
{
    return {
        formedBattleField: DataForTransmission.getFormedDataOfNewBattleField( battleField ),
        gamerId: gamerId
    }
};

module.exports = GameController;