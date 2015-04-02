function loadPageDataIntoEditor(collectionName, active) {
  if (active === false) {
    // Do nothing
  } else {
    var pageUrlData = "/data/" + getPathName();
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
        if (pageFile.indexOf('/') !== 0) {
          pageFile = '/' + pageFile;
        }
        $.each(response.completeUris, function (i, item) {
          if (pageFile === item) {
            pageIsComplete = true;
          }
        });

        if (pageIsComplete) {
          $('.fl-panel--editor__nav__review').show();
        }
        else {
          $('.fl-panel--editor__nav__review').hide();
        }
      },
      error = function (response) {
        handleApiError(response);
      });
  }
}
