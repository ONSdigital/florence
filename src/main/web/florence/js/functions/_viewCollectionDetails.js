function viewCollectionDetails(collectionName) {

  getCollection(collectionName,
    success = function (response) {
      console.log(response);
      populateCollectionDetails(response, collectionName);
    },
    error = function (response) {
      handleApiError(response);
    });

  $('.fl-work-on-collection-button').click(function () {
    document.cookie = "collection=" + collectionName + ";path=/";
    localStorage.setItem("collection", collectionName);
    viewController('workspace');
  });

  $('.fl-button--cancel').click(function () {
    //perhaps need to rethink this if we do decide to animate panel transitions within this view
    viewController('collections');
  });


  function populateCollectionDetails(data, collectionName) {

    var collection_summary =
      '<h1>' + data.name + '</h1>' +
      '<p>' + data.inProgressUris.length + ' Pages in progress</p>' +
      '<div class="fl-panel--collection-details-in-progress-container"></div>' +
      '<p>' + data.completeUris.length + ' Pages awaiting review</p>' +
      '<div class="fl-panel--collection-details-complete-container"></div>' +
      '<p>' + data.reviewedUris.length + ' Pages awaiting approval</p>' +
      '<div class="fl-panel--collection-details-reviewed-container"></div>';

    CreateUriListHtml(data.inProgressUris, collectionName, "fl-panel--collection-details-in-progress-container");
    CreateUriListHtml(data.completeUris, collectionName, "fl-panel--collection-details-complete-container");
    CreateUriListHtml(data.reviewedUris, collectionName, "fl-panel--collection-details-reviewed-container");

    $('.fl-panel--collection-details-container').html(collection_summary);

    function CreateUriListHtml(uris, collectionName, containerClass) {
      if (uris.length === 0)
        return '';

      var uri_list = '<ul>';
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      $.each(uris, function (i, uri) {
        pageDataRequests.push(getPageData(collectionName, uri,
          success = function (response) {
            var path = uri.replace('/data.json', '');
            path = path.length === 0 ? '/' : path;
            uri_list += '<li class="fl-collection-page-list-item" data-path="' + path + '">' +
            response.name + '</li>';
          },
          error = function (response) {
            handleApiError(response);
          }));

        console.log(data.eventsByUri[uri]);
      });

      $.when.apply($, pageDataRequests).then(function () {
        uri_list += '</ul>';
        $('.' + containerClass).html(uri_list);
      });
    }

    $('.fl-panel--collection-details-container').on('click', '.fl-collection-page-list-item', function () {
      var path = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + path);
      if (path) {
        //$('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        //$(this).addClass('fl-panel-review-page-item__selected');
        document.cookie = "collection=" + collectionName + ";path=/";
        localStorage.setItem("collection", collectionName);
        viewWorkspace(path);
        clearInterval(window.intervalID);
        window.intervalID = setInterval(function () {
          checkForPageChanged(function () {
            loadPageDataIntoEditor(collectionName, true);
          });
        }, window.intIntervalTime);
        enablePreview();
        loadPageDataIntoEditor(collectionName, true);
        //loadEditT4Screen(collectionName);
      }
    });
  }
}
