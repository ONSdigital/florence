function viewCollectionDetails(collectionName) {

  getCollection(collectionName,
    success = function (response) {
      populateCollectionDetails(response, collectionName);
    },
    error = function (response) {
      handleApiError(response);
    });

  $('.fl-work-on-collection-button').unbind('click'); // View gets reloaded so unbind click handlers
  $('.fl-work-on-collection-button').click(function () {
    document.cookie = "collection=" + collectionName + ";path=/";
    localStorage.setItem("collection", collectionName);
    viewController('workspace');
  });

  $('.fl-delete-collection-button').unbind('click');
  $('.fl-delete-collection-button').click(function () {
    console.log('About to delete collection ' + collectionName);
    // Run delete content
    deleteCollection(collectionName,
      success = function (response) { // On success update the screen
        viewController('collections');
        console.log('Content deleted for collection: ' + collectionName);
      },
      error = function (response) {
        handleApiError(response);
      })
  });

  $('.fl-button--cancel').unbind('click');
  $('.fl-button--cancel').click(function () {
    //perhaps need to rethink this if we do decide to animate panel transitions within this view
    viewController('collections');
  });


  function populateCollectionDetails(collection, collectionName) {

    if (collection.inProgressUris != 0 || collection.completeUris != 0) {
      // You can't approve collections unless there is nothing left to be reviewed
      $('.fl-finish-collection-button').hide();
    }
    else {
      $('.fl-finish-collection-button').show();

      $('.fl-finish-collection-button').click(function () {
        postApproveCollection(collection.id)
      })
    }

    function isJsonFile(uri) { return uri.indexOf('data.json', uri.length - 'data.json'.length) !== -1 }
    collection.inProgressUris = collection.inProgressUris.filter(function(uri) { return isJsonFile(uri) });
    collection.completeUris = collection.completeUris.filter(function(uri) { return isJsonFile(uri) });
    collection.reviewedUris = collection.reviewedUris.filter(function(uri) { return isJsonFile(uri) });

    var collection_summary =
      '<h1>' + collection.name + '</h1>' +
      '<p>' + collection.inProgressUris.length + ' Pages in progress</p>' +
      '<div class="fl-panel--collection-details-in-progress-container"></div>' +
      '<p>' + collection.completeUris.length + ' Pages awaiting review</p>' +
      '<div class="fl-panel--collection-details-complete-container"></div>' +
      '<p>' + collection.reviewedUris.length + ' Pages awaiting approval</p>' +
      '<div class="fl-panel--collection-details-reviewed-container"></div>';

    CreateUriListHtml(collection.inProgressUris, collectionName, "fl-panel--collection-details-in-progress-container");
    CreateUriListHtml(collection.completeUris, collectionName, "fl-panel--collection-details-complete-container");
    CreateUriListHtml(collection.reviewedUris, collectionName, "fl-panel--collection-details-reviewed-container");

    $('.fl-panel--collection-details-container').html(collection_summary);

    function CreateUriListHtml(uris, collectionName, containerClass) {
      if (uris.length === 0)
        return '';

      var uri_list = '<ul>';
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      $.each(uris, function (i, uri) {

        // only request the json files.
        pageDataRequests.push(getPageData(collectionName, uri,
          success = function (response) {
            var path = uri.replace('/data.json', '');
            path = path.length === 0 ? '/' : path;
            uri_list += '<li class="fl-collection-page-list-item" data-path="' + path + '">' +
            response.name + '</li><button class="fl-button fl-button--delete" data-path="' + path + '">Delete</button>';
          },
          error = function (response) {
            handleApiError(response);
          }));
      });

      $.when.apply($, pageDataRequests).then(function () {
        uri_list += '</ul>';
        $('.' + containerClass).html(uri_list);
      });
    }

    // Click to go to editor function
    $('.fl-panel--collection-details-container').on('click', '.fl-collection-page-list-item', function () {
      var path = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + path);
      if (path) {
        //$('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        //$(this).addClass('fl-panel-review-page-item__selected');
        document.cookie = "collection=" + collectionName + ";path=/";
        localStorage.setItem("collection", collectionName);
        viewWorkspace(path);
        $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
        $('.fl-main-menu__item--edit .fl-main-menu__link').addClass('fl-main-menu__link--active');
        clearInterval(window.intervalID);
        window.intervalID = setInterval(function () {
          checkForPageChanged(function () {
            loadPageDataIntoEditor(collectionName, true);
          });
        }, window.intIntervalTime);
      }
    });

    // Delete function
    $('.fl-panel--collection-details-container').on('click', '.fl-button--delete', function () {
      var path = $(this).attr('data-path');

      // Run delete content
      deleteContent(collectionName, path,
        success = function (response) { // On success update the screen
          viewCollectionDetails(collectionName);
          console.log('Content deleted for id: ' + path);
        },
        error = function (response) {
          handleApiError(response);
        })

    });

  }
}
