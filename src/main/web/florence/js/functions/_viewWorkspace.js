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
    loadCreateBulletinScreen(collectionName);
  }
  else if (menu === 'edit') {
    $('.nav--workspace li').removeClass('selected');
    $("#edit").addClass('selected');
    loadPageDataIntoEditor(path, collectionName);
  }
  else if (menu === 'review') {
    $('.nav--workspace li').removeClass('selected');
    $("#review").addClass('selected');
    loadReviewScreen(collectionName);
    checkForPageChanged(updateReviewScreen(collectionName));
  }

  //click handlers
  $('.nav--workspace > li').click(function () {
    menu = '';
    $('.nav--workspace li').removeClass('selected');
    $(this).addClass('selected');

    if (Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result === true) {
        Florence.Editor.isDirty = false;
      } else {
        return false;
      }
    }

    if ($(this).is('#browse')) {
      loadBrowseScreen('click');
    }
    else if ($(this).is('#create')) {
      loadCreateBulletinScreen(collectionName);
    }
    else if ($(this).is('#edit')) {
      loadPageDataIntoEditor(getPathName(document.getElementById('iframe').contentWindow.location.href), Florence.collection.id);
    }
    else if ($(this).is('#review')) {
      loadReviewScreen(collectionName);
      checkForPageChanged(updateReviewScreen(collectionName));
    }
    else {
      loadBrowseScreen();
    }
  });
}

