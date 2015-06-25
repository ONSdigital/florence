function loadCreator (collectionId) {
  var pageType, releaseDate;

  $('#location').hide();
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
    var parentUrl = localStorage.getItem("pageurl");

    if (pageType === 'compendium-landing-page') {
      loadT6Creator(collectionId, releaseDate, pageType, parentUrl);
    } else if (pageType === 'about_us' || pageType === 'qmi' || pageType === 'foi' || pageType === 'adhoc') {
      loadT7Creator(collectionId, releaseDate, pageType, parentUrl);
    }
    else if (pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset' || pageType === 'methodology') {
      loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
    }
  });
}

