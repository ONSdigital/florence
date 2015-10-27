/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addDataset(collectionId, data, field, idField) {
  var downloadExtensions, pageType;
  var uriUpload;
  var lastIndex;
  if (data[field]) {
    lastIndex = data[field].length;
  } else {
    lastIndex = 0
  }

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

      var file = this[1].files[0];
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }

      document.getElementById("response").innerHTML = "Uploading . . .";

      var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
      uriUpload = data.uri + '/' + pageTitleTrimmed + '/' + fileNameNoSpace;
      var safeUriUpload = checkPathSlashes(uriUpload);

      if (data[field] && data[field].length > 0) {
        $(data[field]).each(function (i, filesUploaded) {
          if (filesUploaded.file == safeUriUpload) {
            alert('This file already exists');
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
        alert('This file type is not supported');
        $('#' + lastIndex).remove();
        addDataset(collectionId, pageData, 'datasets', 'edition');
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
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: data.uri + '/' + pageTitleTrimmed});
            // create the dataset
            loadT8EditionCreator(collectionId, data, pageType, pageTitle, fileNameNoSpace);
            // on success save parent and child data
          }
        });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }

  sortable();
}

