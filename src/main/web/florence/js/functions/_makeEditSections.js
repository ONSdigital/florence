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

    //$('.btn-edit-save').click(function () {
    //  updateContent(collectionName, getPathName(), JSON.stringify(data));
    //});
    //
    //// complete
    //$('.btn-edit-save-and-submit-for-review').click(function () {
    //  //pageData = $('.fl-editor__headline').val();
    //  saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
    //});
    //
    //// review
    //$('.btn-edit-save-and-submit-for-review').click(function () {
    //  saveAndReviewContent(collectionName, getPathName(), JSON.stringify(data));
    //});

    $('.workspace-edit :input').on('input', function () {
      Florence.Editor.isDirty = true;
      // remove the handler now we know content has changed.
      $(':input').unbind('input');
      //console.log('Changes detected.');
    });
  }
}