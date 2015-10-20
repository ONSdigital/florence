/**
 * Manages corrections (versions)
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editCorrection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  runDatePickerVersions(dataTemplate);
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseCorrection(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function runDatePickerVersions(dataTemplate) {
  if(dataTemplate && dataTemplate.list) {
    var countSections = dataTemplate.list.length;
    var i = 0;
    while (i < countSections) {
      var tmpDate = dataTemplate.list[i].date;
      dataTemplate.list[i].date = $.datepicker.formatDate('dd MM yy', new Date(tmpDate));
      i++;
    }
  }
}

function refreshNoteMarkdown(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorDate(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseNoteMarkdown(collectionId, data, templateData, field, idField)
}

function initialiseNoteMarkdown(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    if (!data[field][index].date) {
      $('#date_' + index).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        data[field][index].date = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
        templateData[field][index].date = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = data[field][index].date;
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        data[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
        templateData[field][index].date = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      });
    }
    $('#' + idField + '-edit_' + index).click(function () {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
      var saveContent = function (updatedContent) {
        data[field][index].correctionNotice = updatedContent;
        templateData[field][index].correctionNotice = updatedContent;
        saveNoteMarkdown(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
  });
}

function saveNoteMarkdown(collectionId, path, data, templateData, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
      refreshNoteMarkdown(collectionId, data, templateData, field, idField);
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

