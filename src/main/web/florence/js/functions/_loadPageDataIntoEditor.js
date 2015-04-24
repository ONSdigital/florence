function loadPageDataIntoEditor(collectionName, active) {
  if (active === false) {
    // Do nothing
  } else {
    var pageUrlData = "/data" + getPathName();
    $.ajax({
      url: pageUrlData,
      dataType: 'json',
      success: function (response) {
        makeEditSections(collectionName, response);
        checkIfPageIsComplete();
      },
      error: function () {
        console.log('No page data returned');
        $('.fl-editor').val('');
      }
    });
  }

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
