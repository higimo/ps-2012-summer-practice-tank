<div class="game_field">
  <div class="game_menu" id="menu">
    <div class="statistic">
      Игроков:
      <span class="menu_item" id="countGamers"> 0 </span>
      Жертв:
      <span class="menu_item" id="frags"> 0 </span>
      Смертей:
      <span class="menu_item" id="death"> 0 </span>
      Осталось времени:
      <span class="menu_item" id="timer"> 0:00 </span>
      Игра:
      <span class="gameName" id="nameGame"></span>
    </div>
    <div id="exit" class="exit_button_from_game"> Выйти </div>
  </div>
  <canvas id="canvas" width="960" height="560"> Поле игры </canvas>
  <!-- Спрайты -->
  <div class="picture">
    <img alt="" src="./images/tank.png"         id="tank" />
    <img alt="" src="./images/wall.png"         id="wall" />
    <img alt="" src="./images/rocket_up.png"    id="rocketUp" />
    <img alt="" src="./images/rocket_down.png"  id="rocketDown" />
    <img alt="" src="./images/rocket_right.png" id="rocketRight" />
    <img alt="" src="./images/rocket_left.png"  id="rocketLeft" />
    <img alt="" src="./images/fire_up.png"      id="fireUp" />
    <img alt="" src="./images/fire_down.png"    id="fireDown" />
    <img alt="" src="./images/fire_right.png"   id="fireRight" />
    <img alt="" src="./images/fire_left.png"    id="fireLeft" />
    <img alt="" src="./images/explosion.png"    id="explosion" />
    <img alt="" src="./images/enemy.png"        id="enemy" />
    <img alt="" src="./images/smoke.png"        id="smoke" />
    <img alt="" src="./images/grass.png"        id="grass" />
    <img alt="" src="./images/ally.png"         id="ally" />
    <img alt="" src="./images/flag.png"         id="flag" />
  </div>
  <div id="scoreList"></div>
  {$socketError}
  <div class="user_info">
    <form>
      <input type="text" name="gameName"   id="gameName"   value="{$gameName}">
      <input type="text" name="playerName" id="playerName" value="{$playerName}">
      <input type="text" name="gameId"     id="gameId"     value="{$gameId}">
      <span id="site_host">{$siteHost}</span>
      <span id="node_host">{$nodeHost}</span>
      <span id="node_port">{$nodePort}</span>
    </form>
  </div>
  {$progressBar}
  {$noPlayers}
  {$serverCrash}
  {$botError}
</div>
{$gameScripts}
<script type="text/javascript" src="http://{$nodeHost}:{$nodePort}/socket.io/lib/socket.io.js"></script>