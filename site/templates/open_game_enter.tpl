<div class="noDisplay" id="enterInGame">
  <div class="modalForm">
    <div class="exit-button-from-index-page" id="exitButtonEnter">X</div>
    <h1>Присоединиться к игре</h1>
    <table>
      <tr>
        <td>Название игры</td>
        <td id="gameNameModal"></td>
      </tr>
      <tr>
        <td>Игроков:</td>
        <td id="gamerCountModal"></td>
      </tr>
      <tr>
        <td>Осталось играть:</td>
        <td id="timeOutModal"></td>
      </tr>
    </table>
    <form action="game.php" method="get">
      <div class="inputField">
        Имя игрока
        <input type="text" name="gamerName" id="gamerNameEnter">
      </div>
      <input type="text" name="gameId" id="gameIdEnter" hidden="true">
      <div class="inputField">
      	<div id="enterLoader" class="noDisplay"></div>
        <button id="enterSubmit" disabled="true">Вступить</button>
      </div>
    </form>
  </div>
</div>