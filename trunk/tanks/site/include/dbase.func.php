<?php
    include "db.func.php";

    function getOpenGames()
    {
        $query  = "SELECT * FROM `game` WHERE `is_broken`=1;";
        $result = getQueryResults( $query );
        return $result;
    }

    function getHallOfUsers()
    {
        $query  = "SELECT * FROM `top_player` ORDER BY `mark` DESC LIMIT 20;";
        $result = getQueryResults( $query );
        return $result;
    }
    
    function setGame( $nameGame, $battleType, $mapType, $countOfBots )
    {
        $query = sprintf( "INSERT INTO `game` VALUES ( null, '%s', CURRENT_TIME( '' ), 1, '%s', '%s', %d, 0 );",
		         escapeSql( $nameGame ), escapeSql( $battleType ), escapeSql( $mapType ), escapeSql( $countOfBots ) );
        executeQuery( $query );
    }
    
    function getGameId()
    {
        $query  = "SELECT MAX(game_id) FROM `game`;";
        $result = getQueryResults( $query );
        return ( int ) ( $result[0]["MAX(game_id)"] );
    }
?>