function addLoadingOverlay() {
    var body = document.getElementsByTagName('body')[0];
    var overlay = document.createElement('div');
    overlay.id = 'loading-overlay';

    var loader = document.createElement('div');
    loader.innerHTML = '<p>Loading...</p>';
    loader.className = 'loader print--hide';

    overlay.appendChild(loader);
    body.appendChild(overlay);
}


