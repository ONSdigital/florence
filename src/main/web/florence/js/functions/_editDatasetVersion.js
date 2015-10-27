/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDatasetVersion(collectionId, data, templateData, field, idField) {
  var downloadExtensions, uriUpload, file;
  var lastIndex = data[field].length;
  var uploadedNotSaved = {uploaded: false, saved: false, fileUrl: "", oldEdition: data.description.edition};

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  //Add
  if (data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csdb$/;
  } else if (data.type === 'dataset') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }

  function addTheVersion () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    $('#' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <label for="edition">Edition' +
      '      <textarea class="auto-size" type="text" id="edition"></textarea>' +
      '    </label>' +
      '    <input type="file" title="Select a file and click Submit" name="files">' +
      '    <br>' +
      '    <button type="submit" form="UploadForm" value="submit">Submit</button>' +
      '    <button class="btn-page-cancel" id="file-cancel">Cancel</button>' +
      '  </form>' +
      '  <div id="response"></div>' +
      '  <ul id="list"></ul>' +
      '</div>');

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#' + lastIndex).remove();
      if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
        data.description.edition = uploadedNotSaved.oldEdition;
        deleteContent(collectionId, uploadedNotSaved.fileUrl,
          onSuccess = function () {
          },
          onError = function (error) {
            handleApiError(error);
          }
        );
      }
      initialiseDatasetVersion(collectionId, data, templateData, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      var pageEdition = this[0].value;
      data.description.edition = pageEdition;
      file = this[1].files[0];
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

      //if (data[field] && data[field].length > 0) {
      //  $(data[field]).each(function (i, filesUploaded) {
      //    if (filesUploaded.file == safeUriUpload) {
      //      alert('This file already exists');
      //      $('#' + lastIndex).remove();
      //      editDatasetVersion(collectionId, data, templateData, field, idField);
      //      return;
      //    }
      //  });
      //}

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        alert('This file type is not supported');
        $('#' + lastIndex).remove();
        editDatasetVersion(collectionId, data, templateData, field, idField);
        return;
      }

      if (pageEdition.length < 4) {
        alert("This is not a valid file title");
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            uploadedNotSaved.uploaded = true;
            uploadedNotSaved.fileUrl = safeUriUpload;
            // create the new version/correction
            saveNewCorrection(collectionId, data.uri, function (response) {
              var tmpDate = (new Date()).toISOString();           // it could use releaseDate
              if (idField === "correction") {
                data[field].push({correctionNotice: " ", updateDate: tmpDate, uri: response});
                templateData.push({correctionNotice: " ", updateDate: tmpDate, uri: response});
              } else {
                data[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
                templateData.push({correctionNotice: "", updateDate: tmpDate, uri: response});
              }
              data.downloads = [{file: fileNameNoSpace}];
              uploadedNotSaved.saved = true;
              refreshDatasetVersion(collectionId, data, templateData, field, idField);
              $("#add-" + idField).remove();
            }, function (response) {
              if (response.status === 409) {
                alert("You can add only one correction before publishing.");
              }
              else if (response.status === 404) {
                alert("You can only add corrections to content that has been published.");
              }
              else {
                handleApiError(response);
              }
            });
          }
        });
      }
    });
  };
  addTheVersion();
}

function refreshDatasetVersion(collectionId, data, templateData, field, idField) {
  var list = templateData;
  var dataTemplate = {list: list, idField: idField};
  if (idField === "correction") {
    var html = templates.workEditT8CorrectionList(dataTemplate);
  } else {
    var html = templates.workEditT8VersionList(dataTemplate);
  }
  $('#' + idField).replaceWith($(html));
  initialiseDatasetVersion(collectionId, data, templateData, field, idField);
}

function initialiseDatasetVersion(collectionId, data, templateData, field, idField) {
  // Load
  var list = templateData;
  var dataTemplate = {list: list, idField: idField};
  if (idField === "correction") {
    var html = templates.workEditT8CorrectionList(dataTemplate);
  } else {
    var html = templates.workEditT8VersionList(dataTemplate);
  }
  $('#sortable-' + idField).replaceWith(html);
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      templateData[index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      saveDatasetVersion(collectionId, data.uri, data, templateData, field, idField);
    });
    $('#' + idField + '-edit_' + index).click(function () {
      var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
      var saveContent = function (updatedContent) {
        data[field][index].correctionNotice = updatedContent;
        templateData[index].correctionNotice = updatedContent;
        saveDatasetVersion(collectionId, data.uri, data, templateData, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("Are you sure you want to delete this correction?");
      if (result === true) {
        var uriToDelete = $(this).parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
        var oldPageData;
        getPageData(collectionId, uriToDelete,
          success = function (response) {
            oldPageData = response;
            deleteUnpublishedVersion(collectionId, uriToDelete, function () {
              var position = $(".workspace-edit").scrollTop();
              Florence.globalVars.pagePos = position;
              $(this).parent().remove();
              data = oldPageData;
              templateData = $.extend(true, {}, data);
              saveDatasetVersion(collectionId, data.uri, data, templateData, field, idField);
            }, function (response) {
              if (response.status === 404) {
                alert("You cannot delete a correction that has been published.");
              }
              else {
                handleApiError(response);
              }
            });
          },
          error = function (response) {
            handleApiError(response);
          }
        );
      }
    });
  });
}

function saveDatasetVersion(collectionId, path, data, templateData, field, idField) {
  //Updates release date of dataset. Not compatible with delete
  //data.description.releaseDate = data[field][data[field].length - 1].updateDate;
  postContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshDatasetVersion(collectionId, data, templateData, field, idField);
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

