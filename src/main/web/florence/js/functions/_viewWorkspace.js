function viewWorkspace(path, collectionId, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }
  var safePath = checkPathSlashes(currentPath);

  Florence.globalVars.pagePath = safePath;

  if (menu === 'browse') {
    $('.nav--workspace li').removeClass('selected');
    $("#browse").addClass('selected');
    loadBrowseScreen(collectionId);
  }
  else if (menu === 'create') {
    $('.nav--workspace li').removeClass('selected');
    $("#create").addClass('selected');
    loadCreateScreen(collectionId);
  }
  else if (menu === 'edit') {
    $('.nav--workspace li').removeClass('selected');
    $("#edit").addClass('selected');
    loadPageDataIntoEditor(safePath, collectionId);
  }
}

