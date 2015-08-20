function loadPageDataIntoEditor(path, collectionId) {

  if (Florence.globalVars.welsh) {
    if (path === '/') {       //add whatever needed to read content in Welsh
      var pageUrlData = path;
    } else {
      var pageUrlData = path;
    }
  } else {
    if (path === '/') {       //add whatever needed to read content in English
      var pageUrlData = path;
    } else {
      var pageUrlData = path;
    }
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
