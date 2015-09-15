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
  $('#' + idField).replaceWith(html);
  // Load
  $('#content-edit').click(function() {
    var editedSectionValue = $('#content-markdown').val();

    var saveContent = function(updatedContent) {
      data[field] = [updatedContent];
      saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
    };
    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#content-delete').click(function() {
    var result = confirm("Are you sure you want to delete?");
    if (result === true) {
      $(this).parent().remove();
      data[field] = [];
      saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
    }
  });

}

function saveMarkdownNoTitle (collectionId, path, data, field, idField) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            editMarkdownWithNoTitle(collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                alert("Cannot edit this page. It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}

