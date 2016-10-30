<?php
    //header( "Content-type: text/html; charset=utf-8" ); // Из базы полученные значения надо конвертировать в utf-8 и можно убрать

    $rootPath = dirname( __FILE__ ) . '/../';
    $rootPath = str_replace(  '\\', '/', $rootPath );
    $rootPath = preg_replace( '|/[^/]+?/\.\./|', '/', $rootPath );

    define( "ROOT_PATH", $rootPath );
    define( "DB_HOST",   'localhost' );
    define( "DB_USER",   'tank_sql' );
    define( "DB_PASS",   'Am,72zLo' );
    define( "DB_NAME",   'tanks' );
    define( "DB_PORT",   '3306' );
    define( "TPL_PATH",  ROOT_PATH . 'html/' );
    define( "SITE_ROOT", ROOT_PATH );
    define( "TEMPLATES", SITE_ROOT . '/templates' );
    define( "TEMP_TPL",  SITE_ROOT . '/templates_c' );

    unset( $rootPath );
?>