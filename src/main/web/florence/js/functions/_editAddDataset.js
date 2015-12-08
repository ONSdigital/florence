/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template (has to be 'edition')
 */

function addDataset(collectionId, data, field, idField) {
  var downloadExtensions, pageType;
  var uriUpload;
  var lastIndex;
  if (data[field]) {
    lastIndex = data[field].length;
  } else {
    lastIndex = 0;
  }
  var uploadedNotSaved = {uploaded: false, saved: false, editionUri: ""};
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  //Add
  if (data.timeseries) {
    downloadExtensions = /\.csdb$/;
    pageType = 'timeseries_dataset';
  } else {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
    pageType = 'dataset';
  }

  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 200;
    $('#sortable-' + idField).append(
      '<div id="' + lastIndex + '" class="edit-section__item">' +
      '  <form id="UploadForm">' +
      '    <textarea class="auto-size" placeholder="Period (E.g. 2015, August to December 2010, etc." type="text"             id="edition"></textarea>' +
      '    <textarea class="auto-size" placeholder="Label (E.g. Final, Revised, etc.)" type="text" id="version"></textarea>' +
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
      //Check files uploaded and delete them
      if (uploadedNotSaved.uploaded === true) {
        data[field].splice(-1, 1);
        deleteContent(Florence.collection.id, uploadedNotSaved.editionUri,
          onSuccess = function () {
          },
          onError = function (error) {
            handleApiError(error);
          }
        );
      }
      addDataset(collectionId, pageData, 'datasets', 'edition');
    });

    $('#UploadForm').submit(function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var formdata = new FormData();

      function showUploadedItem(source) {
        $('#list').append(source);
      }

      var pageTitle = this[0].value;
      var pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      var versionLabel = this[1].value;

      var file = this[2].files[0];
      if (!file) {
        sweetAlert("Please select a file to upload");
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + pageTitleTrimmed + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

      if (data[field] && data[field].length > 0) {
        $(data[field]).each(function (i, filesUploaded) {
          if (filesUploaded.file == safeUriUpload) {
            sweetAlert('This file already exists');
            $('#' + lastIndex).remove();
            addDataset(collectionId, pageData, 'datasets', 'edition');
            return;
          }
        });
      }

      if (!!file.name.match(downloadExtensions)) {
        showUploadedItem(fileNameNoSpace);
        if (formdata) {
          formdata.append("name", file);
        }
      } else {
        sweetAlert('This file type is not supported');
        $('#' + lastIndex).remove();
        addDataset(collectionId, pageData, 'datasets', 'edition');
        return;
      }

      if (pageTitle.length < 4) {
        sweetAlert("This is not a valid file title");
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
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: data.uri + '/' + pageTitleTrimmed});
            uploadedNotSaved.uploaded = true;
            // create the dataset
            loadT8EditionCreator(collectionId, data, pageType, pageTitle, fileNameNoSpace, versionLabel);
            // on success save parent and child data
          }
        });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();
}

