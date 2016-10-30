<table>
  <thead>
    <tr class="head">
      <td> Название </td>
      <td> Карта </td>
      <td> Начало </td>
      <td> Игроков </td>
      <td> Режим </td>
      <td>  </td>
    </tr>
  </thead>
  <tbody>
    {foreach from=$games key=numArray item=i}
    <tr>
      <td id="gameName{$i.game_id}">   {$i.name}     </td>
      <td id="mapType{$i.game_id}">    {$i.map_type}      </td>
      <td id="datBegin{$i.game_id}">   {$i.begin_date}    </td>
      <td id="countUsers{$i.game_id}"> {$i.user_count+$i.bot_count}/8 </td>
      <td id="battleType{$i.game_id}"> {$i.type_localized}   </td>
      <td> <a href="javascript:void(0)" id="{$i.game_id}" data-game-mode="{$i.type}" class="enterInGame{if {$i.user_count+$i.bot_count} >= 8}Disabled{/if}">Играть</a> | <a href="#" onclick="document.getElementById('lookForm{$i.game_id}').submit(); return false;">Смотреть</a>

        <form action="./game.php" method="POST" id="lookForm{$i.game_id}">
          <input type="text" name="gamerName" id="gamerNameLookEnter" class="no_display" value="mYtAnK" />
          <input type="text" name="gameId" id="gameIdLookEnter" class="no_display" value="{$i.game_id}" />
          <input type="text" name="gameName" id="gameNameLookEnter" class="no_display" value="{$i.name}" />
        </form>

      </tr>
    {/foreach}
  </tbody>
</table>