function putContent(collectionId, path, content, success, error, recursive) {
  postContent(collectionId, path, content, true, recursive,
    onSuccess = function () {
      if(success) {
        success();
      }
    },
    onError = function (response) {
      if (error) {
        error(response);
      }
      else {
        handleApiError(response);
      }
    }
  );
}
