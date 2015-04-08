function makeEditSections(collectionName, response) {
  if (response.type === 'bulletin') {
    loadEditT4Screen(collectionName);
    bulletinEditor(collectionName, response);
  }

  else if (response.type === 'article') {
    loadEditT4Screen(collectionName);
    articleEditor(collectionName, response);
  }

  else if (response.type === 'dataset') {
<<<<<<< HEAD
    loadEditDatasetScreen(collectionName);
=======
>>>>>>> 2e64f37... Refactoring html
    datasetEditor(collectionName, response);
  }

  else {
    var workspace_menu_sub_edit =
        '<section class="fl-panel fl-panel--editor">' +
        '  <section style="overflow: scroll;" class="fl-editor">' +
        '     <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 800px"></textarea>' +
        '  </section>' +
        '  <nav class="fl-panel--editor__nav">' +
        '    <button class="fl-panel--editor__nav__cancel">Cancel</button>' +
        '    <button class="fl-panel--editor__nav__save">Save</button>' +
        '    <button class="fl-panel--editor__nav__complete">Save and submit for internal review</button>' +
        '    <button class="fl-panel--editor__nav__review">Save and submit for approval</button>' +
        '  </nav>' +
        '</section>';

    $('.fl-panel--sub-menu').html(workspace_menu_sub_edit);

    $('.fl-editor__headline').val(JSON.stringify(response, null, 2));

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
