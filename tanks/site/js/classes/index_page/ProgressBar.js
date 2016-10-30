function endShowProgressBar()
{
    document.getElementById('progressBarBlock').style.display = 'none';
}

var progressBar = document.getElementById('progressBar');

window.setInterval(function(){
    if (progressBar.value >= 200)
    {
        progressBar.value = 0;
    }
    else
    {
        progressBar.value += 2;
    }
}
, 10)