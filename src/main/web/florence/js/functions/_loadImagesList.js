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
    var imagePath = basePath + '/' + image.filename;
    var imageJson = imagePath;

    $("#image-edit_" + image.filename).click(function () {
      getPageData(collectionId, imageJson,
        onSuccess = function (imageData) {
          loadImageBuilder(data, function () {
            Florence.Editor.isDirty = false;
            refreshPreview();
            refreshImagesList(data, collectionId);
          }, imageData);
        })
    });

    $("#image-delete_" + image.filename).click(function () {
      var result = confirm("Are you sure you want to delete this image?");
      if (result === true) {
        $("#image_" + index).remove();
        // delete any files associated with the image.
        var extraFiles = [image.filename + '.jpg']; //restrict this to one file type jpg
        _(extraFiles).each(function (file) {
          var fileToDelete = basePath + '/' + file;
          deleteContent(collectionId, fileToDelete,
            onSuccess = function () {
            },
            onError = function (error) {
              handleApiError(error);
            });

          // delete the image json file
          deleteContent(collectionId, imageJson + '.json',
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
        });
      }
    });
  });
}
