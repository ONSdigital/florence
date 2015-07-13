function editLink (collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = {
        "title": $('#' + idField +'-uri_' + index).val(),
        "markdown": $('#' + idField + '-markdown_' + index).val()
      };

       var saveContent = function(updatedContent) {
         data[field][index].title = updatedContent;                         //markdown
         data[field][index].uri = $('#' + idField +'-uri_' + index).val();
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
  $('#add-' + idField).click(function () {
    var position = $(".workspace-edit").scrollTop();
    localStorage.setItem("pagePos", position + 300);
    data[field].push({uri:"", title:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

