<?php
    include './include/common.inc.php';

    $vars = array(
        'title'     => 'Игры',
        'gamesMenu' => 'now'
    );

    $vars['gameName'] = '';
    $vars['playerName'] = '';
    $vars['gameId'] = '';
    $isPost = isset( $_POST['gameId'] ) && isset( $_POST['gamerName'] ) && isset( $_POST['gameName'] );
    
    if ( $isPost )
    {
        $vars['gameName'] = isset( $_POST['gameName'] ) ? $_POST['gameName'] : '';
        $vars['playerName'] = isset( $_POST['gamerName'] ) ? $_POST['gamerName'] : '';
        $vars['gameId'] = isset( $_POST['gameId'] ) ? $_POST['gameId'] : '';
    }
    else
    {
        $URL = 'index.php';
        header( "Location: " . $URL );
        exit;
    }

    $vars['socketError'] = getTemplate( 'socket_error' );
    $vars['progresBar']  = getTemplate( 'progres_bar' );
    $vars['noPlayers']   = getTemplate( 'no_players' );
    $vars['serverCrash'] = getTemplate( 'server_crash' );
    $vars['siteHost']    = SITE_HOST;
    $vars['nodeHost']    = NODE_HOST;
    $vars['nodePort']    = NODE_PORT;
    $content             = parseTemplate( 'game', $vars  );

    $vars['content'] = $content;
    $vars['menu'] = '';

    buildLayout( $vars );

?>