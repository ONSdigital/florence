function addFileWithDetails (collectionId, data, field, idField) {
  var uriUpload;
  // Edit
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index) {
      var lastIndex = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        $("#" + index).remove();
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
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });

      // Edit
      $('#' + idField + '-edit_' + index).click(function() {
        var editedSectionValue = {
          "title": $('#' + idField + '-title_' + index).val(),
          "markdown": $('#' + idField + '-summary_' + index).val()
        };

         var saveContent = function(updatedContent) {
           data[field][index].fileDescription = updatedContent;
           data[field][index].title = $('#' + idField + '-title_' + index).val();
           updateContent(collectionId, getPathName(), JSON.stringify(data));
         };
         loadMarkdownEditor(editedSectionValue, saveContent, data);
      });

    });
  }

  //Add
  $('#add-' + idField).one('click', function () {
    $('#sortable-' + idField).append(
        '<div id="' + lastIndex + '" class="edit-section__sortable-item">' +
        '  <form id="UploadForm" action="" method="post" enctype="multipart/form-data">' +
        '    <p><input type="file" name="files" id="files">' +
        '    <p>' +
        '  </form>' +
        '  <div id="response"></div>' +
        '  <ul id="list"></ul>' +
        '</div>');

    (function () {
      var input = document.getElementById("files"), formdata = false;

      if (window.FormData) {
        formdata = new FormData();
      }
      function showUploadedItem (source) {
        var list = document.getElementById("list"),
            li   = document.createElement("li"),
            para = document.createElement("p"),
            text = document.createTextNode(source);
        para.appendChild(text);
        li.appendChild(para);
        list.appendChild(li);
      }
      if (input.addEventListener) {
        input.addEventListener("change", function (evt) {
          document.getElementById("response").innerHTML = "Uploading . . .";

          var file = this.files[0];
          uriUpload = getPathName() + "/" + file.name;

          if (data[field].length > 0) {
            $(data[field]).each(function (i, filesUploaded) {
              if (filesUploaded.file == uriUpload) {
                alert('This file already exists');
                $('#' + lastIndex).remove();
                datasetEditor(collectionId, data);
                return;
              }
            });
            if (!!file.name.match(/\.csv$|.xls$|.csdb$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndex).remove();
              datasetEditor(collectionId, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionId + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data[field].push({title:'', file: uriUpload});
                  updateContent(collectionId, getPathName(), JSON.stringify(data));
                }
              });
            }
          } else {
            if (!!file.name.match(/\.csv$|.xls$|.csdb$|.zip$/)) {
              showUploadedItem(file.name);
              if (formdata) {
                formdata.append("name", file);
              }
            } else {
              alert('This file type is not supported');
              $('#' + lastIndex).remove();
              datasetEditor(collectionId, data);
              return;
            }

            if (formdata) {
              $.ajax({
                url: "/zebedee/content/" + collectionId + "?uri=" + uriUpload,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                  document.getElementById("response").innerHTML = "File uploaded successfully";
                  data[field].push({title:'', file: uriUpload});
                  updateContent(collectionId, getPathName(), JSON.stringify(data));
                }
              });
            }
          }
        }, false);
      }
    })();
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

