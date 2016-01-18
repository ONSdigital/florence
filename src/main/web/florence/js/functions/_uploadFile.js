function uploadFile(collectionId, data, field, idField, lastIndex, downloadExtensions, onSave) {
  var position = $(".workspace-edit").scrollTop();
  Florence.globalVars.pagePos = position + 200;
  $('#sortable-' + idField).append(
    '<div id="' + lastIndex + '" class="edit-section__item">' +
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
    $('#' + lastIndex).remove();
    onSave(collectionId, data, field, idField);
  });

  $('#UploadForm').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var formdata = new FormData();

    function showUploadedItem(source) {
      $('#list').append(source);
    }

    var file = this[0].files[0];
    if (!file) {
      sweetAlert("Please select a file to upload");
      return;
    }

    document.getElementById("response").innerHTML = "Uploading . . .";

    var fileNameNoSpace = file.name.replace(/[^a-zA-Z0-9\.]/g, "").toLowerCase();
    uriUpload = data.uri + "/" + fileNameNoSpace;
    var safeUriUpload = checkPathSlashes(uriUpload);

    if (data[field] && data[field].length > 0) {
      $(data[field]).each(function (i, filesUploaded) {
        if (filesUploaded.file == safeUriUpload) {
          sweetAlert('This file already exists');
          $('#' + lastIndex).remove();
          onSave(collectionId, data, field, idField);
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
      sweetAlert("This file type is not supported");
      $('#' + lastIndex).remove();
      onSave(collectionId, data, field, idField);
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
          data[field].push({title: '', file: fileNameNoSpace});
          updateContent(collectionId, data.uri, JSON.stringify(data));
        }
      });
    }
  });
}

