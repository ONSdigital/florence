function editMarkdown (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorContent(dataTemplate);
  $('#'+ idField).replaceWith(html);
  initialiseMarkdown(collectionId, data, field, idField)
}

function refreshMarkdown (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorContent(dataTemplate);
  $('#sortable-'+ idField).replaceWith($(html).find('#sortable-'+ idField));
  initialiseMarkdown(collectionId, data, field, idField)
}

function initialiseMarkdown(collectionId, data, field, idField) {
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
        saveMarkdown (collectionId, data.uri, data, field, idField);
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
        saveMarkdown(collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      }
    });
  });

  //Add
  $('#add-' + idField).off().one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 300;
    data[field].push({markdown:"", title:""});
    saveMarkdown(collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

function saveMarkdown (collectionId, path, data, field, idField) {
    postContent(collectionId, path, JSON.stringify(data),
        success = function () {
            Florence.Editor.isDirty = false;
            refreshMarkdown (collectionId, data, field, idField);
            refreshChartList(data, collectionId);
            refreshTablesList(data, collectionId);
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

