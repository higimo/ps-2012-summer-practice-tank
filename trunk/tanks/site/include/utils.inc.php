<?php
    function russifyGameMode( $str )
    {
        return ( $str == 'timer' ) ? 'На время' : 'Битва за флаг';
    }
    
    function localization( $arr )
    {
        for ( $i = 0, $l = count( $arr ); $i < $l; $i++ )
        {
            $arr[$i]['type'] = russifyGameMode( $arr[$i]['type'] );
        }
        return $arr;
    }
?>