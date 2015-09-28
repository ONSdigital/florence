function editCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseCorrection(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createCorrectionTemplate(idField, list);
  var html = templates.editorCorrection(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseCorrection(collectionId, data, templateData, field, idField);
}

function initialiseCorrection(collectionId, data, templateData, field, idField) {
  // Load
  $('#' + idField + '-edit_' + index).click(function () {
    var editedSectionValue = {
      "title": $('#' + idField + '-uri_' + index).val(),
      "markdown": $('#' + idField + '-markdown_' + index).val()
    };

    var saveContent = function (updatedContent) {
      data[field][index].title = updatedContent;                         //markdown
      data[field][index].uri = $('#' + idField + '-uri_' + index).val();
      saveLink(collectionId, data.uri, data, field, idField);
      refreshPreview(data.uri);
    };

    loadMarkdownEditor(editedSectionValue, saveContent, data);
  });

  // Delete
  $('#' + idField + '-delete_' + index).click(function () {
    var result = confirm("Are you sure you want to delete this correction?");
    if (result === true) {
      var position = $(".workspace-edit").scrollTop();
      Florence.globalVars.pagePos = position;
      $(this).parent().remove();
      data[field].splice(index, 1);
      templateData[field].splice(index, 1);
      postContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Florence.Editor.isDirty = false;
          refreshPreview(data.uri);
          refreshCorrection(collectionId, data, templateData, field, idField)
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
  });

  //Add
  $('#add-' + idField).click(function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 300;
    data[field].push({uri: "", title: ""});                         //change this to the correct json structure
    saveLink(collectionId, data.uri, data, field, idField);
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}



