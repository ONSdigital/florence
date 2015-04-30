function setupIframeHandler() {
  document.getElementById('iframe').onload = function () {
    var browserLocation = document.getElementById('iframe').contentWindow.location.href;
    $('.browser-location').val(browserLocation);
    prepareEventHandlers();
  };
}

function prepareEventHandlers() {
//get a specific page ID and assign it as a variable
  var iframeEvent = document.getElementById('iframe').contentWindow;
//initiate this function when the ID is clicked
  iframeEvent.addEventListener('click', Florence.Handler, true);
}

