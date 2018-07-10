/**
 * Manage correction of documents with files attached (compendium_data, article_download)
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('correction')
 */

function editDocWithFilesCorrection(collectionId, data, field, idField) {
  var downloadExtensions, file;
  if (!data[field]) {
    data[field] = [];
  }
  var oldFile = $.extend(true, {}, data);
  var uploadedNotSaved = {uploaded: false, saved: false, files: oldFile.downloads};
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
  //Add file types
  if (data.type === 'compendium_data'){
    downloadExtensions = /\.csv$|.xls$|.xlsx$|.zip$/;
  }
  else if (data.type === 'article_download'){
    downloadExtensions = /\.pdf$/;
  }

  refreshDocWithFilesCorrection(collectionId, data, field, idField);


  $("#add-" + idField).one('click', function () {

    $("#add-" + idField).parent().append('<button class="btn-page-delete"' +
      ' id="cancel-correction">Cancel</button>');
    //Display the list of uploaded files in the ref table
    var list = data.downloads;
    var html = templates.editorDocWithFiles(list);
    $('#sortable-correction').append(html);

    //Update the files to be corrected
    $(data.downloads).each(function (index) {
      $('#correction-upload_' + index).click(function () {
        fileCorrection(index);
      }).children().click(function (e) {
        e.stopPropagation();
      });
    });

    //Cancel the correction
    $('#cancel-correction').click(function () {
      //Check the files uploaded
      var filesToDelete = checkFilesUploaded (uploadedNotSaved.files, data.downloads);
      if (filesToDelete) {
        _.each(filesToDelete, function (file) {
          var fileToDelete = data.uri + file;
          deleteContent(collectionId, fileToDelete);
        });
      }
      loadPageDataIntoEditor(data.uri, collectionId);
      refreshPreview(data.uri);
    });

    //Save the correction
    $("#add-" + idField).html("Save correction").on().click(function () {
      saveNewCorrection(collectionId, data.uri,
        function (response) {
          var tmpDate = (new Date()).toISOString();           // it could use releaseDate
          data[field].push({
            correctionNotice: "",
            updateDate: tmpDate,
            uri: response
          });
          uploadedNotSaved.saved = true;
          $("#add-" + idField).parents('.edit-section__content').remove('#sortable-' + idField)
            .find('.text-center').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');  //check .after()
          // Enter a notice
          var editedSectionValue = {title: 'Enter correction notice', markdown: ''};
          var saveContent = function (updatedContent) {
            data[field][data[field].length - 1].correctionNotice = updatedContent;
            saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
          };
          loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
          //saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
        }, function (response) {
          if (response.status === 409) {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            sweetAlert("You can add only one " + idField + " before publishing.");
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
          else if (response.status === 404) {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            data.downloads = uploadedNotSaved.files;
            sweetAlert("You can only add " + idField + "s to content that has been published.");
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
          else {
            //Revert to condition before error
            var filesToDelete = checkFilesUploaded(uploadedNotSaved.files, data.downloads);
            if (filesToDelete) {
              _.each(filesToDelete, function (download) {
                var fileToDelete = data.uri + '/' + download;
                deleteContent(collectionId, fileToDelete);
              });
            }
            handleApiError(response);
            refreshDocWithFilesCorrection(collectionId, data, field, idField);
          }
        }
      );
    });
  });

  function fileCorrection(index) {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    var html = templates.uploadFileForm(index);
    $('#correction-filename_show_' + index).append(html);

    $('#file-cancel').one('click', function (e) {
      e.preventDefault();
      $('#' + index).remove();
      if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
        data.downloads[index].file = uploadedNotSaved.files[index].file;
        var fileToDelete = data.uri + '/' + uploadedNotSaved.files[index].file;
        deleteContent(collectionId, fileToDelete);
      }
      refreshDocWithFilesCorrection(collectionId, data, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      file = this[0].files[0];
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        alert('This file type is not supported');
        $('#' + index).remove();
        editDocWithFilesCorrection(collectionId, data, field, idField);
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + '/' + fileNameNoSpace,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            uploadedNotSaved.uploaded = true;
            $('#' + index).remove();
            $('#correction-filename_show_' + index).replaceWith('<p id="correction-filename_show_' + index + '">' + fileNameNoSpace + '</p>');
            data.downloads[index].file = fileNameNoSpace;
          },
          error: function (response) {
            handleApiError(response);
          }
        });
      }
    });
  }
}

function refreshDocWithFilesCorrection(collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseDocWithFilesCorrection(collectionId, data, field, idField)
}

function initialiseDocWithFilesCorrection(collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
      saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
    });
    if (idField === 'correction') {
      $('#' + idField + '-edit_' + index).click(function () {
        var markdown = $('#' + idField + '-markdown_' + index).val();
        var editedSectionValue = {title: 'Correction notice', markdown: markdown};
        var saveContent = function (updatedContent) {
          data[field][index].correctionNotice = updatedContent;
          saveDocWithFilesCorrection(collectionId, data.uri, data, field, idField);
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      });
    }

    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("This will revert all changes you have made in this file. Are you sure you want to delete" +
        " this " + idField + "?");
      if (result === true) {
        var pathToDelete = data.uri;
        var filesToDelete = data.downloads;  //Delete all files in directory
        var uriToDelete = $(this).parent().parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
        deleteUnpublishedVersion(collectionId, uriToDelete, function () {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          //delete uploaded files in this directory
          _.each(filesToDelete, function (download) {
            fileToDelete = data.uri + '/' + download.file;
            deleteContent(collectionId, fileToDelete);
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
            sweetAlert("You cannot delete a " + idField + " that has been published.");

          }
          else {
            handleApiError(response);
          }
        });
      }
    });
  });
}

function saveDocWithFilesCorrection(collectionId, path, data, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshDocWithFilesCorrection(collectionId, data, field, idField);
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

function checkFilesUploaded (oldFiles, newFiles) {
  var diff = [];
  _.each(oldFiles, function (oldFile, i) {
    if (oldFile.file !== newFiles[i].file) {
      diff.push(newFiles[i].file);
    }
  });
  return diff;
}

