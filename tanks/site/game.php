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

        if ( isset( $_POST['gameMode'] ) )
        {
            $vars['gameType'] = $_POST['gameMode'];
        }
        else
        {
            $gameInfo = getGame( $vars['gameId'] );
            $vars['gameType'] = $gameInfo['type'];
        }
    }
    else
    {
        $URL = 'index.php';
        header( "Location: " . $URL );
        exit;
    }

    $vars['socketError'] = getTemplate( 'socket_error' );
    $vars['progressBar'] = getTemplate( 'progress_bar' );
    $vars['noPlayers']   = getTemplate( 'no_players' );
    $vars['serverCrash'] = getTemplate( 'server_crash' );
    $vars['botError']    = getTemplate( 'bot_error' );
    $vars['siteHost']    = SITE_HOST;
    $vars['nodeHost']    = NODE_HOST;
    $vars['nodePort']    = NODE_PORT;

    $aiFileContents = '';
    if ( isset( $_FILES['aiFile'] ) &&
        $_FILES['aiFile']['error'] == UPLOAD_ERR_OK &&
        file_exists( $_FILES['aiFile']['tmp_name'] ) )
    {
        $aiFileContents = file_get_contents( $_FILES['aiFile']['tmp_name'] );
    }
    $tempVars['aiFileContents'] = ( $aiFileContents !== FALSE ) ? $aiFileContents : '';
    $templateName = ( $vars['gameType'] == 'ai' ) ? 'ai_game_scripts' : 'game_scripts';
    $vars['gameScripts'] = parseTemplate( $templateName, $tempVars );

    $content             = parseTemplate( 'game', $vars  );


    $vars['content'] = $content;
    $vars['menu'] = '';

    buildLayout( $vars );

?>