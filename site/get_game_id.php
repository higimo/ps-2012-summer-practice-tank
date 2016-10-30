<?php
    include './include/common.inc.php';

    $nameGame    = $_GET['name'];
    $battleType  = $_GET['battleType'];
    $mapType     = $_GET['mapType'];
    $countOfBots = $_GET['botCount'];

    setGame( $nameGame, $battleType, $mapType, $countOfBots );

    echo getGameId();
?>