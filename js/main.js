// hide loader onload
onload = _ => {
    let mainLoader = document.getElementById('main-loader');

    mainLoader.style.opacity = 0;

    setTimeout(_ => {
        mainLoader.style.display = 'none';
    }, 1000);
}