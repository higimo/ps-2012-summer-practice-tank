<?php
    include './include/common.inc.php';

    $menu    = getMenu( 'rulesMenu' );
    $content = getTemplate( 'rules' );

    $vars['title']   = 'Правила';
    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>
