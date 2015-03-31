function loadPageDataIntoEditor(collectionName, active) {
  if (active === false) {
    // Do nothing
  } else {
    var pageUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
    var pagePath = pageUrl.split("#!")[1];
    var pageUrlData = "/data" + pagePath;
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
        pageFile = pagePath + '/data.json';

        $.each(response.completeUris, function (i, item) {
          if (pagePath == item) {
            pageIsComplete == true;
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