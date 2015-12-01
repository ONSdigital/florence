/**
 * Manages file with description
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function addFileWithDetails(collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorDownloadsWithSummary(dataTemplate);
  $('#' + idField).replaceWith(html);
  var uriUpload;
  var downloadExtensions;

  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);

  // Edit
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index) {
      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal ({
          title: "Warning",
          text: "Are you sure you want to delete this file?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This alert has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Florence.globalVars.pagePos = position;
            $(this).parent().remove();
            $.ajax({
              url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + data[field][index].file,
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
      });

      // Edit
      $('#' + idField + '-edit_' + index).click(function () {
        var editedSectionValue = {
          "title": $('#' + idField + '-title_' + index).val(),
          "markdown": $('#' + idField + '-summary_' + index).val()
        };

        var saveContent = function (updatedContent) {
          data[field][index].fileDescription = updatedContent;
          data[field][index].title = $('#' + idField + '-title_' + index).val();
          updateContent(collectionId, data.uri, JSON.stringify(data));
        };
        loadMarkdownEditor(editedSectionValue, saveContent, data);
      });

    });
  }

  //Add
  if (data.type === 'compendium_data') {
    downloadExtensions = /\.csv$|.xls$|.zip$/;
  } else {
    sweetAlert("This file type is not valid", "Contact an administrator if you need to add this type of file in this document", "info");
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
      addFileWithDetails(collectionId, data, field, idField);
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
      uriUpload = fileNameNoSpace;    //make file path relative

      if (data[field].length > 0) {
        $(data[field]).each(function (i, filesUploaded) {
          if (filesUploaded.file === uriUpload) {
              sweetAlert('This file already exists');
            $('#' + lastIndex).remove();
            addFileWithDetails(collectionId, data, field, idField);
            return;
          }
          else if (filesUploaded.file === data.uri + '/' + uriUpload) {   //case for old uri
            alert('This file already exists');
            $('#' + lastIndex).remove();
            addFileWithDetails(collectionId, data, field, idField);
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
        addFileWithDetails(collectionId, data, field, idField);
        return;
      }

      if (formdata) {
        $.ajax({
          url: "/zebedee/content/" + collectionId + "?uri=" + data.uri + '/' + uriUpload,
          type: 'POST',
          data: formdata,
          cache: false,
          processData: false,
          contentType: false,
          success: function (res) {
            document.getElementById("response").innerHTML = "File uploaded successfully";
            data[field].push({title: '', file: uriUpload});
            updateContent(collectionId, data.uri, JSON.stringify(data));
          }
        });
      }
    });
  });

  $(function () {
    $('.add-tooltip').tooltip({
      items: '.add-tooltip',
      content: 'Type title here and click Edit to add a description',
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

