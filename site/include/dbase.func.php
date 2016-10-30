<?php
    include "db.func.php";

    function getOpenGames()
    {
        $query  = "SELECT * FROM game";
        $result = getQueryResults( $query );
        return $result;
    }

    function getHallOfUsers()
    {
        $query  = "SELECT * FROM player ORDER BY frags DESC LIMIT 20;";
        $result = getQueryResults( $query );
        return $result;
    }
    
    function setGame( $nameGame, $battleType, $mapType, $countOfBots )
    {
        $query = sprintf( "INSERT INTO game VALUES ( null, '%s', CURRENT_TIME( '' ), 1, '%s', '%s', %d )",
		         escapeSql( $nameGame ), escapeSql( $battleType ), escapeSql( $mapType ), escapeSql( $countOfBots ) );
        mysql_query( $query );
    }
    
    function getGameId()
    {
        $query  = "SELECT MAX(id_game) FROM  `game`";
        $result = getQueryResults( $query );
        return ( int ) ( $result[0]["MAX(id_game)"] );
    }
?>