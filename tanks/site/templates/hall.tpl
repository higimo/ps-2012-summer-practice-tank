<div class="content">
  <h1> Зал славы </h1>
  <table>
    <thead>
      <tr class="head">
        <td> Игрок </td>
        <td> Очки </td>
        <td> Жертв </td>
        <td> Смертей </td>
        <td> Режим </td>
        <td> Дата </td>
      </tr>
    </thead>
    <tbody>                                       
      {foreach from=$users key=numArray item=i}
      <tr>         
        <td> {$i.name} </td>
        <td> {$i.mark} </td>
        <td> {$i.frags} </td>
        <td> {$i.death} </td>
        <td> {$i.game_type} </td>
        <td> {$i.data} </td>
      </tr>                                
      {/foreach}
    </tbody>         
  </table>
</div>
