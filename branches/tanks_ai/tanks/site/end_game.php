<?php
    include './include/common.inc.php';

    $arrayOfPlayers = explode( ':', $_POST['name'], -1 );
    $countOfPlayers = count( $arrayOfPlayers ) / 4;

    $players = array();
    for ( $i = 0; $i < count( $arrayOfPlayers ); $i += 4 )
    {
        $data['name'] = $arrayOfPlayers[$i];
        $data['frag'] = $arrayOfPlayers[$i + 1];
        $data['death'] = $arrayOfPlayers[$i + 2];
        $data['mark'] = $arrayOfPlayers[$i + 3];
        $players[$i] = $data;
    }
    $vars['player'] = $players;
    echo parseTemplate( 'end_game', $vars );
?>
      