function loadPageDataIntoEditor(path, collectionId) {
  var pageUrlData = path + "/data.json";
  getPageData(collectionId, pageUrlData,
    success = function (response) {
      makeEditSections(collectionId, response);
      refreshPreview(path);
      setPreviewUrl(path);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function checkIfPageIsComplete() {

    getCollection(collectionId,
      success = function (response) {
        var pageIsComplete = false;
        var pagePath = getPathName();
        var pageFile = pagePath + '/data.json';
        var lastCompletedEvent = getLastCompletedEvent(response, pageFile);

        if (!lastCompletedEvent || lastCompletedEvent.email === localStorage.getItem("loggedInAs")) {
          $('.fl-panel--editor__nav__complete').show();
          $('.fl-panel--editor__nav__review').hide();
        } else {
          $('.fl-panel--editor__nav__review').show();
          $('.fl-panel--editor__nav__complete').hide();
        }
      },
      error = function (response) {
        handleApiError(response);
      });
  }
}
