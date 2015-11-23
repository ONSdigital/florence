/**
 * Manages markdown content (saves an object)
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param title - header to appear in the editor
 */

function editMarkdownOneObject (collectionId, data, field, title) {
  var list = data[field];

  var dataTemplate;
  if (title) {
    dataTemplate = {list: list, header: title};
  } else {
    dataTemplate = {list: list, header: 'Content'};
  }

  var html = templates.editorContentOne(dataTemplate);
  $('#one').replaceWith(html);
  // Load
  $('#one-edit').click(function() {
    var markdown = $('#one-markdown').val();
    var editedSectionValue = {title: 'Content', markdown: markdown};
    var saveContent = function(updatedContent) {
      data[field].markdown = updatedContent;
      saveMarkdownOne (collectionId, data.uri, data, field);
    };

    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#one-delete').click(function() {
    swal ({
      title: "Warning",
      text: "Are you sure you want to delete?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function(result) {
      if (result === true) {
        $(this).parent().remove();
        data[field] = {};
        saveMarkdownOne(collectionId, data.uri, data, field);
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

function saveMarkdownOne (collectionId, path, data, field) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
      editMarkdownOneObject (collectionId, data, field);
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

