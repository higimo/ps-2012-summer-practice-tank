<div class="no_display" id="enterInGame">
  <div class="modal_form">
    <div class="exit_button" id="exitButtonEnter">X</div>
    <h1 class="modal_form_title">Присоединиться к игре</h1>
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
        <td>Время начала игры:</td>
        <td id="timeOutModal"></td>
      </tr>
    </table>
    <form action="./game.php" method="POST">
      <div class="input_field">
        Имя игрока
        <input type="text" name="gamerName" id="gamerNameEnter" autofocus="true">
      </div>
      <input type="text" name="gameId" id="gameIdEnter" class="no_display">
      <input type="text" name="gameName" id="gameNameEnter" class="no_display">
      <div class="input_field">
        <div id="enterLoader" class="no_display"></div>
        <button id="enterSubmit" disabled="true">Вступить</button>
      </div>
    </form>
  </div>
</div>