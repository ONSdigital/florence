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
  iframeEvent.removeEventListener();
  iframeEvent.addEventListener('click', function () {
    setTimeout(function () {
      var browserLocation = document.getElementById('iframe').contentWindow.location.href;
      $('.browser-location').val(browserLocation);
      if ($('.workspace-edit').length) {
        loadPageDataIntoEditor(getPathName(browserLocation), Florence.collection.id);
      }
      else if ($('.workspace-browse').length) {
        treeNodeSelect(browserLocation);
      }
      checkForPageChanged();
      console.log('iframe inner clicked');
    }, 200);
  }, true);
}

