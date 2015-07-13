function editMarkdownWithNoTitle (collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val()
      ;

       var saveContent = function(updatedContent) {
         data[field][index].markdown = updatedContent;
         updateContent(collectionId, getPathName(), JSON.stringify(data));
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      $("#"+index).remove();
      data[field].splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add
  $('#add-' + idField).one('click', function () {
    data[field].push("");
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

