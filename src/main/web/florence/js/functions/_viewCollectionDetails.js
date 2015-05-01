function viewCollectionDetails(collectionId) {

  console.log(collectionId)

  getCollection(collectionId,
    success = function (response) {
      populateCollectionDetails(response, collectionId);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function populateCollectionDetails(collection, collectionId) {

    Florence.setActiveCollection(collection);

    // start building the data object for the template.
    var collectionDetails = {
      name: Florence.collection.name,
      date: Florence.collection.date
    };


    if (collection.inProgressUris !== 0 || collection.completeUris !== 0) {
      // You can't approve collections unless there is nothing left to be reviewed
      $('.fl-finish-collection-button').hide();
    }
    else {
      $('.fl-finish-collection-button').show().click(function () {
        postApproveCollection(collection.id);
      });
    }

    CreateUriListHtml(collection.inProgressUris, collectionId, "inProgress");
    CreateUriListHtml(collection.completeUris, collectionId, "completed");
    CreateUriListHtml(collection.reviewedUris, collectionId, "reviewed");

    function CreateUriListHtml(uris, collectionId, status) {
      var uri_list = [];
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
      var collectionHtml;
      $.each(uris, function (i, uri) {
        if (uri.length === 0) {
          collectionDetails[status] = [];
        } else {
          pageDataRequests.push(getPageData(collectionId, uri,
            success = function (response) {
              var path = response.uri ? response.uri : uri.replace('/data.json', '');
              var pageTitle = response.title ? response.title : response.name;
              uri_list.push({path: path, name: pageTitle});
            },
            error = function (response) {
              handleApiError(response);
            })
          );
        }
      });

      $.when.apply($, pageDataRequests).then(function () {
        collectionDetails[status] = uri_list;

        collectionHtml = window.templates.collection(collectionDetails);
        $('.collection-selected').html(collectionHtml).animate({right: "0%"}, 500);

        //page-list
        $('.page-item').click(function() {
          $('.page-list li').removeClass('selected');
          $('.page-options').hide();

          $(this).parent('li').addClass('selected');
          $(this).next('.page-options').show();
        });

        $('.btn-page-edit').click(function () {
          var path = $(this).attr('data-path');
            createWorkspace(path, collectionId, 'edit');
        });
        $('.btn-page-delete').click(function () {
          var path = $(this).attr('data-path')
            deleteContent(collectionId, path, success, error);
            console.log('File deleted');
            viewCollectionDetails(collectionId);
        });
        $('.btn-collection-work-on').click(function () {
          createWorkspace('', collectionId, 'browse');
        });

        $('.collection-selected .btn-cancel').click(function(){
          $('.collection-selected').stop().animate({right: "-50%"}, 500);
          $('.collections-select-table tbody tr').removeClass('selected');
          // Wait until the animation ends
          setTimeout(function(){
            viewController('collections');
          }, 500);
        });
      });
    }
  }
}
