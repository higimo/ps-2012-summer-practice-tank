<?php
    include './include/common.inc.php';

    $menu = getMenu('authorsMenu'); 
    $content = getTemplate( 'author' );

    $vars['title']   = 'Авторы';
    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>
