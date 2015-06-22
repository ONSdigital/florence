function loadPageDataIntoEditor(path, collectionId) {

  if (path === '/') {
    path = '';
  }

  var pageUrlData = path + "/data.json&resolve";
  var pageData, isPageComplete;
  var ajaxRequests = [];

  ajaxRequests.push(
    getPageData(collectionId, pageUrlData,
      success = function (response) {
        pageData = response;
      },
      error = function (response) {
        handleApiError(response);
      }
    )
  );

  ajaxRequests.push(
    getCollection(collectionId,
      success = function (response) {

        if (path.charAt(0) === '/') {
          path = path.slice(1);
        }

        var pageFile = path + '/data.json';
        var lastCompletedEvent = getLastCompletedEvent(response, pageFile);
        isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === localStorage.getItem("loggedInAs"));
      },
      error = function (response) {
        handleApiError(response);
      })
  );

  $.when.apply($, ajaxRequests).then(function () {
    makeEditSections(collectionId, pageData, isPageComplete);
  });
}
