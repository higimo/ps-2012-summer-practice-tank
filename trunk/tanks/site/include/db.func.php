<?php
    function dbConnect()
    {
        $mysqli = new mysqli( DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT );
        return $mysqli;
    }

    function executeQuery( $query )
    {
        $db = dbConnect();
        $db->set_charset('utf8');
        return $db->query( $query );
    }

    function getQueryResults( $query )
    {
        $db = dbConnect();
        $results = array();
        $request = executeQuery( $query );
        if ( $request )
        {
            while ( $assoc = $request->fetch_assoc() )
            {
                array_push( $results, $assoc );
            }
        }
        return $results;
    }

    function escapeSql( $var )
    {        
        $db = dbConnect();
        return $db->real_escape_string( $var );
    }
?>