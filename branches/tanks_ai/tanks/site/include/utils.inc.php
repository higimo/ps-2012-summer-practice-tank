<?php
    function russifyGameMode( $str )
    {
        switch ( $str )
        {
            case 'timer':
                return 'На время';
            case 'flag':
                return 'Битва за флаг';
            case 'ai':
                return 'ИИ';
            default:
                return '';
        }
    }
    
    function localization( $arr )
    {
        for ( $i = 0, $l = count( $arr ); $i < $l; $i++ )
        {
            $arr[$i]['type_localized'] = russifyGameMode( $arr[$i]['type'] );
        }
        return $arr;
    }
?>