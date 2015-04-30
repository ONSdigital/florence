function createWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", currentPath);

  // tentative reload of nav bar with collection name
  var mainNavHtml = templates.mainNav(Florence);
  $('.admin-nav').replaceWith(mainNavHtml);

  var workSpace = templates.workSpace(path);
  $('.section').replaceWith(workSpace);

  setupIframeHandler();
  viewWorkspace(path, collectionName, menu);
}


