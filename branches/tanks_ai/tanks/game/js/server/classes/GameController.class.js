var BattleField         = require( './BattleField.class' );
var settings            = require( '../GameSettings' );
var DbClient            = require( './db/DbClient.class' );
var mapParams           = settings.MAP_PARAMS;
var DataForTransmission = require( './utils/DataForTransmission.class' );

var GameController = function()
{
    this.db                     = new DbClient();
    this.battleFields           = {}; // map container
    this.view                   = false;
    this.intervals              = new Array();
    this.asyncDbOperationResult =
    {
        battleType: null,
        countOfBots: 0,
        mapType: false
    };
};

GameController.prototype.prepareGame = function( gameId )
{
    var exist = false;
    if ( Object.keys( this.battleFields ).length != 0 )
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

    if ( this.battleFields[gameId] )
    {
        var gamerId = this.battleFields[gameId].getNewGamerId();
        if ( gamerId >= settings.MAX_GAMER )
        {
            this._sendTooManyPlayersEvent();
        }
        else
        {
            if ( !this.view )
            {
                this._addPlayer( gamerId, gameId );
            }
        }
        exist = true;
    }

    return exist;
};

GameController.prototype._tryAddGame = function( gameId )
{
    if ( Object.keys( this.battleFields ).length >= settings.MAX_GAMES )
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

GameController.prototype._addPlayer = function( gamerId, gameId )
{
    this.battleFields[gameId].makeNewGamer( gamerId );
    ++this.battleFields[gameId].countPlayers;
    this.updateCountOfUser( this.battleFields[gameId].countPlayers, gameId );
};

GameController.prototype._loadGameParam = function( gameId )
{
    var thisPtr = this;
    this.db.getContentTable( 'game', gameId, function( results ){ thisPtr._onGameParamLoaded( results ) } );
};

GameController.prototype._onGameParamLoaded = function( results )
{
    this.asyncDbOperationResult.battleType = results[0].type;
    var mapType = results[0].map_type;
    if ( this.asyncDbOperationResult.battleType == settings.GAME_TYPES.FLAG_CAPTURE ||
        this.asyncDbOperationResult.battleType == settings.GAME_TYPES.AI )
    {
        this.asyncDbOperationResult.mapType = ( mapType == mapParams.DEFAULT_MAP ) ?
            mapParams.FLAG_DEFAULT_MAP : mapParams.FLAG_RANDOM_MAP;
    }
    else
    {
        this.asyncDbOperationResult.mapType = mapType;
    }
    this.asyncDbOperationResult.countOfBots = results[0].bot_count;
};

GameController.prototype.start = function( typeOfGame, typeOfMap, countOfBot, gameId )
{
    this.battleFields[gameId] = new BattleField( typeOfGame, typeOfMap, gameId );
    this.battleFields[gameId].gameRulesChecker.beginGame();
    this.battleFields[gameId].createBots( countOfBot );
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
    var name = this.battleFields[gameId].tanks[tankId].tankName;
    var mark = this.battleFields[gameId].getTankMark( this.battleFields[gameId].tanks[tankId] );
    var frags = this.battleFields[gameId].tanks[tankId].menu.frag;
    var death = this.battleFields[gameId].tanks[tankId].menu.dead;
    var battleType = this.battleFields[gameId].typeOfGame;
    var date = this._getFormedDate( this.battleFields[gameId].date );
    this.db.insertToTablePlayer( tankId, name, mark, frags, death, battleType, date );
    this.db.deleteExtraPlayers();
};

GameController.prototype.areThereNotPlayers = function( gameId )
{
    return this.battleFields[gameId].countPlayers == 0;
};

GameController.prototype.deleteGame = function( gameId )
{
    console.log( "delete game", gameId );
    this.addAllPlayersToHall( this.battleFields[gameId].tanks, gameId);
    this.db.deleteField( gameId );
    delete this.battleFields[gameId];

    console.log( "die game:", gameId );
};

GameController.prototype.addGame = function( gameId )
{
    var thisPtr = this;
    this.start( this.asyncDbOperationResult.battleType, this.asyncDbOperationResult.mapType,
        this.asyncDbOperationResult.countOfBots, gameId );
    this._tryAddPlayer( gameId );
    this.intervals[gameId] = setInterval( function(){ thisPtr._updateGameData( gameId ); }, settings.GAME_INTERVAL )
};

GameController.prototype.updateCountOfUser = function( countPlayers, gameId )
{
    this.db.updateGameField( countPlayers, gameId );
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
    if ( Object.keys( this.battleFields ).length != 0 && this.battleFields[gameId] )
    {
        this.battleFields[gameId].updateData();
    }
};

GameController.prototype.isGameEnded = function( gameId )
{
    return this.battleFields[gameId].isGameEnded();
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