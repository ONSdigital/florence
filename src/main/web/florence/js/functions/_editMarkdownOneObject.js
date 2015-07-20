function editMarkdownOneObject (collectionId, data, field) {
    var list = data[field];
    var html = templates.editorContentOne(list);
    $('#one').replaceWith(html);
  // Load
    $('#one-edit').click(function() {
      var editedSectionValue = $('#one-markdown').val();
      var saveContent = function(updatedContent) {
        data[field].markdown = updatedContent;
        saveMarkdownOne (collectionId, data.uri, data, field);
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#one-delete').click(function() {
      $(this).parent().remove();
      data[field] = {};
      saveMarkdownOne (collectionId, data.uri, data, field);
    });
}

function saveMarkdownOne (collectionId, path, data, field) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            editMarkdownOneObject (collectionId, data, field);
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

