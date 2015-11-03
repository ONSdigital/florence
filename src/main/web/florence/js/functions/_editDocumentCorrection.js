/**
 * Manages corrections (versions)
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDocumentCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseCorrection(collectionId, data, templateData, field, idField);
  // New correction
  $("#add-" + idField).one('click', function () {
    if (!data[field]) {
      data[field] = [];
      templateData[field] = [];
    }
    saveNewCorrection(collectionId, data.uri, function (response) {
      var tmpDate = (new Date()).toISOString();
      data[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
      templateData[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
      saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      $("#add-" + idField).remove();
    }, function (response) {
      if (response.status === 409) {
        alert("You can add only one correction before publishing.");
      }
      else {
        handleApiError(response);
      }
    });
  });
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseCorrection(collectionId, data, templateData, field, idField);
}

function initialiseCorrection(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpCorr = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#correction-date_' + index).val(dateTmpCorr).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      templateData[field][index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
    });
    $('#' + idField + '-edit_' + index).click(function () {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
      var saveContent = function (updatedContent) {
        data[field][index].correctionNotice = updatedContent;
        templateData[field][index].correctionNotice = updatedContent;
        saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("Are you sure you want to delete this correction?");
      if (result === true) {
        deleteUnpublishedVersion(collectionId, data[field][index].uri, function () {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          data[field].splice(index, 1);
          templateData[field].splice(index, 1);
          saveCorrection(collectionId, data.uri, data, templateData, field, idField);
        }, function (response) {
          if (response.status === 400) {
            alert("You cannot delete a correction that has been published.");
          }
          else {
            handleApiError(response);
          }
        });
      }
    });
  });
}

function saveCorrection(collectionId, path, data, templateData, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshCorrection(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
    },
    function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

