/**
 * Manages dates for release calendar
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDate(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  runDatePicker(dataTemplate);
  var html = templates.editorDate(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseNoteMarkdown(collectionId, data, templateData, field, idField);
}

function runDatePicker(dataTemplate) {
  if(dataTemplate && dataTemplate.list) {
    var countSections = dataTemplate.list.length;
    var i = 0;
    while (i < countSections) {
      var tmpDate = dataTemplate.list[i].previousDate;
      dataTemplate.list[i].previousDate = $.datepicker.formatDate('dd MM yy', new Date(tmpDate));
      i++;
    }
  }
}

function refreshNoteMarkdown(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  runDatePicker(dataTemplate);
  var html = templates.editorDate(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseNoteMarkdown(collectionId, data, templateData, field, idField)
}

function initialiseNoteMarkdown(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    $('#' + idField + '-note_' + index).click(function () {
      var markdown = $('#' + idField + '-markdown_' + index).val();
      var editedSectionValue = {title: 'Note', markdown: markdown};
      var saveContent = function (updatedContent) {
        data[field][index].changeNotice = updatedContent;
        templateData[field][index].changeNotice = updatedContent;
        saveNoteMarkdown(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
  });
}

function saveNoteMarkdown(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function () {
      Florence.Editor.isDirty = false;
      refreshNoteMarkdown(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
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

