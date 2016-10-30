<div class="no_display" id="endGame">
  <div class="modal_form">
    <h1 class="modal_form_title">Игра закончена</h1>
    <table>
      <thead>
        <tr class="head">
          <td> Игрок </td>
          <td> Жертв </td>
          <td> Смертей </td>
          <td> Очки </td>
        </tr>
      </thead>
      <tbody>
        {foreach from=$player key=numArray item=i}
        <tr>
          <td> {$i.name} </td>
          <td> {$i.frag} </td>
          <td> {$i.death} </td>
          <td> {$i.mark} </td>
        </tr>
        {/foreach}
      </tbody>
    </table>
    <div class="hall"><a class="hall_href" href="hall.php" id="hall"> Зал славы </a></div>
    <div class="main_page"><a class="main_page_href" href="index.php" id="mainPage"> На главную </a></div>
  </div>
</div>