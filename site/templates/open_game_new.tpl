<div class="noDisplay" id="startNewGame">
  <div class="modalForm">
      <div class="exit-button-from-index-page" id="exitButtonStart">X</div>
      <h1>Создание новой игры</h1>
      <form action="/game.php" method="get" id="newGame" onsubmit="return false;">
        <div class="inputField">
          Название игры
          <input type="text" name="gameName" id="gameName" autofocus="true" formmethod="post">
        </div>
        <div class="inputField">
          Имя игрока
          <input type="text" name="gamerName" id="gamerName" formmethod="post">
        </div>
        <input type="text" name="gameId" id="gameId" hidden="true">
        <div class="inputField">
          Режим игры
          <select id="gameMode">
            <option value="timer">Таймер</option>
          </select>
        </div>
        <div class="inputField">
          Карта
          <select id="mapName">
            <option value="default">Стандарт</option>
          </select>
        </div>
        <div class="inputField">
          Число ботов
          <select id="botCount">
            <option value="1">Один</option>
          </select>
        </div>
        <div class="inputField">
          <div id="loader" class="noDisplay"></div>
          <button id="startSubmit" disabled="true">Начать</button>
        </div>
      </form>
  </div>
</div>