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
      <td id="gameName{$i.id_game}">   {$i.name_game}     </td>
      <td id="mapType{$i.id_game}">    {$i.map_type}      </td>
      <td id="datBegin{$i.id_game}">   {$i.data_begin}    </td>
      <td id="countUsers{$i.id_game}"> {$i.count_users}/8 </td>
      <td id="battleType{$i.id_game}"> {$i.battle_type}   </td>
      <td> <a href="#" id="{$i.id_game}" class="enterInGame"> Играть </a> | <a href="#" id="{$i.id_game}" class="lookGame"> Смотреть </a> </td>
    </tr>
    {/foreach}
  </tbody>
</table>