function loadCreator (parentUrl, collectionId, type) {
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

  //releaseDate = Florence.collection.date;             //to be added back to scheduled collections

  if (type === 'bulletin' || type === 'article') {
    $('#pagetype').val(type).change();
    loadT4Creator(collectionId, releaseDate, type, parentUrl);
  } else if (type === 'compendium_landing_page') {
    $('#pagetype').val(type).change();
    loadT6Creator(collectionId, releaseDate, type, parentUrl);
  } else {
    $('select').off().change(function () {
      pageType = $(this).val();
      $('.edition').empty();

      if (pageType === 'bulletin' || pageType === 'article' || pageType === 'article_download') {
        loadT4Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType.match(/compendium_.+/)) {
        loadT6Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType.match(/static_.+/)) {
        loadT7Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType === 'dataset_landing_page' || pageType === 'timeseries_landing_page') {
        loadT8Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else if (pageType === 'release') {
        loadT16Creator(collectionId, releaseDate, pageType, parentUrl);
      }
      else {
        sweetAlert("Error", 'Page type not recognised. Contact an administrator', "error");
      }
    });
  }

}

