/**
 * Manages links
 * @param collectionId
 * @param data
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editLink (collectionId, data, field, idField) {
  var list = data[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorLinks(dataTemplate);
  $('#'+ idField).replaceWith(html);

  // Load
  $(data[field]).each(function(index){

    $('#' + idField +'-edit_'+index).click(function() {
      var editedSectionValue = {
        "title": $('#' + idField +'-uri_' + index).val(),
        "markdown": $('#' + idField + '-markdown_' + index).val()
      };

      var saveContent = function(updatedContent) {
        data[field][index].title = updatedContent;                         //markdown
        data[field][index].uri = $('#' + idField +'-uri_' + index).val();
        saveLink (collectionId, data.uri, data, field, idField);
        refreshPreview(data.uri);
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $('#' + idField + '-delete_'+index).click(function() {
      swal ({
        title: "Warning",
        text: "Are you sure you want to delete?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function(result) {
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position + 300;
          $(this).parent().remove();
          data[field].splice(index, 1);
          saveLink(collectionId, data.uri, data, field, idField);
          refreshPreview(data.uri);
          swal({
            title: "Deleted",
            text: "This link has been deleted",
            type: "success",
            timer: 2000
          });
        }
      });
    });
  });

  //Add
  $('#add-' + idField).click(function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position + 300;

      //TODO This function breaking when adding related link
      console.log(data);
      console.log(data[field]);

    data[field].push({uri:"", title:""});
    saveLink (collectionId, data.uri, data, field, idField);
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

function saveLink (collectionId, path, data, field, idField) {
    putContent(collectionId, path, JSON.stringify(data),
        success = function (response) {
            Florence.Editor.isDirty = false;
            editLink (collectionId, data, field, idField);
        },
        error = function (response) {
            if (response.status === 400) {
                sweetAlert("Cannot edit this page", "It is already part of another collection.");
            }
            else {
                handleApiError(response);
            }
        }
    );
}