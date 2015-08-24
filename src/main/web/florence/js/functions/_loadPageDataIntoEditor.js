function loadPageDataIntoEditor(path, collectionId) {
  var pageData, isPageComplete;
  var ajaxRequests = [];

  ajaxRequests.push(
    getPageData(collectionId, path,
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
        var lastCompletedEvent = getLastCompletedEvent(response, path + '/data.json');
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
