function loadImportScreen (collectionId) {

  getCollection(collectionId,
    success = function (collection) {
      var html = templates.workImport;
      $('.workspace-menu').html(html);

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
        var uriUpload = "/" + fileNameNoSpace;

        // check if the file already exists.
        //if (data[field] && data[field].length > 0) {
        //  $(data[field]).each(function (i, filesUploaded) {
        //    if (filesUploaded.file === fileNameNoSpace || filesUploaded.file === fileNameNoSpace ) {
        //      sweetAlert('This file already exists');
        //      $('#' + lastIndex).remove();
        //      formdata = false;  // if not present the existing file was being overwritten
        //      return;
        //    }
        //  });
        //}

        if (file.name.match(".csv")) {
          showUploadedItem(fileNameNoSpace);
          if (formdata) {
            formdata.append("name", file);
          }
        } else {
          sweetAlert("This file type is not supported");
          return;
        }

        if (formdata) {
          $.ajax({
            url: "/zebedee/timeseriesimport/" + collectionId + "?uri=" + uriUpload,
            type: 'POST',
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: function () {
              document.getElementById("response").innerHTML = "File uploaded successfully";
              //if (!data[field]) {
              //  data[field] = [];
              //}
              //data[field].push({title: '', file: fileNameNoSpace});
            }
          });
        }
      });
    },
    error = function (response) {
      handleApiError(response);
    }
  );




}

