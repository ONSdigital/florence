function addFile(collectionId, data, field, idField) {
  var list = data[field];
  var downloadExtensions;
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorDownloads(dataTemplate);
  $('#' + idField).replaceWith(html);
  var uriUpload;

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  // Edit
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index) {
      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        var result = confirm("Are you sure you want to delete this file?");
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          $.ajax({
            url: "/zebedee/content/" + collectionId + "?uri=" + data[field][index].file,
            type: "DELETE",
            success: function (res) {
              console.log(res);
            },
            error: function (res) {
              console.log(res);
            }
          });
          data[field].splice(index, 1);
          updateContent(collectionId, data.uri, JSON.stringify(data));
        }
      });
      // Edit
      $('#' + idField + '-edit_' + index).click(function () {
        var editedSectionValue = {
          "markdown": $('#' + idField + '-title_' + index).val()
        };
        var saveContent = function (updatedContent) {
          data[field][index].markdown = updatedContent;
          updateContent(collectionId, data.uri, JSON.stringify(data));
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data);
      });
    });
  }

  //Add
  if (data.type === 'dataset') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  }  else if (data.type === 'timeseries_dataset') {
    downloadExtensions = /\.csdb$/;
  }  else if (data.type === 'static_adhoc') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else if (data.type === 'static_qmi') {
    downloadExtensions = /\.pdf$/;
  } else if (data.type === 'static_foi') {
    downloadExtensions = /\.csv$|.xls$|.doc$|.pdf$|.zip$/;
  } else {
    alert('This file type is not valid. Contact an administrator to add this type of file in this document');
  }

  $('#add-' + idField).one('click', function () {
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
        addFile(collectionId, data, field, idField);
      });

      $('#UploadForm').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var formdata = new FormData();

        function showUploadedItem(source) {
          $('#list').append(source);
        }

        document.getElementById("response").innerHTML = "Uploading . . .";

        var file = this[0].files[0];
        var fileNameNoSpace = file.name.replace(/\s*/g, "").toLowerCase();
        uriUpload = data.uri + "/" + fileNameNoSpace;
        var safeUriUpload = checkPathSlashes(uriUpload);

        if (data[field].length > 0) {
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

        if (formdata) {
          $.ajax({
            url: "/zebedee/content/" + collectionId + "?uri=" + safeUriUpload,
            type: "POST",
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
              document.getElementById("response").innerHTML = "File uploaded successfully";
              data[field].push({title: '', file: safeUriUpload});
              updateContent(collectionId, data.uri, JSON.stringify(data));
            }
          });
        }
      });
    }
  );

  $(function () {
    $('.add-tooltip').tooltip({
      items: '.add-tooltip',
      content: 'Type title here and click Save to add it to the page',
      show: "slideDown", // show immediately
      open: function (event, ui) {
        ui.tooltip.hover(
          function () {
            $(this).fadeTo("slow", 0.5);
          });
      }
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }

  sortable();
}

