function viewWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", currentPath);

  if (menu === 'browse') {
    $('.nav--workspace li').removeClass('selected');
    $("#browse").addClass('selected');
    loadBrowseScreen(collectionName);
  }
  else if (menu === 'create') {
    $('.nav--workspace li').removeClass('selected');
    $("#create").addClass('selected');
    loadCreateScreen(collectionName);
  }
  else if (menu === 'edit') {
    $('.nav--workspace li').removeClass('selected');
    $("#edit").addClass('selected');
    loadPageDataIntoEditor(path, collectionName);
  }


}

