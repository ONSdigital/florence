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

    $("#image-edit_" + index).click(function () {
      getPageResource(collectionId, imageJson,
        onSuccess = function (imageData) {
          loadImageBuilder(data, function () {
            Florence.Editor.isDirty = false;
            //refreshPreview();
            refreshImagesList(data, collectionId);
          }, imageData);
        })
    });

    $("#image-delete_" + index).click(function () {
      var result = confirm("Are you sure you want to delete this image?");
      if (result === true) {
        $("#image_" + index).remove();
        // delete any files associated with the image.

        getPageResource(collectionId, imageJson,
          onSuccess = function (imageData) {
            _.each(imageData.files, function(file) {
              var fileUri = basePath + '/' + file.filename;
              console.log('deleting ' + fileUri);
              deleteContent(collectionId, fileUri,
                onSuccess = function () {
                },
                onError = function (error) {
                  handleApiError(error);
                });
            });
          });

        // delete the image json file
        deleteContent(collectionId, imageJson,
          onSuccess = function () {
            // remove the image from the page json when its deleted
            data.images = _(data.images).filter(function (item) {
              return item.filename !== image.filename;
            });

            // save the updated page json
            postContent(collectionId, basePath, JSON.stringify(data),
              success = function () {
                Florence.Editor.isDirty = false;
                refreshImagesList(data, collectionId);
              },
              error = function (response) {
                handleApiError(response);
              }
            );
          }
        );
      }
    });
  });
}
