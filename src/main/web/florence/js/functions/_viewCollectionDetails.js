function viewCollectionDetails(collectionName) {

  getCollection(collectionName,
    success = function (response) {
      populateCollectionDetails(response, collectionName);
    },
    error = function (response) {
      handleApiError(response);
    });

  $('.btn-collection-work-on').click(function () {
    document.cookie = "collection=" + collectionName + ";path=/";
    localStorage.setItem("collection", collectionName);
    viewController('workspace');
  });

  $('.collection-selected .btn-cancel').click(function(){
    $('.collection-selected').animate({right: "-50%"}, 500);
    $('.collections-select-table tbody tr').removeClass('selected');
    viewController('collections');
  });

  //page-list
  $('.page-item').click(function(){
    $('.page-list li').removeClass('selected');
    $('.page-options').hide();

    $(this).parent('li').addClass('selected');
    // $(this).addClass('page-item--selected');
    $(this).next('.page-options').show();

  });

  function populateCollectionDetails(collection, collectionName) {

    if (collection.inProgressUris != 0 || collection.completeUris != 0) {
      // You can't approve collections unless there is nothing left to be reviewed
      $('.fl-finish-collection-button').hide();
    }
    else {
      $('.fl-finish-collection-button').show().click(function () {
        postApproveCollection(collection.id)
      })
    }

    CreateUriListHtml(collection.inProgressUris, collectionName, inProgress);
    CreateUriListHtml(collection.completeUris, collectionName, completed);
    CreateUriListHtml(collection.reviewedUris, collectionName, reviewed);

    function CreateUriListHtml(uris, collectionName, status) {
      if (uris.length === 0)
        return '';

      var uri_list = [];
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      $.each(uris, function (i, uri) {
        pageDataRequests.push(getPageData(collectionName, uri,
          success = function (response) {
            var path = uri.replace('/data.json', '');
            path = path.length === 0 ? '/' : path;
            uri_list.push({path:path, name:response.name});
          },
          error = function (response) {
            handleApiError(response);
          }));
      });

      $.when.apply($, pageDataRequests).then(function () {
        return {status:status, list:uri_list};
      });
    }

    $('.btn-page-edit').click(function () {
      var path = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + path);
      if (path) {
        //$('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        //$(this).addClass('fl-panel-review-page-item__selected');
        document.cookie = "collection=" + collectionName + ";path=/";
        localStorage.setItem("collection", collectionName);
        viewWorkspace(path);
        $('.fl-main-menu__item--browse .fl-main-menu__link').removeClass('fl-main-menu__link--active');
        $('.fl-main-menu__item--edit .fl-main-menu__link').addClass('fl-main-menu__link--active');
        clearInterval(window.intervalID);
        window.intervalID = setInterval(function () {
          checkForPageChanged(function () {
            loadPageDataIntoEditor(collectionName, true);
          });
        }, window.intIntervalTime);
      }
    });
  }
}
