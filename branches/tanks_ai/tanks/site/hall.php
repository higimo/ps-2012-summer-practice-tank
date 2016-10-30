<?php
    include './include/common.inc.php';

    $users         = getHallOfUsers();
    $vars['users'] = $users;

    $menu    = getMenu( 'hallMenu' );
    $content = parseTemplate( 'hall', $vars );

    $vars['title']   = 'Зал славы';
    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>