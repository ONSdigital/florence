function loadImagesList(collectionId, data) {
  var html = templates.workEditImages(data);
  $('#images').replaceWith(html);
  initialiseImagesList(collectionId, data);
}

function refreshImagesList(collectionId, data) {
  var html = templates.workEditImages(data);
  $('#image-list').replaceWith($(html).find('#image-list'));
  initialiseImagesList(collectionId, data);
}

function initialiseImagesList(collectionId, data) {

  $(data.images).each(function (index, image) {
    var basePath = data.uri;
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + '.json';

    $("#image-copy_" + index).click(function () {
      copyToClipboard('#image-to-be-copied_' + index);
    });

    $("#image-edit_" + index).click(function () {
      getPageResource(collectionId, imageJson,
        onSuccess = function (imageData) {
          loadImageBuilder(data, function () {
            Florence.Editor.isDirty = false;
            //refreshPreview();
            refreshImagesList(collectionId, data);
          }, imageData);
        }
      );
    });

    $("#image-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this image?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          $(this).parent().remove();
          // delete any files associated with the image.
          getPageResource(collectionId, imageJson,
            onSuccess = function (imageData) {
              if (imageData.files) {
                _.each(imageData.files, function (file) {
                  var fileUri = basePath + '/' + file.filename;
                  //console.log('deleting ' + fileUri);
                  deleteContent(collectionId, fileUri, function () {
                  }, function () {
                  });
                });
              } else {
                //console.log('deleting ' + image.uri);
                deleteContent(collectionId, image.uri);
              }
            });

          // remove the image from the page json when its deleted
          data.images = _(data.images).filter(function (item) {
            return item.filename !== image.filename;
          });

          // save the updated page json
          putContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              Florence.Editor.isDirty = false;

              swal({
                title: "Deleted",
                text: "This image has been deleted",
                type: "success",
                timer: 2000
              });

              refreshImagesList(collectionId, data);

              // delete the image json file
              deleteContent(collectionId, imageJson,
                onSuccess = function () {
                },
                error = function (response) {
                  if (response.status !== 404)
                    handleApiError(response);
                });
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        }
      });
    });
  });
  // Make sections sortable
  function sortable() {
    $('#sortable-image').sortable();
  }
  sortable();
}
