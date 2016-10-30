<?php
    include './include/common.inc.php';

    $vars = array(
        'title'       => 'Правила',
        'rulesMenu'   => 'now',
    );

    $menu    = parseTemplate( 'menu', $vars );
    $content = getTemplate(   'rules' );

    $vars['content'] = $content;
    $vars['menu']    = $menu;

    buildLayout( $vars );
?>
