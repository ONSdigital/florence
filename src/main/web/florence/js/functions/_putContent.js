function putContent(collectionId, path, content, success, error) {
  postContent(collectionId, path, content, true,
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
