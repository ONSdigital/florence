function viewWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }
  var browserLocation;

  localStorage.removeItem("pageurl");
  localStorage.setItem("pageurl", path || "/");

  // tentative reload of nav bar with collection name
  var mainNavHtml = templates.mainNav(collectionName);
  $('.wrapper').replaceWith(mainNavHtml);

  var workSpace = templates.workSpace(currentPath);
  $('.section').append(workSpace);

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

    if (menu === 'browse' || $(this).is('#browse')) {
      loadBrowseScreen();
    }
    else if (menu === 'create' || $(this).is('#create')) {
      loadCreateBulletinScreen(collectionName);
    }
    else if (menu === 'edit' || $(this).is('#edit')) {
      checkForPageChanged(function () {
        loadPageDataIntoEditor(collectionName, true);
      });
    }
    else if (menu === 'review' || $(this).is('#review')) {
      loadReviewScreen(collectionName);
      checkForPageChanged(function () {
        updateReviewScreen(collectionName);
      });
    }
    else {
      loadBrowseScreen();
    }
  });
  loadBrowseScreen();
}
