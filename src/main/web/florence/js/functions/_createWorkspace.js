function createWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", currentPath);

  Florence.refreshAdminMenu();

  var workSpace = templates.workSpace(Florence.tredegarBaseUrl + '/' + path);
  $('.section').html(workSpace);

  setupIframeHandler();
  viewWorkspace(path, collectionName, menu);
}


