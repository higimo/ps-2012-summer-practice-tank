var mysql    = require("./../../../../libs/mysql");
var settings = require( '../../../../../setting.json' );
var thisPtr;

var ClientMySQL = function()
{
    this.client          = mysql.createClient();
    this.client.password = settings.DB_PASS;
    this.client.host     = settings.DB_HOST;
    this.client.port     = settings.DB_PORT;
    this.client.user     = settings.DB_USER;
    this.client.database = settings.DB_NAME;
    thisPtr = this;
};

ClientMySQL.prototype.prepareGameSql = function( string, params )
{
    return this.client.format( string, params );
};

ClientMySQL.prototype.executeQuery = function( string, check )
{
    this.client.query( string, check );
};

ClientMySQL.prototype.checkQuery = function( error )
{
    if ( error )
    {
        console.log( error );
    }
};

ClientMySQL.prototype._preparePlayerInfo = function( results )
{
    var len = ( results.length <= 20 ) ? results.length : 20;
    thisPtr.deleteTablePlayer();
    for ( var i = 0; i < len; ++i )
    {
        thisPtr.insertToTablePlayer( results[i].top_player_id, results[i].name, results[i].mark, results[i].frags, results[i].death, results[i].game_type, results[i].data );
    }
};

ClientMySQL.prototype.deleteExtraPlayers = function()
{
    this.orderContent( this._preparePlayerInfo );
};

ClientMySQL.prototype.insertToTablePlayer = function( idPlayer, namePlayer, mark, frags, death, battleType, data )
{
    var queryString = 'INSERT INTO top_player VALUES (?, ?, ?, ?, ?, ?, ? );';
    var params = [parseInt( idPlayer ), namePlayer, mark, parseInt( frags ), parseInt( death ), battleType, data];
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, this.checkQuery );
};

ClientMySQL.prototype.getContentTable = function( table, idGame, callback )
{
    var queryString = 'SELECT * FROM game WHERE game_id=?;';
    var params = [parseInt( idGame )];
    var loadGameParam = function( error, results, fields )
    {
        if ( error )
        {
            console.log( error );
        }
        if( results.length > 0 )
        {
            callback( results );
        }
    };
    
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, loadGameParam );
};

ClientMySQL.prototype.updateGameField = function( value, valueId )
{
    var updateQuery = 'UPDATE game SET user_count = ? WHERE game_id = ?;';
    var params = [parseInt( value ), parseInt( valueId )];
    var sql = this.prepareGameSql( updateQuery, params );
    this.executeQuery( sql, this.checkQuery );
};

ClientMySQL.prototype.updateDisplayGame = function( id )
{
    var updateQuery = 'UPDATE game SET is_broken=1 WHERE game_id=?;';
    var params = [parseInt( id )];
    var sql = this.prepareGameSql( updateQuery, params );
    this.executeQuery( sql, this.checkQuery );
};

ClientMySQL.prototype.deleteFailGames = function()
{
    var deleteQuery = 'DELETE FROM game WHERE is_broken=0;';
    this.executeQuery( deleteQuery, this.checkQuery );
};

ClientMySQL.prototype.orderContent = function( callback )
{
    var queryString = 'SELECT * FROM top_player ORDER BY mark DESC;';
    var getQuery = function( error, results, fields )
        {
            if ( results.length  > 0 )
            {
                callback( results );
            }
        };
    this.executeQuery( queryString, getQuery );
};

ClientMySQL.prototype.deleteField = function( id )
{
    var queryString = 'DELETE FROM game WHERE game_id=?;';
    var params = [parseInt( id )];
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, this.checkQuery );
};

ClientMySQL.prototype.deleteTableGame = function()
{
    var deleteQuery = 'DELETE FROM game;';
    this.executeQuery( deleteQuery, this.checkQuery );
};

ClientMySQL.prototype.deleteTablePlayer = function()
{
    var deleteQuery = 'DELETE FROM top_player;';
    this.executeQuery( deleteQuery, this.checkQuery );
};

module.exports = ClientMySQL;