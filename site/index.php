<?php
    include './include/common.inc.php';

    $vars = array(
        'title'     => 'Игры',
        'gamesMenu' => 'now'
    );

    $menu       = parseTemplate( 'menu', $vars );
    $openGames  = getOpenGames();

    $newGame    = getTemplate( 'open_game_new'   );
    $enterGame  = getTemplate( 'open_game_enter' );
    $checkHtml5 = getTemplate( 'not_html5'       );
    
    $vars['games'] = $openGames;
    $table         = parseTemplate( 'open_game_table', $vars );

    $vars['openGameTable']  = $table;
    $vars['openGameNew']    = $newGame;
    $vars['showErrorHtml5'] = $checkHtml5;
    $vars['openGameEnter']  = $enterGame;

    $content = parseTemplate( 'open_game', $vars );

    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>
