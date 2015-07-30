function editLink (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorLinks(dataTemplate);
  $('#'+ idField).replaceWith(html);

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
        saveLink (collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      var result = confirm("Are you sure you want to delete?");
      if (result === true) {
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position + 300;
        $(this).parent().remove();
        data[field].splice(index, 1);
        saveLink(collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      }
    });
  });

  //Add
  $('#add-' + idField).click(function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 300;
    data[field].push({uri:"", title:""});
    saveLink (collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

function saveLink (collectionId, path, data, field, idField) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function (response) {
            Florence.Editor.isDirty = false;
            editLink (collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                alert("Cannot edit this file. It is already part of another collection.");
            }
            else if (response.status === 401) {
                alert("You are not authorised to update content.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}