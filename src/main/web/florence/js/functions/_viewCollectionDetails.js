function viewCollectionDetails(collectionName) {

  var collectionDetails = {
    name: "",
    date: "",
  };

  getCollection(collectionName,
    success = function (response) {
      collectionDetails.name = response.name;
      var date = new Date(response.publishDate);
      var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
      var formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
      collectionDetails.date = formattedDate;
      populateCollectionDetails(response, collectionName);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

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

    CreateUriListHtml(collection.inProgressUris, collectionName, "inProgress");
    CreateUriListHtml(collection.completeUris, collectionName, "completed");
    CreateUriListHtml(collection.reviewedUris, collectionName, "reviewed");

    function CreateUriListHtml(uris, collectionName, status) {
      var uri_list = [];
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
      var collectionHtml;
      $.each(uris, function (i, uri) {
          if (uri.length === 0) {
            collectionDetails[status] = [];
          } else {
            pageDataRequests.push(getPageData(collectionName, uri,
              success = function (response) {
                var path = response.uri;
                uri_list.push({path: path, name: response.title});
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
          if (path) {
            //document.cookie = "collection=" + collectionName + ";path=/";
            //localStorage.setItem("collection", collectionName);
            viewWorkspace(path, collectionName, 'edit');
          }
        });
        $('.btn-collection-work-on').click(function () {
          //document.cookie = "collection=" + collectionName + ";path=/";
          //localStorage.setItem("collection", collectionName);
          viewWorkspace('', collectionName, 'browse');
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
