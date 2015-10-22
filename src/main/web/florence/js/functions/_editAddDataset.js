/**
 * Manage files associated with datasets. When uploading a file creates a new dataset
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addDataset(collectionId, data, field, idField) {
  var list = data[field];
  var downloadExtensions, pageType;
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorDownloads(dataTemplate);
  $('#' + idField).replaceWith(html);
  var uriUpload;

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  //// Edit
  //if (!data[field] || data[field].length === 0) {
  //  var lastIndex = 0;
  //} else {
  //  $(data[field]).each(function (index) {
  //    // Delete
  //    $('#' + idField + '-delete_' + index).click(function () {
  //      var result = confirm("Are you sure you want to delete this file?");
  //      if (result === true) {
  //        var position = $(".workspace-edit").scrollTop();
  //        Florence.globalVars.pagePos = position;
  //        $(this).parent().remove();
  //        $.ajax({
  //          url: "/zebedee/content/" + collectionId + "?uri=" + data[field][index].file,
  //          type: "DELETE",
  //          success: function (res) {
  //            console.log(res);
  //          },
  //          error: function (res) {
  //            console.log(res);
  //          }
  //        });
  //        data[field].splice(index, 1);
  //        updateContent(collectionId, data.uri, JSON.stringify(data));
  //      }
  //    });
  //    // Edit
  //    $('#' + idField + '-edit_' + index).click(function () {
  //      var editedSectionValue = {
  //        "markdown": $('#' + idField + '-title_' + index).val()
  //      };
  //      var saveContent = function (updatedContent) {
  //        data[field][index].markdown = updatedContent;
  //        updateContent(collectionId, data.uri, JSON.stringify(data));
  //      };
  //      loadMarkdownEditor(editedSectionValue, saveContent, data);
  //    });
  //  });
  //}

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
        '    <label for="title">Contact email' +
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
        addFile(collectionId, data, field, idField);
      });

      $('#UploadForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var formdata = new FormData();

        function showUploadedItem(source) {
          $('#list').append(source);
        }

        var title = $('#title').val();
        var pageTitleTrimmed = title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

        var file = this[0].files[0];
        if(!file) {
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
              addFile(collectionId, data, field, idField);
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
          addFile(collectionId, data, field, idField);
          return;
        }

        if (title.length < 4) {
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
              data[field].push({uri: safeUriUpload});
              // create the dataset
              loadT8Creator (collectionId, data, pageType, pageTitleTrimmed);
              // on success save parent and child data
            }
          });
        }
      });
    }
  );

  function sortable() {
    $('#sortable-' + idField).sortable();
  }

  sortable();
}

