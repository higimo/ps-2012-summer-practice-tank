<?php
    require_once( './libs/smarty/Smarty.class.php' );

    function createSmarty()
    {
        $smarty = new Smarty();
        $smarty->template_dir = TEMPLATES;
        return $smarty;
    }

    function getTemplate( $fileName )
    {
        $smarty = createSmarty();
        return $smarty->fetch( $fileName . '.tpl' );
    }

    function parseTemplate( $fileName, $vars )
    {
        $smarty = createSmarty();

        foreach ( $vars as $key => $value ) 
        {
            $smarty->assign( $key, $value );               
        }

        return $smarty->fetch( $fileName . '.tpl' );
    }

    function buildLayout( $vars )
    {
        $smarty = createSmarty();

        foreach ( $vars as $key => $value ) 
        {
            $smarty->assign( $key, $value );               
        }

        $smarty->display( 'main.tpl' );
    }
    
    function getMenu( $currentList )
    {
        $gamesMenu = '';
        $rulesMenu = '';
        $hallMenu = '';
        $authorsMenu = '';
        
        switch($currentList)
        {
            case 'gamesMenu':
                $gamesMenu = 'now';
                break;
            case 'rulesMenu':
                $rulesMenu = 'now';
                break;
            case 'hallMenu':
                $hallMenu = 'now';
                break;
            case 'authorsMenu':
                $authorsMenu = 'now';
                break;
            default:
                break;            
        }
    
        $vars = array(
            'gamesMenu' => $gamesMenu,
            'rulesMenu' => $rulesMenu,
            'hallMenu' => $hallMenu,
            'authorsMenu' => $authorsMenu
        );
        return parseTemplate( 'menu', $vars );
    }
?>