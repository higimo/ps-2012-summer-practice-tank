<?php
    include './include/common.inc.php';

    $vars = array(
        'title'     => 'Игры',
        'gamesMenu' => 'now'
    );

    $gameName   = $_GET['gameName'];
    $playerName = $_GET['gamerName'];
    $vars['gameName']   = $gameName;
    $vars['playerName'] = $playerName;

    $vars['socketError'] = getTemplate(   'socket_error' );
    $content             = parseTemplate( 'game', $vars  );

    $vars['content']    = $content;

    buildLayout( $vars );
?>