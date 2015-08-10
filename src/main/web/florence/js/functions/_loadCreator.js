function loadCreator (collectionId) {
  var pageType, releaseDate;

  getCollection(collectionId,
    success = function (response) {
      if (!response.publishDate) {
        releaseDate = null;
      } else {
        releaseDate = response.publishDate;
      }
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  $('select').off().change(function () {
    pageType = $(this).val();
    //var parentUrl = localStorage.getItem("pageurl");
    var parentUrl = Florence.globalVars.pagePath;

    if (pageType === 'bulletin' || pageType === 'article') {
      $('.edition').empty();
      loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
    }

    else if (pageType.match(/compendium_.+/)) {
      $('.edition').empty();
      loadT6Creator(collectionId, releaseDate, pageType, parentUrl);
    }

    else if (pageType.match(/static_.+/)) {
      $('.edition').empty();
      loadT7Creator(collectionId, releaseDate, pageType, parentUrl);
    }

    else if (pageType === 'reference_tables' || pageType === 'dataset') {
      $('.edition').empty();
      loadT8Creator(collectionId, releaseDate, pageType, parentUrl);
    }
    else if (pageType === 'release') {
      $('.edition').empty();
      loadT16Creator(collectionId, releaseDate, pageType, parentUrl);
    }
  });
}

