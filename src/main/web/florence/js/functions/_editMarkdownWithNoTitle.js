/**
 * Manages markdown content (saves an array)
 * @param collectionId
 * @param data
 * @param field - JSON data key
 */

function editMarkdownWithNoTitle (collectionId, data, field, idField) {
  var list = data[field];

  var dataTemplate;
  if (idField === 'note') {
    dataTemplate = {list: list, idField: idField, header: 'Notes'};
  } else if (idField === 'prerelease') {
    dataTemplate = {list: list, idField: idField, header: 'Pre-release access'};
  } else {
    dataTemplate = {list: list, idField: idField, header: 'Content'};
  }

  var html = templates.editorContentNoTitle(dataTemplate);
  $('#' + idField).replaceWith(html);
  // Load
  $('#content-edit').click(function() {
    var markdown = $('#content-markdown').val();
    var editedSectionValue = {title: 'Content', markdown: markdown};
    var saveContent = function(updatedContent) {
      data[field] = [updatedContent];
      saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
    };
    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#content-delete').click(function() {
    swal ({
      title: "Warning",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function(result){
      if (result === true) {
        $(this).parent().remove();
        data[field] = [];
        saveMarkdownNoTitle(collectionId, data.uri, data, field, idField);
        swal({
          title: "Deleted",
          text: "This " + idField + " has been deleted",
          type: "success",
          timer: 2000
        });
      }
    });
  });

}

function saveMarkdownNoTitle (collectionId, path, data, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            editMarkdownWithNoTitle(collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}

