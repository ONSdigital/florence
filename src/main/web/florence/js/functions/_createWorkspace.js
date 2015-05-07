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

  $('iframe').load(function() {
    var iframe = $('iframe');
    var browserLocation = iframe.contents().get(0).location.href;
    $('.browser-location').val(browserLocation);
    iframe.contents().on('click', 'a', Florence.Handler);
  });

  viewWorkspace(path, collectionName, menu);
}


