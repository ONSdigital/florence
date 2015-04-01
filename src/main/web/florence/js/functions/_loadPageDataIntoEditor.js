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
        if (pagePath.indexOf('/') !== 0) {
          pagePath = '/' + pagePath;
        }
        var pageFile = pagePath + '/data.json';

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