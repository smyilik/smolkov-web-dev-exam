function closeAlert() {
    const alert = document.getElementsByClassName('notification');
    if (alert) {
        alert[0].parentElement.style.display='none';
    }
    document.getElementById('header-wrap').style.height = '80px';
}
