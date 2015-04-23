function loadPageDataIntoEditor(collectionName, active) {
  if (active === false) {
    // Do nothing
  } else {
    var pageUrlData = localStorage.getItem("pageurl") + "/data.json";
    getPageData(collectionName, pageUrlData,
      success = function (response) {
        makeEditSections(collectionName, response);
        console.log(response);
      },
      error = function (response) {
        handleApiError(response);
      }
    );
  }

  function checkIfPageIsComplete() {

    getCollection(collectionName,
      success = function (response) {
        var pageIsComplete = false;
        var pagePath = getPathName();
        var pageFile = pagePath + '/data.json';

        $.each(response.completeUris, function (i, item) {
          if (pageFile === item) {
            pageIsComplete = true;
          }
        });

        if (pageIsComplete) {

          var lastCompletedEvent = getLastCompletedEvent(response, pageFile);
          if (lastCompletedEvent.email !== localStorage.getItem("loggedInAs")) {
            $('.fl-panel--editor__nav__review').show();
            $('.fl-panel--editor__nav__complete').hide();
          }
          else {
            $('.fl-panel--editor__nav__review').hide();
            $('.fl-panel--editor__nav__complete').show();
          }
        }
        else {
          $('.fl-panel--editor__nav__review').hide();
          $('.fl-panel--editor__nav__complete').show();
        }
      },
      error = function (response) {
        handleApiError(response);
      });
  }
}
