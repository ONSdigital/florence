/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('version' or 'correction')
 */

function editDatasetVersion(collectionId, data, templateData, field, idField) {
  var downloadExtensions, uriUpload, file;
  var lastIndex = data[field].length;
  var uploadedNotSaved = {uploaded: false, saved: false, fileUrl: "", oldLabel: data.description.versionLabel};

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  //Add
  if (data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csdb$/;
  } else if (data.type === 'dataset') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }

  function addTheVersion() {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    $('#' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <textarea class="auto-size" type="text" placeholder="Add a label here (E.g. Revised, Final, etc" id="label"></textarea>' +
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
        data.description.versionLabel = uploadedNotSaved.oldLabel;
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

      var versionLabel = this[0].value;
      file = this[1].files[0];
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

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

      if (versionLabel.length < 4) {
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
            saveNewCorrection(collectionId, data.uri,
              function (response) {
                var tmpDate = (new Date()).toISOString();           // it could use releaseDate
                if (idField === "correction") {
                  data[field].push({
                    correctionNotice: " ",
                    updateDate: data.description.releaseDate,
                    uri: response,
                    label: versionLabel
                  });
                } else {
                  data[field].push({
                    correctionNotice: "",
                    updateDate: data.description.releaseDate,
                    uri: response,
                    label: versionLabel
                  });
                }
                data.downloads = [{file: fileNameNoSpace}];
                data.description.releaseDate = tmpDate;
                data.description.versionLabel = versionLabel;
                uploadedNotSaved.saved = true;
                saveDatasetVersion(collectionId, data.uri, data, field, idField);
                $("#add-" + idField).remove();
              }, function (response) {
                if (response.status === 409) {
                  alert("You can add only one " + idField + " before publishing.");
                }
                else if (response.status === 404) {
                  alert("You can only add " + idField + "s to content that has been published.");
                }
                else {
                  handleApiError(response);
                }
              }
            );
          }
        });
      }
    });
  }
  addTheVersion();
}

function refreshDatasetVersion(collectionId, data, field, idField) {
  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, version) {
    var dfd = $.Deferred();
    if (version.correctionNotice) {
      templateData[field][index].type = true;
    } else {
      templateData[field][index].type = false;
    }
    templateData[field][index].label = version.label;
    dfd.resolve();
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    initialiseDatasetVersion(collectionId, data, templateData, field, idField);
    initialiseDatasetVersion(collectionId, data, templateData, field, idField);
  });

}

function initialiseDatasetVersion(collectionId, data, templateData, field, idField) {
  // Load
  var list = templateData[field];
  var correction;
  if (idField === 'correction') {
    correction = true;
  } else {
    correction = false;
  }
  var dataTemplate = {list: list, idField: idField, correction: correction};
  var html = templates.workEditT8CorrectionList(dataTemplate);
  $('#sortable-' + idField).replaceWith(html);
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
      saveDatasetVersion(collectionId, data.uri, data, field, idField);
    });
    if (idField === 'correction') {
      $('#' + idField + '-edit_' + index).click(function () {
        var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
        var saveContent = function (updatedContent) {
          data[field][index].correctionNotice = updatedContent;
          saveDatasetVersion(collectionId, data.uri, data, field, idField);
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      });
    }
    $('#' + idField + '-edit-label_' + index).click(function () {
      var editedSectionValue = $('#' + idField + '-markdown-label_' + index).val();
      var saveContent = function (updatedContent) {
        data[field][index].label = updatedContent;
        saveDatasetVersion(collectionId, data.uri, data, field, idField);
      };
      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("Are you sure you want to delete this " + idField + "?");
      if (result === true) {
        var pathToDelete = data.uri;
        var fileToDelete = data.downloads[0].file;  //Saves always the latest
        var uriToDelete = $(this).parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
        deleteUnpublishedVersion(collectionId, uriToDelete, function () {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          // delete uploaded file
          deleteContent(collectionId, fileToDelete, function () {
            console.log("File deleted");
          }, function (error) {
            handleApiError(error);
          });
          // delete modified data.json and revert to pubished
          deleteContent(collectionId, pathToDelete, function () {
            loadPageDataIntoEditor(pathToDelete, collectionId);
            refreshPreview(pathToDelete);
          }, function (error) {
            handleApiError(error);
          });
        }, function (response) {
          if (response.status === 404) {
            alert("You cannot delete a " + idField + " that has been published.");
          }
          else {
            handleApiError(response);
          }
        });
      }
    });
  });
}

function saveDatasetVersion(collectionId, path, data, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshDatasetVersion(collectionId, data, field, idField);
      refreshPreview(path);
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

