function viewPublishDetails(collections) {

  var date = Florence.collectionToPublish.publishDate;
  var collectionDetails = [];

        var page_list = [];
        var page_list1 = [];
        var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

  $.each(collections, function (i, collectionId) {

    getCollection(collectionId,
      success = function (response) {
//        var page_list = [];
//        var page_list1 = [];
//        var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

        response.reviewedUris = response.reviewedUris.filter(function(uri) { return PathUtils.isJsonFile(uri) });

        $.each(response.reviewedUris, function (i, uri) {
          pageDataRequests.push(getPageData(collectionId, uri,
            success = function (response) {
              var path = uri.replace('/data.json', '');
              path = path.length === 0 ? '/' : path;
              page_list.push({path: path, name: response.name});
//              console.log(page_list);
            },
            error = function (response) {
              handleApiError(response);
            })
          );
        });

//        $.when.apply($, pageDataRequests).then(function () {
//          page_list1.push(page_list);
//          console.log(page_list1);
//        });

      },
      error = function (response) {
        handleApiError(response);
      }
    );
  });

  $.when.apply($, pageDataRequests).then(function () {
    page_list1.push(page_list);
//    console.log(page_list1);
  });

  var result = {date: date, };

  var publishDetails = templates.publishDetails(result);
      $('.section').html(publishDetails);



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
