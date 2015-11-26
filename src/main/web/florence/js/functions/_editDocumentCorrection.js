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
      // Enter a notice
      var editedSectionValue = {title: 'Correction notice', markdown: ''};
      var saveContent = function (updatedContent) {
        data[field][data[field].length - 1].correctionNotice = updatedContent;
        saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      $("#add-" + idField).remove();
    }, function (response) {
      if (response.status === 409) {
        sweetAlert("You can add only one correction before publishing.");
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
    // ORIGINAL TIME PICKER CODE
    // var dateTmpCorr = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    // $('#correction-date_' + index).val(dateTmpCorr).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
    //  data[field][index].updateDate = new Date($('#correction-date_' + index).datepicker('getDate')).toISOString();
    //  templateData[field][index].updateDate = new Date($('#correction-date_' + index).datepicker('getDate')).toISOString();
    //  saveCorrection(collectionId, data.uri, data, templateData, field, idField);
    // });


    var monthName = new Array();
    monthName[0] = "January";
    monthName[1] = "February";
    monthName[2] = "March";
    monthName[3] = "April";
    monthName[4] = "May";
    monthName[5] = "June";
    monthName[6] = "July";
    monthName[7] = "August";
    monthName[8] = "September";
    monthName[9] = "October";
    monthName[10] = "November";
    monthName[11] = "December";
    //var n = monthName[theDateTime.getMonth()];

    theDateTime = new Date(dateTmp);
    theYear = theDateTime.getFullYear();
    theMonth = monthName[theDateTime.getMonth()];
    theDay = addLeadingZero(theDateTime.getDate());
    theHours = addLeadingZero(theDateTime.getHours());
    theMinutes = theDateTime.getMinutes();
    //console.log(theHours +':'+ theMinutes);

    var dateTimeInputString = theDay + ' ' + theMonth + ' ' + theYear + ' ' + theHours +':' + theMinutes;

    function addLeadingZero(number){
      var number = '0' + number;
      number = number.slice(-2);
      return number;
    }

    $('#correction-date_' + index).val(dateTimeInputString).datetimepicker({
        dateFormat: 'dd MM yy',
        controlType: 'select',
        oneLine: true,
        timeFormat: 'HH:mm'
      });
    //$('#correction-date_' + index).datetimepicker('setDate', new Date(dateTmp));



    ///////////look at me

    $('body').on('click', '#done-button', function () {
      data[field][index].updateDate = new Date($('#correction-date_' + index).datetimepicker('getDate')).toISOString();
      templateData[field][index].updateDate = new Date($('#correction-date_' + index).datetimepicker('getDate')).toISOString();
      saveCorrection(collectionId, data.uri, data, templateData, field, idField);
    });



    $('#' + idField + '-edit_' + index).click(function () {
      var markdown = $('#' + idField + '-markdown_' + index).val();
      var editedSectionValue = {title: 'Correction notice', markdown: markdown};
      var saveContent = function (updatedContent) {
        data[field][index].correctionNotice = updatedContent;
        templateData[field][index].correctionNotice = updatedContent;
        saveCorrection(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete this correction?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result){
        if (result === true) {
          deleteUnpublishedVersion(collectionId, data[field][index].uri, function () {
            var position = $(".workspace-edit").scrollTop();
            Florence.globalVars.pagePos = position;
            $(this).parent().remove();
            data[field].splice(index, 1);
            templateData[field].splice(index, 1);
            saveCorrection(collectionId, data.uri, data, templateData, field, idField);
            swal({
              title: "Deleted",
              text: "This correction has been deleted",
              type: "success",
              timer: 2000
            });
          }, function (response) {
            if (response.status === 400) {
              sweetAlert("You cannot delete a correction that has been published.");
            }
            else {
              handleApiError(response);
            }
          });
        }
      });
    });
  });
}

function saveCorrection(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshCorrection(collectionId, data, templateData, field, idField);
      refreshPreview(data.uri);
    },
    function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

