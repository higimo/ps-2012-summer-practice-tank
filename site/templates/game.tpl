<div class="gameField">
  <div class="gameMenu" id="menu">
    <div class="statistic">
      Игроков:
      <span class="menuItem" id="countGamers"> 0 </span>
      Жертв:
      <span class="menuItem" id="frags"> 0 </span>
      Смертей:
      <span class="menuItem" id="death"> 0 </span>
      Осталось времени:
      <span class="menuItem" id="timer"> 0:00 </span>
    </div>
    <div id="exit" class="exitButton"> Выйти </div>
  </div>
  <!-- <img src="./images/loading.gif" class="loading" alt="" id="loader" />-->
  <canvas id="canvas" width="960" height="560"> Поле игры </canvas>
  <!-- Спрайты -->
  <div class="picture">
    <img alt="" src="./images/tank.png"         id="tank">
    <img alt="" src="./images/wall.png"         id="wall">
    <img alt="" src="./images/rocket_up.png"    id="rocketUp">
    <img alt="" src="./images/rocket_down.png"  id="rocketDown">
    <img alt="" src="./images/rocket_right.png" id="rocketRight">
    <img alt="" src="./images/rocket_left.png"  id="rocketLeft">
    <img alt="" src="./images/fire_up.png"      id="fireUp">
    <img alt="" src="./images/fire_down.png"    id="fireDown">
    <img alt="" src="./images/fire_right.png"   id="fireRight">
    <img alt="" src="./images/fire_left.png"    id="fireLeft">
    <img alt="" src="./images/explosion.png"    id="explosion">
    <img alt="" src="./images/enemy.png"        id="enemy">
    <img alt="" src="./images/smoke.png"        id="smoke">
    <img alt="" src="./images/grass.png"        id="grass">
    <img alt="" src="./images/ally.png"         id="ally">
  </div>
  {$socketError}
  <div class="userinfo">
    <form>
      <input type="text" hidden="true" name="gameName"   id="gameName"   value="{$gameName}">
      <input type="text" hidden="true" name="playerName" id="playerName" value="{$playerName}">
    </form>
  </div>
</div>
<script type="text/javascript" src="./js/keyPress.js"></script>
<script type="text/javascript" src="./js/setting_for_client.js"></script>
<script type="text/javascript" src="./js/utils.js"></script>

<script type="text/javascript" src="./js/classes/GameMenuHandler.class.js"></script>
<script type="text/javascript" src="./js/classes/Draw.class.js"></script>
<script type="text/javascript" src="./js/classes/Smoke.class.js"></script>
<script type="text/javascript" src="./js/classes/BattleFieldView.class.js"></script>

<script type="text/javascript" src="http://localhost:8787/socket.io/lib/socket.io.js"></script>
<script type="text/javascript" src="./js/client.js"></script>