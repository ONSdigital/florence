function createWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", currentPath);

  Florence.refreshAdminMenu();

  var workSpace = templates.workSpace(Florence.tredegarBaseUrl + path);
  $('.section').html(workSpace);

  document.getElementById('iframe').onload = function () {
    var browserLocation = document.getElementById('iframe').contentWindow.location.href;
    $('.browser-location').val(browserLocation);
    var iframeEvent = document.getElementById('iframe').contentWindow;
    iframeEvent.addEventListener('click', Florence.Handler, true);
  }

  //$('iframe').load(function() {
  //  var iframe = $('iframe');
  //  var browserLocation = iframe.contents().get(0).location.href;
  //  $('.browser-location').val(browserLocation);
  //  iframe.contents().on('click', Florence.Handler);
  //});

  viewWorkspace(path, collectionName, menu);
};



