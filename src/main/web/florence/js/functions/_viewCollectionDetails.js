function viewCollectionDetails(collectionId) {

  getCollectionDetails(collectionId,
    success = function (response) {
      populateCollectionDetails(response, collectionId);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  function populateCollectionDetails(collection, collectionId) {

    Florence.setActiveCollection(collection);


    collection.date = StringUtils.formatIsoFullDateString(collection.publishDate);

    ProcessPages(collection.inProgress);
    ProcessPages(collection.complete);
    ProcessPages(collection.reviewed);

    var collectionHtml = window.templates.collectionDetails(collection);
    $('.collection-selected').html(collectionHtml).animate({right: "0%"}, 500);

    var approve = $('.btn-collection-approve');
    if (collection.inProgress.length === 0
      && collection.complete.length === 0
      && collection.reviewed.length > 0) {
      approve.show().click(function () {
        postApproveCollection(collection.id);
      });
    }
    else {
      // You can't approve collections unless there is nothing left to be reviewed
      approve.hide();
    }

    //page-list
    $('.page-item').click(function () {
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
      deleteContent(collectionId, path, function() { viewCollectionDetails(collectionId); }, error);
      console.log('File deleted');

    });

    $('.collection-selected .btn-edit-cancel').click(function () {
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function () {
        viewController('collections');
      }, 500);
    });

    $('.btn-collection-work-on').click(function () {
      createWorkspace('', collectionId, 'browse');
    });

    $('.btn-collection-approve').click(function () {
      approve(collectionId);
    });
  }

  function ProcessPages(pages) {
    _.each(pages, function (page) {
      page.uri = page.uri.replace('/data.json', '')
      return page;
    });
  }
}
