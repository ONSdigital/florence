function loadImagesList(data, collectionId) {
  var html = templates.workEditImages(data);
  $('#images').replaceWith(html);
  initialiseImagesList(data, collectionId);
}

function refreshImagesList(data, collectionId) {
  var html = templates.workEditImages(data);
  $('#image-list').replaceWith($(html).find('#image-list'));
  initialiseImagesList(data, collectionId);
}

function initialiseImagesList(data, collectionId) {

  $(data.images).each(function (index, image) {
    var basePath = data.uri;
    var noExtension = image.uri.match(/^(.+?)(\.[^.]*$|$)/);
    var imageJson = noExtension[1] + '.json';

    $("#image-copy_" + image.filename).click(function () {
      copyToClipboard('#image-to-be-copied_' + index);
    });

    $("#image-edit_" + index).click(function () {
      getPageResource(collectionId, imageJson,
        onSuccess = function (imageData) {
          loadImageBuilder(data, function () {
            Florence.Editor.isDirty = false;
            //refreshPreview();
            refreshImagesList(data, collectionId);
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

          $("#image_" + index).remove();
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

              refreshImagesList(data, collectionId);

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
}
