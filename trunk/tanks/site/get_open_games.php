<?php
    include './include/common.inc.php';
    $menu       = getMenu( 'gamesMenu' );
    $openGames  = getOpenGames();

    $openGames = localization( $openGames );

    $vars['games'] = $openGames;
    echo parseTemplate( 'open_game_table', $vars );
?>
