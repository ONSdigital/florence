function viewPublishDetails(collections) {

  var date = Florence.collectionToPublish.publishDate;
  var collectionDetails = [];
  $.each(collections, function (i, collectionId) {

//    collection_list +=
//      '<h2 id="fl-panel--publish-collection-' + collection.id + '"  class="fl-panel--publish-collection" data-id="' + collection.id + '">' + collection.name + '</h2>' +
//      '<div class="fl-panel--publish-collection-' + collection.id + '"></div>';

    getCollection(collectionId,
      success = function (response) {
        var page_list = '';
        var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

        response.reviewedUris = response.reviewedUris.filter(function(uri) { return PathUtils.isJsonFile(uri) });

        $.each(response.reviewedUris, function (i, uri) {
          pageDataRequests.push(getPageData(collectionId, uri,
            success = function (response) {
              var path = uri.replace('/data.json', '');
              path = path.length === 0 ? '/' : path;
              page_list += '<p class="fl-review-page-list-item" data-path="' + path + '">' +
              response.name + '</p>';

              console.log(response.name);
            },
            error = function (response) {
              handleApiError(response);
            }));
        });

        $.when.apply($, pageDataRequests).then(function () {
          page_list += '</ul>';
          $('.fl-panel--publish-collection-' + collectionId).html(page_list);
          //updateReviewScreenWithCollection(response);
          console.log(page_list);
        });

      },
      error = function (response) {
        handleApiError(response);
      }
    );
  });




//  $('.collection-name').click(function () {
//    var collectionId = $(this).attr('data-id');
//
//
//    getCollection(collectionId,
//      success = function (response) {
//        var page_list = '';
//        var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
//
//        function isJsonFile(uri) { return uri.indexOf('data.json', uri.length - 'data.json'.length) !== -1 }
//        response.reviewedUris = response.reviewedUris.filter(function(uri) { return isJsonFile(uri) });
//
//        $.each(response.reviewedUris, function (i, uri) {
//          pageDataRequests.push(getPageData(collectionId, uri,
//            success = function (response) {
//              var path = uri.replace('/data.json', '');
//              path = path.length === 0 ? '/' : path;
//              page_list += '<p class="fl-review-page-list-item" data-path="' + path + '">' +
//              response.name + '</p>';
//
//              console.log(response.name);
//            },
//            error = function (response) {
//              handleApiError(response);
//            }));
//        });
//
//        $.when.apply($, pageDataRequests).then(function () {
//          page_list += '</ul>';
//          $('.fl-panel--publish-collection-' + collectionId).html(page_list);
//          //updateReviewScreenWithCollection(response);
//
//        });
//
//      },
//      error = function (response) {
//        handleApiError(response);
//      });
//  });
}
