function loadPageDataIntoEditor(collectionName) {
  var pageUrlData = localStorage.getItem("pageurl") + "/data.json";
  getPageData(collectionName, pageUrlData,
    success = function (response) {
      makeEditSections(collectionName, response);
      console.log(response);
      refreshPreview(localStorage.getItem("pageurl"));
      setPreviewUrl(localStorage.getItem("pageurl"))
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function checkIfPageIsComplete() {

    getCollection(collectionName,
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
