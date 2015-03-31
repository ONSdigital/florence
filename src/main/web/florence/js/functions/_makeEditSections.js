function makeEditSections(collectionName, response, path) {
    
  if (response.type === 'bulletin') {
    bulletinEditor(collectionName, response);
  } else {
    $('.fl-editor__sections').hide();
    $("#addSection").remove();
    $('.fl-editor__headline').show().val(JSON.stringify(response, null, 2));

    $('.fl-panel--editor__nav__save').unbind("click").click(function () {
      pageData = $('.fl-editor__headline').val();
      updateContent(collectionName, path, pageData);
    });

    $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
      pageData = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionName, path, pageData);
    });
  }

  $('.fl-panel--editor__nav__review').unbind("click").click(function () {
    postReview(collectionName, path);
  });
}
