<?php
    include './include/common.inc.php';

    $vars = array(
        'title'       => 'Авторы',
        'authorsMenu' => 'now'
    );

    $menu    = parseTemplate( 'menu', $vars );
    $content = getTemplate(   'author' );

    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>
