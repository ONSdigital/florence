/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key ('versions')
 * @param idField - HTML id for the template ('version' or 'correction')
 */

function editCompendiumDatasetCorrection(collectionId, data, field, idField) {
  var downloadExtensions, uriUpload, file;
  if (!data[field]) {
    data[field] = [];
  }
  var uploadedNotSaved = {uploaded: false, saved: false, fileUrl: data.downloads};
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
  //Add file types
  downloadExtensions = /\.csv$|.xls$|.zip$/;

  refreshCompendiumDatasetCorrection(collectionId, data, field, idField);


  $("#add-" + idField).one('click', function () {
    //Display the list of uploaded files in the ref table
    var list = data.downloads;
    var html = templates.editorCompendiumDatasetFiles(list);
    $('#sortable-correction').append(html);

    //Update the files to be corrected
    $(data.downloads).each(function (index) {
      $('#correction-upload_' + index).click(function () {
        fileCorrection(index);
      }).children().click(function (e) {
        e.stopPropagation();
      });
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
            .find('.text-center').prepend('<div id="sortable-' + idField + '" class="edit-section__sortable">');
          saveCompendiumDatasetCorrection(collectionId, data.uri, data, field, idField);
        }, function (response) {
          if (response.status === 409) {
            alert("You can add only one " + idField + " before publishing.");
            var filesToDelete = data.downloads;  //Delete all files in directory
            _.each(filesToDelete, function (download) {
              fileToDelete = data.uri + download.file;
              deleteContent(collectionId, fileToDelete, function () {
                console.log("File deleted");
              }, function (error) {
                console.log(error);
              });
            });
          }
          else if (response.status === 404) {
            alert("You can only add " + idField + "s to content that has been published.");
            var filesToDelete = data.downloads;  //Delete all files in directory
            _.each(filesToDelete, function (download) {
              fileToDelete = data.uri + download.file;
              deleteContent(collectionId, fileToDelete, function () {
                console.log("File deleted");
              }, function (error) {
                console.log(error);
              });
            });
          }
          else {
            handleApiError(response);
          }
        }
      );
    });
  });

  function fileCorrection(index) {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    $('#correction-filename_show_' + index).append(
      '<div id="file-added_' + index + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
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
      $('#file-added_' + index).remove();
      if (uploadedNotSaved.uploaded === true && uploadedNotSaved.saved === false) {
        data.downloads[index].file = uploadedNotSaved.fileUrl[index].file;
        var fileToDelete = data.uri + uploadedNotSaved.fileUrl[index].file;
        deleteContent(collectionId, fileToDelete,
          onSuccess = function () {
          },
          onError = function (error) {
            handleApiError(error);
          }
        );
      }
      refreshCompendiumDatasetCorrection(collectionId, data, field, idField);
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

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = '/' + fileNameNoSpace;

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        alert('This file type is not supported');
        $('#' + index).remove();
        editCompendiumDatasetCorrection(collectionId, data, field, idField);
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + uriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function () {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            uploadedNotSaved.uploaded = true;
            $('#file-added_' + index).remove();
            $('#correction-filename_show_' + index).replaceWith('<p id="correction-filename_show_' + index + '">' + uriUpload + '</p>');
            data.downloads[index].file = uriUpload;
          },
          error: function (response) {
            console.log("Error in uploading this file");
            handleApiError(response);
          }
        });
      }
    });
  }
}

function refreshCompendiumDatasetCorrection(collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorCorrection(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseCompendiumDatasetCorrection(collectionId, data, field, idField)
}

function initialiseCompendiumDatasetCorrection(collectionId, data, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#' + idField + '-date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#' + idField + '-date_' + index).datepicker('getDate')).toISOString();
      saveCompendiumDatasetCorrection(collectionId, data.uri, data, field, idField);
    });
    if (idField === 'correction') {
      $('#' + idField + '-edit_' + index).click(function () {
        var editedSectionValue = $('#' + idField + '-markdown_' + index).val();
        var saveContent = function (updatedContent) {
          data[field][index].correctionNotice = updatedContent;
          saveCompendiumDatasetCorrection(collectionId, data.uri, data, field, idField);
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data, 'notEmpty');
      });
    }

    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      var result = confirm("Are you sure you want to delete this " + idField + "?");
      if (result === true) {
        var pathToDelete = data.uri;
        var filesToDelete = data.downloads;  //Delete all files in directory
        var uriToDelete = $(this).parent().children('#' + idField + '-edition_' + index).attr(idField + '-url');
        deleteUnpublishedVersion(collectionId, uriToDelete, function () {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          //delete uploaded files in this directory
          _.each(filesToDelete, function (download) {
            fileToDelete = data.uri + download.file;
            deleteContent(collectionId, fileToDelete, function () {
              console.log("File deleted");
            }, function (error) {
              console.log(error);
            });
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

function saveCompendiumDatasetCorrection(collectionId, path, data, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    function () {
      Florence.Editor.isDirty = false;
      refreshCompendiumDatasetCorrection(collectionId, data, field, idField);
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


