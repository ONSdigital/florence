/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editDatasetVersion(collectionId, data, templateData, field, idField) {
  var list = data[field];
  var downloadExtensions;
  var uriUpload;
  var lastIndex = 100;

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  //Add
  if (data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csdb$/;
  } else if (data.type === 'dataset') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }

  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    $('#sortable-' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <label for="title">Title' +
      '      <textarea class="auto-size" type="text" id="title"></textarea>' +
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
      editDatasetVersion(collectionId, data, templateData, field, idField);
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      var pageTitle = this[0].value;
      data.description.title = pageTitle;
      var file = this[1].files[0];
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
      //      editDatasetVersion (collectionId, data, templateData, field, idField);
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

      if (pageTitle.length < 4) {
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
            // create the new version
            saveNewCorrection(collectionId, data.uri, function (response) {
              var tmpDate = (new Date()).toISOString();           // it could use releaseDate
              data[field].push({correctionNotice: "", updateDate: tmpDate, uri: response});
              templateData.push({correctionNotice: "", updateDate: tmpDate, uri: response});
              initialiseDatasetVersion(collectionId, data, templateData, field, idField);
              $("#add-" + idField).remove();
            }, function (response) {
              if (response.status === 409) {
                alert("You can add only one correction before publishing.");
              }
              else {
                handleApiError(response);
              }
            });
          }
        });
      }
    });
  });
}

function refreshDatasetVersion(collectionId, data, templateData, field, idField) {
  var list = templateData;
  var dataTemplate = {list: list, idField: idField};
  var html = templates.workEditT8VersionList(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseDatasetVersion(collectionId, data, templateData, field, idField);
}

function initialiseDatasetVersion(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    dateTmp = data[field][index].updateDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#date_' + index).val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data[field][index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
      templateData[index].updateDate = new Date($('#date_' + index).datepicker('getDate')).toISOString();
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
          templateData.splice(index, 1);
          saveDatasetVersion(collectionId, data.uri, data, templateData, field, idField);
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

function saveDatasetVersion(collectionId, path, data, templateData, field, idField) {
  data.description.releaseDate = data[field][-1].updateDate;
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

