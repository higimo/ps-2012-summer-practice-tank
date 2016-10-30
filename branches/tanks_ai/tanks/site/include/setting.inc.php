<?php
    //header( "Content-type: text/html; charset=utf-8" );

    require_once( 'settings.func.php' );

    $rootPath = dirname( __FILE__ ) . '/../';
    $rootPath = str_replace(  '\\', '/', $rootPath );
    $rootPath = preg_replace( '|/[^/]+?/\.\./|', '/', $rootPath );
    
    $config = getMainConfig( '../setting.json' );

    define( "ROOT_PATH", $rootPath );
    define( "SITE_ROOT", ROOT_PATH );

    define( "SITE_HOST", $config['SITE_HOST'] );
    define( "NODE_HOST", $config['NODE_HOST'] );
    define( "NODE_PORT", $config['NODE_PORT'] );

    define( "DB_HOST", $config['DB_HOST'] );
    define( "DB_USER", $config['DB_USER'] );
    define( "DB_PASS", $config['DB_PASS'] );
    define( "DB_NAME", $config['DB_NAME'] );
    define( "DB_PORT", $config['DB_PORT'] );  

    define( "TEMPLATES", SITE_ROOT . '/templates' );
    define( "TEMP_TPL",  SITE_ROOT . '/templates_c' );

    define( "GAME_TIME",  5 ); //минуты

    unset( $rootPath );
?>