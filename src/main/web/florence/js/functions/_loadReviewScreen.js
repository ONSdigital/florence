function loadReviewScreen(collectionName) {

  getCollection(collectionName,
    success = function (response) {
      console.log(response);
      populateAwaitingReviewList(response);
    },
    error = function (response) {
      handleApiError(response)
    });

  function populateAwaitingReviewList(data) {

    var review_list = '<ul>';
    var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

    $.each(data.completeUris, function (i, item) {
      pageDataRequests.push(getPageData(collectionName, item,
        success = function (response) {
          var path = item.replace('/data.json', '')
          path = path.length === 0 ? '/' : path;
          review_list += '<li class="fl-review-page-list-item" data-path="' + path + '">' +
          response.name + '</li>';

        },
        error = function (response) {
          handleApiError(response);
        }));
    });

    $.when.apply($, pageDataRequests).then(function () {
      review_list += '</ul>';
      $('.fl-review-list-holder').html(review_list);
    });

    $('.fl-review-list-holder').on('click', '.fl-review-page-list-item', function () {
      var pageUrl = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + pageUrl);
      if (pageUrl) {
        $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        $(this).addClass('fl-panel-review-page-item__selected');
        refreshPreview(pageUrl)
      }
    });
  }
}

function updateReviewScreen() {

  // check the current url
  var path = getPathName();

  // if the url is in the current list, select it
  $( ".fl-review-page-list-item" ).each(function( index ) {
    var itemPath = $(this).attr('data-path');

    if(itemPath == path) {
      $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
      this.addClass('fl-panel-review-page-item__selected')
    }
  });
}



