function makeEditSections(collectionId, response) {
  if (response.type === 'bulletin') {
    var html = templates.workEdit(response);
    $('.workspace-menu').empty();
    $('.workspace-menu').append(html);
    accordion();
    bulletinEditor(collectionId, response);
  }

  else if (response.type === 'article') {
    var html = templates.workEdit(response);
    $('.workspace-menu').empty();
    $('.workspace-menu').append(html);
    accordion();
    articleEditor(collectionId, response);
  }

  else if (response.type === 'dataset') {
    var html = templates.workEdit(response);
    $('.workspace-menu').empty();
    $('.workspace-menu').append(html);
    accordion();
    datasetEditor(collectionId, response);
  }

  else {
    var workspace_menu_sub_edit =
        '<section class="workspace-edit">' +
        '     <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 728px" cols="104"></textarea>' +
        '     <nav class="edit-nav">' +
        '       <button class="btn-edit-cancel">Cancel</button>' +
        '       <button class="btn-edit-save">Save</button>' +
        '       <button class="btn-edit-save-and-submit-for-review">Save and submit for review</button>' +
        '     </nav>' +
        '  </section>'
          //'  <nav class="fl-panel--editor__nav">' +
          //'    <button class="fl-panel--editor__nav__cancel">Cancel</button>' +
          //'    <button class="fl-panel--editor__nav__save">Save</button>' +
          //'    <button class="fl-panel--editor__nav__complete" style="display: none;">Save and submit for internal review</button>' +
          //'    <button class="fl-panel--editor__nav__review" style="display: none;">Save and submit for approval</button>' +
          //'  </nav>' +
        ;

    $('.workspace-menu').html(workspace_menu_sub_edit);

    $('.fl-editor__headline').val(JSON.stringify(response, null, 2));

    //  $('.fl-panel--editor__nav__save').unbind("click").click(function () {
    //    pageData = $('.fl-editor__headline').val();
    //    updateContent(collectionId, getPathName(), pageData);
    //  });
    //
    //  // complete
    //  $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
    //    pageData = $('.fl-editor__headline').val();
    //    saveAndCompleteContent(collectionId, getPathName(), pageData);
    //  });
    //}
    //
    //$('.fl-panel--editor__nav__review').unbind("click").click(function () {
    //  postReview(collectionId, getPathName());
    //});

    $('.workspace-edit :input').on('input', function () {
      Florence.Editor.isDirty = true;
      // remove the handler now we know content has changed.
      $(':input').unbind('input');
      //console.log('Changes detected.');
    });
  }
}