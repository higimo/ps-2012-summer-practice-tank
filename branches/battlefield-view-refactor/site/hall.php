<?php
    include './include/common.inc.php';

    $vars = array(
        'title'    => 'Зал славы',
        'hallMenu' => 'now'
    );

    $users         = getHallOfUsers();
    $vars['users'] = $users;

    $menu    = parseTemplate( 'menu', $vars );
    $content = parseTemplate( 'hall', $vars );

    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>