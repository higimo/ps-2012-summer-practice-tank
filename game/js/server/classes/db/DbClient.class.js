var mysql    = require("./../../../../libs/mysql");
var settings = require( '../../GameSettings' );

var ClientMySQL = function()
{
    this.client = mysql.createClient();
    this.client.password = settings.PASSWORD;
    this.client.host = settings.HOST;
    this.client.port = settings.PORT;
    this.client.user = settings.USER;
    this.client.database = settings.DATABASE;
}

ClientMySQL.prototype.prepareGameSql = function( string, params )
{
    return this.client.format( string, params );
}

ClientMySQL.prototype.executeQuery = function( string, check )
{
    this.client.query( string, check );
}

ClientMySQL.prototype.checkQuery = function( error )
{
    if ( error )
    {
        console.log( error );
    }
}

ClientMySQL.prototype.insertToTablePlayer = function( idPlayer, namePlayer, frags, death, battleType, data )
{
    var queryString = 'INSERT INTO player VALUES (?, ?, ?, ?, ?, ? );';
    var params = [parseInt( idPlayer ), namePlayer, parseInt( frags ), parseInt( death ), battleType, data];
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, this.checkQuery );
}

ClientMySQL.prototype.getContentTable = function( table, idGame, callback )
{
    var queryString = 'SELECT * FROM game WHERE id_game=?;';
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
    }
    
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, loadGameParam );
}

ClientMySQL.prototype.updateGameField = function( value, valueId )
{
    var updateQuery = 'UPDATE game SET count_users = ? WHERE id_game = ?;';
    var params = [parseInt( value ), parseInt( valueId )];
    var sql = this.prepareGameSql( updateQuery, params );
    this.executeQuery( sql, this.checkQuery );
}

ClientMySQL.prototype.orderContent = function( field, callback )
{
    var queryString = 'SELECT * FROM player ORDER BY ? DESC;';
    var params = [field];
    var getQuery = function( error, results, fields )
        {
            this.checkQuery( error );
            if ( results.length  > 0 )
            {
                callback( results );
            }
        }
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, getQuery );

}

ClientMySQL.prototype.deleteField = function( id )
{
    var queryString = 'DELETE FROM game WHERE id_game=?;';
    var params = [parseInt( id )];
    var sql = this.prepareGameSql( queryString, params );
    this.executeQuery( sql, this.checkQuery );
}


ClientMySQL.prototype.deleteTableGame = function()
{
    var deleteQuery = 'DELETE FROM game;';
    this.executeQuery( deleteQuery, this.checkQuery );
}

ClientMySQL.prototype.deleteTablePlayer = function()
{
    var deleteQuery = 'DELETE FROM player;';
    this.executeQuery( deleteQuery, this.checkQuery );
}

module.exports = ClientMySQL;