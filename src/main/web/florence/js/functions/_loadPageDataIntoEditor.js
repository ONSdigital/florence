function loadPageDataIntoEditor(path, collectionId) {

  if (path === '/') {
    var pageUrlData = path + "data.json";
  } else {
    var pageUrlData = path + "/data.json";
  }
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
        var lastCompletedEvent = getLastCompletedEvent(response, pageUrlData);
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
