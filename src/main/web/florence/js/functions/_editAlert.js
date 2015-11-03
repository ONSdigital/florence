/**
 * Manages alerts
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editAlert(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorAlert(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseAlert(collectionId, data, templateData, field, idField);
  // New alert
  $("#add-" + idField).click(function () {
    if (!data[field]) {
      data[field] = [];
      templateData[field] = [];
    }
    var tmpDate = (new Date()).toISOString();
    data[field].push({markdown: "", date: tmpDate, type: "alert"});
    templateData[field].push({markdown: "", date: tmpDate, type: "alert"});
    saveAlert(collectionId, data.uri, data, templateData, field, idField);
  });
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshAlert(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorAlert(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseAlert(collectionId, data, templateData, field, idField);
}

function initialiseAlert(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].date;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      templateData[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
    });
    $('#' + idField + '-edit_' + index).click(function () {
      var editedSectionValue = data[field][index].markdown;
      var saveContent = function (updatedContent) {
        data[field][index].markdown = updatedContent;
        templateData[field][index].markdown = updatedContent;
        saveAlert(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });

    var correctionCheck;
    if (data[field][index].type === 'correction') {
      correctionCheck = 'checked';
    } else if (data[field][index].type === 'alert') {
      correctionCheck = 'unchecked';
    }

    if (data.type === 'dataset_landing_page' || data.type === 'compendium_landing_page') {
      $('#correction-container').append('<label for="correction-alert">Correction' +
        '<input id="correction-alert" type="checkbox" value="value" ' + correctionCheck + '/></label>');
    }

    $('#correction-container input:checkbox').change(function () {
      if ($(this).prop('checked') === true) {
        data[field][index].type = 'correction';
      }
      else {
        data[field][index].type = 'alert';
      }
      saveAlert(collectionId, data.uri, data, templateData, field, idField);
    });

    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("Are you sure you want to delete this alert?");
      if (result === true) {
        var position = $(".workspace-edit").scrollTop();
        Florence.globalVars.pagePos = position;
        $(this).parent().remove();
        data[field].splice(index, 1);
        templateData[field].splice(index, 1);
        saveAlert(collectionId, data.uri, data, templateData, field, idField);
      }
    });
  });
  function sortable() {
    $('#sortable-' + idField).sortable();
  }

  sortable();

}

function saveAlert(collectionId, path, data, templateData, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
      refreshAlert(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
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

