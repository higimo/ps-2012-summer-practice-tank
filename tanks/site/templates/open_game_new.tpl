<div class="no_display" id="startNewGame">
  <div class="modal_form">
      <div class="exit_button" id="exitButtonStart">X</div>
      <h1 class="modal_form_title">Создание новой игры</h1>
      <form action="./game.php" method="POST" id="newGame" onsubmit="return false;">
        <div class="input_field">
          Название игры
          <input type="text" name="gameName" id="gameName" autofocus="true" maxlength="20" />
        </div>
        <div class="input_field">
          Имя игрока
          <input type="text" name="gamerName" id="gamerName" maxlength="15" />
        </div>
        <input type="text" name="gameId" id="gameId" class="no_display">
        <div class="input_field">
          Режим игры
          <select id="gameMode">
            <option value="timer">Таймер</option>
            <option value="flag">Флаг</option>
          </select>
        </div>
        <div class="input_field">
          Карта
          <select id="mapName">
            <option value="default">Стандарт</option>
            <option value="random">Рандом</option>
          </select>
        </div>
        <div class="input_field">
          Число ботов
          <select id="botCount">
            <option value="0">Ноль</option>
            <option value="1" selected="true">Один</option>
            <option value="2">Два</option>
            <option value="3">Три</option>
            <option value="4">Четыре</option>
            <option value="5">Пять</option>
            <option value="6">Шесть</option>
            <option value="7">Семь</option>
          </select>
        </div>
        <div class="input_field">
          <div id="loader" class="no_display"></div>
          <button id="startSubmit" disabled="true">Начать</button>
        </div>
      </form>
  </div>
</div>