function loadReviewScreen(collectionName) {

  var editButton = $('.fl-review-page-edit-button'),
    reviewButton = $('.fl-review-page-review-button');

  getCollection(collectionName,
    success = function (response) {
      populateAwaitingReviewList(response);
    },
    error = function (response) {
      handleApiError(response);
    });

  function populateAwaitingReviewList(data) {

    var review_list = '';
    var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

    data.completeUris = data.completeUris.filter(function(uri) { return PathUtils.isJsonFile(uri) });

    $.each(data.completeUris, function (i, uri) {
      pageDataRequests.push(getPageData(collectionName, uri,
        success = function (response) {
          var path = uri.replace('/data.json', '');
          path = path.length === 0 ? '/' : path;
          review_list += '<h3 class="fl-review-page-list-item" data-path="' + path + '">' +
          response.name + '</h3>';

          var lastEditedEvent = getLastEditedEvent(data, uri);
          review_list += '<p>' + createLastEventText(lastEditedEvent) + '</p>';
        },
        error = function (response) {
          handleApiError(response);
        }));
    });

    $.when.apply($, pageDataRequests).then(function () {
      review_list += '</ul>';
      $('.fl-review-list-holder').html(review_list);
      updateReviewScreenWithCollection(data);
    });

    $('.fl-review-list-holder').on('click', '.fl-review-page-list-item', function () {
      var path = $(this).attr('data-path');
      //console.log('Collection row clicked for id: ' + path);
      if (path) {
        $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        $(this).addClass('fl-panel-review-page-item__selected');
        refreshPreview(path);
      }
    });

    editButton.click(function () {
      loadPageDataIntoEditor(collectionName, true);
      $('.fl-main-menu__item--review .fl-main-menu__link').removeClass('fl-main-menu__link--active');
      $('.fl-main-menu__item--edit .fl-main-menu__link').addClass('fl-main-menu__link--active');
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

  function createEventText(event) {
    var date = new Date(event.date);
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var dateView = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;

    var eventText = '';

    switch (event.type) {
      case 'EDITED':
        eventText = 'edited by ';
        break;
      case 'COMPLETED':
        eventText = 'completed by ';
        break;
      default:
        eventText = event.type + ' by ';
        break;
    }

    eventText += event.email + ' on ' + dateView;
    return eventText;
  }

  function createLastEventText(event) {
    return 'Last ' + createEventText(event);
  }
}

function updateReviewScreenWithCollection(collection) {
  var editButton = $('.fl-review-page-edit-button'),
    reviewButton = $('.fl-review-page-review-button');

  var path = getPathName(), pageIsComplete = false;
  var pageFile = path + '/data.json';

  if (!path) path = '/';

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

    var lastCompletedEvent = getLastCompletedEvent(collection, pageFile);
    if (lastCompletedEvent.email !== localStorage.getItem("loggedInAs")) {
      reviewButton.show();
    }

  } else {
    editButton.hide();
    reviewButton.hide();
  }
}

function updateReviewScreen(collectionName) {
  getCollection(collectionName,
    success = function (response) {
      updateReviewScreenWithCollection(response);
    },
    error = function (response) {
      handleApiError(response);
    });
}



