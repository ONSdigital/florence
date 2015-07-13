function editMarkdownOneObject (collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index, section){

    $('#' + idField + '-edit_'+index).click(function() {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val();

      var saveContent = function(updatedContent) {
        data[field].markdown = updatedContent;
        updateContent(collectionId, data.uri, JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_' + index).click(function() {
      $("#"+index).remove();
      data[field] = {};
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });
  });

  //Add
  if (!data[field] || $.isEmptyObject(data[field])) {
    $('#add-' + idField).one('click', function () {
      data[field] = {markdown:""};
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });
  } else {
    $('#add-' + idField).one('click', function () {
      alert('At the moment you can have one section here.')
    });
  }
}

