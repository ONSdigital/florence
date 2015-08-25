function editMarkdownWithNoTitle (collectionId, data, field, idField) {
  var list = data[field];

  var dataTemplate;
  if (idField === 'note') {
    dataTemplate = {list: list, idField: idField, header: 'Notes'};
  //} else if (idField === 'something else') {
  //  dataTemplate = {list: list, idField: idField, header: 'Something else'};
  } else {
    dataTemplate = {list: list, idField: idField, header: 'Content'};
  }

  var html = templates.editorContentNoTitle(dataTemplate);
  $('#'+ idField).replaceWith(html);
  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val()
      ;

       var saveContent = function(updatedContent) {
         data[field][index] = updatedContent;
         saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      var result = confirm("Are you sure you want to delete?");
      if (result === true) {
        $("#" + index).remove();
        data[field].splice(index, 1);
        saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
      }
    });
  });

  //Add
  $('#add-' + idField).one('click', function () {
    data[field].push("");
    saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

function saveMarkdownNoTitle (collectionId, path, data, field, idField) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            editMarkdownWithNoTitle(collectionId, data, field, idField);
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

