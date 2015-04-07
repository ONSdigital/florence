function loadReviewScreen(collectionName) {

  var editButton = $('.fl-review-page-edit-button'),
    reviewButton = $('.fl-review-page-review-button');

  getCollection(collectionName,
    success = function (response) {
      console.log(response);
      populateAwaitingReviewList(response);
    },
    error = function (response) {
      handleApiError(response);
    });

  function populateAwaitingReviewList(data) {

    var review_list = '<ul>';
    var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

    $.each(data.completeUris, function (i, uri) {
      pageDataRequests.push(getPageData(collectionName, uri,
        success = function (response) {
          var path = uri.replace('/data.json', '');
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
      updateReviewScreen();
    });

    $('.fl-review-list-holder').on('click', '.fl-review-page-list-item', function () {
      var path = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + path);
      if (path) {
        $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        $(this).addClass('fl-panel-review-page-item__selected');
        refreshPreview(path);
      }
    });

    editButton.click(function () {
      loadEditBulletinScreen(collectionName);
    });

    reviewButton.click(function () {
      var listItem = $('.fl-panel-review-page-item__selected');
      var path = listItem.attr('data-path');
      if (path === '/') {
        path = '';
      }
      listItem.hide();
      postReview(collectionName, path);
    });
  }
}

function updateReviewScreen() {

  var editButton = $('.fl-review-page-edit-button'),
    reviewButton = $('.fl-review-page-review-button');

  var path = getPathName(), pageIsComplete = false;

  // if the url is in the current list, select it
  $(".fl-review-page-list-item").each(function () {
    var itemPath = $(this).attr('data-path');

    if (itemPath === path) {
      pageIsComplete = true;
      $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
      $(this).addClass('fl-panel-review-page-item__selected');
    }
  });

  if (pageIsComplete) {
    editButton.show();
    reviewButton.show();
  } else {
    editButton.hide();
    reviewButton.hide();
  }
}



