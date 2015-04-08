function makeEditSections(collectionName, response) {
  if (response.type === 'bulletin') {
    bulletinEditor(collectionName, response);
  }

  else if (response.type === 'article') {
    articleEditor(collectionName, response);
  }

  else {
    $('#accordion').hide();
    $('.fl-editor__headline').show().val(JSON.stringify(response, null, 2));

    $('.fl-panel--editor__nav__save').unbind("click").click(function () {
      pageData = $('.fl-editor__headline').val();
      updateContent(collectionName, getPathName(), pageData);
    });

    // complete
    $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
      pageData = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionName, getPathName(), pageData);
    });
  }

  $('.fl-panel--editor__nav__review').unbind("click").click(function () {
    postReview(collectionName, getPathName());
  });


}
