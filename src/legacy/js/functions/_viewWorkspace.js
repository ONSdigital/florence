function viewWorkspace(path, collectionId, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  Florence.globalVars.pagePath = currentPath;

  if (menu === 'browse') {
    $('.nav__item--workspace').removeClass('selected');
    $("#browse").addClass('selected');
    loadBrowseScreen(collectionId, 'click');
  }
  else if (menu === 'create') {
    $('.nav__item--workspace').removeClass('selected');
    $("#create").addClass('selected');
    loadCreateScreen(currentPath, collectionId);
  }
  else if (menu === 'edit') {
    $('.nav__item--workspace').removeClass('selected');
    $("#edit").addClass('selected');
    loadPageDataIntoEditor(currentPath, collectionId);
  }
}
