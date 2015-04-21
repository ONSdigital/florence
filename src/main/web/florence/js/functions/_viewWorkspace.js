function viewWorkspace(path, collectionName, menu) {

  var currentPath = '';
  if (path) {
    currentPath = path;
  }
  var browserLocation;

  localStorage.removeItem("pageurl");

  // tentative reload of nav bar with collection name
  var mainNavHtml = templates.mainNav(collectionName);
  //console.log(collectionName)
  $('.wrapper').replaceWith(mainNavHtml);

  var workSpace = templates.workSpace(currentPath);
  $('.section').append(workSpace);

  //click handlers
  $('.nav--workspace').click(function () {

    $('.nav--workspace li').removeClass('selected');
    $(this).addClass('selected');

    //console.log('menu item clicked');

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

  //mini browser
  var browserContent = $('#iframe')[0].contentWindow;
  setTimeout(function() {
    $(browserContent.document).on('click', function(){
      browserLocation = browserContent.location.href;
      $('.browser-location').val(browserLocation);
    });
    $('.browser-location').val($('#iframe').attr('src'));

    var iframeUrl = localStorage.getItem("pageurl");
    var nowUrl = browserLocation;
    if (iframeUrl !== nowUrl) {
      localStorage.setItem("pageurl", nowUrl);
    }
  },100);

}
