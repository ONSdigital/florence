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
    loadBrowseScreen();
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

  //click handlers
  $('.nav--workspace > li').click(function () {
    menu = '';
    if (Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result === true) {
        Florence.Editor.isDirty = false;
        processMenuClick(this);
      } else {
        return false;
      }
    } else {
      processMenuClick(this);
    }

  });

  function processMenuClick(clicked) {

    var menuItem = $(clicked);

    $('.nav--workspace li').removeClass('selected');
    menuItem.addClass('selected');

    if (menuItem.is('#browse')) {
      loadBrowseScreen('click');
    } else if (menuItem.is('#create')) {
      loadCreateScreen(collectionName);
    } else if (menuItem.is('#edit')) {
      loadPageDataIntoEditor(getPathName(document.getElementById('iframe').contentWindow.location.href), Florence.collection.id);
    } else {
      loadBrowseScreen();
    }
  }
}

