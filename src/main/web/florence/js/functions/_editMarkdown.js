function editMarkdown (collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = {
        "title": $('#' + idField +'-title_' + index).val(),
        "markdown": $('#' + idField + '-markdown_' + index).val()
      };

       var saveContent = function(updatedContent) {
         data[field][index].markdown = updatedContent;
         data[field][index].title = $('#' + idField +'-title_' + index).val();
         updateContent(collectionId, getPathName(), JSON.stringify(data));
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      var position = $(".workspace-edit").scrollTop();
      localStorage.setItem("pagePos", position + 300);
      $("#"+index).remove();
      data[field].splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add
  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    localStorage.setItem("pagePos", position + 300);
    data[field].push({markdown:"", title:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

