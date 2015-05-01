function makeEditSections(collectionId, pageData) {

  var html = templates.workEdit(pageData);
  $('.workspace-menu').html(html);

  if (pageData.type === 'bulletin') {
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else {

    var workspace_menu_sub_edit =
      '<section class="workspace-edit">' +
      '     <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 728px" cols="104"></textarea>' +
      '     <nav class="edit-nav">' +
      '     </nav>' +
      '  </section>';

    $('.workspace-menu').html(workspace_menu_sub_edit);

    $('.fl-editor__headline').val(JSON.stringify(pageData, null, 2));

    refreshEditNavigation();

    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
      pageData = $('.fl-editor__headline').val();
      updateContent(collectionId, getPathName(), pageData);
    });

    // complete
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      pageData = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionId, getPathName(), pageData);
    });

    // review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      postReview(collectionId, getPathName());
    });

    $('.workspace-edit :input').on('input', function () {
      Florence.Editor.isDirty = true;
      // remove the handler now we know content has changed.
      $(':input').unbind('input');
      //console.log('Changes detected.');
    });
  }
}

function refreshEditNavigation() {
  getCollection(Florence.collection.id,
    success = function (collection) {
      var pagePath = getPathName();
      var pageFile = pagePath + '/data.json';
      var lastCompletedEvent = getLastCompletedEvent(collection, pageFile);
      var isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === localStorage.getItem("loggedInAs"));

      var editNav = templates.editNav({isPageComplete: isPageComplete});
      $('.editNav').html(editNav);
    },
    error = function (response) {
      handleApiError(response);
    })
}