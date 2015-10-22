/**
 * Editor data loader
 * @param path
 * @param collectionId
 * @param click - if present checks the page url to keep in sync with iframe
 */

function loadPageDataIntoEditor(path, collectionId, click) {

  if (Florence.globalVars.welsh) {
    if (path === '/') {       //add whatever needed to read content in Welsh
      var pageUrlData = path + '&lang=cy';
      var toApproveUrlData = '/data_cy.json';
    } else {
      var pageUrlData = path + '&lang=cy';
      var toApproveUrlData = path + '/data_cy.json';
    }
  } else {
    if (path === '/') {       //add whatever needed to read content in English
      var pageUrlData = path;
      var toApproveUrlData = '/data.json';
    } else {
      var pageUrlData = path;
      var toApproveUrlData = path + '/data.json';
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
        var lastCompletedEvent = getLastCompletedEvent(response, toApproveUrlData);
        isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Florence.Authentication.loggedInEmail());
      },
      error = function (response) {
        handleApiError(response);
      })
  );

  $.when.apply($, ajaxRequests).then(function () {
    if (click) {
      var iframe = getPathName();
      if (iframe !== pageData.uri) {
        setTimeout(loadPageDataIntoEditor(path, collectionId), 200);
      } else {
        makeEditSections(collectionId, pageData, isPageComplete);
      }
    } else {
      makeEditSections(collectionId, pageData, isPageComplete);
    }
  });
}
