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

    if (!collection.publishDate) {
      collection.date = '[manual collection]';
    } else {
      collection.date = StringUtils.formatIsoFullDateString(collection.publishDate);
    }

    ProcessPages(collection.inProgress);
    ProcessPages(collection.complete);
    ProcessPages(collection.reviewed);

    var collectionHtml = window.templates.collectionDetails(collection);
    $('.collection-selected').html(collectionHtml).animate({right: "0%"}, 500);

    var deleteButton = $('#collection-delete');
    if (collection.inProgress.length === 0
      && collection.complete.length === 0
      && collection.reviewed.length === 0) {
        deleteButton.show().click(function () {
          var result = confirm("Are you sure you want to delete this collection?");
          if (result === true) {
            deleteCollection(collectionId,
            function () {
            alert('Collection deleted');
            viewCollections();
            },
            function (error) {
              viewCollectionDetails(collectionId);
              alert(error + ' File has not been deleted. Contact an administrator');
            })
          } else {}
        });
      }
      else {
        deleteButton.hide();
      }

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
      var safePath = checkPathSlashes(path);
      createWorkspace(safePath, collectionId, 'edit');
    });
    $('.page-delete').click(function () {
      var result = confirm("Are you sure you want to delete this page from the collection?");
      if (result === true) {
        var path = $(this).attr('data-path');
        deleteContent(collectionId, path, function() {
            viewCollectionDetails(collectionId);
            alert('File deleted');
          }, function(error) {
            viewCollectionDetails(collectionId);
            alert(error + ' File has not been deleted. Contact an administrator');
          }
        );
      }
    });

    $('.collection-selected .btn-collection-cancel').click(function () {
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

    setCollectionDetailsHeight();
  }

  function ProcessPages(pages) {
    _.sortBy(pages, 'uri');
    _.each(pages, function (page) {
      page.uri = page.uri.replace('/data.json', '');
      return page;
    });
  }

  function setCollectionDetailsHeight(){
    var panelHeight = parseInt($('.collection-selected').height());

    var headHeight = parseInt($('.section-head').height());
    var headPadding = parseInt($('.section-head').css('padding-bottom'));
    
    var contentPadding = parseInt($('.section-content').css('padding-bottom'));
    
    var navHeight = parseInt($('.section-nav').height());
    var navPadding = (parseInt($('.section-nav').css('padding-bottom')))+(parseInt($('.section-nav').css('padding-top')));

    var contentHeight = panelHeight-(headHeight+headPadding+contentPadding+navHeight+navPadding);
    $('.section-content').css('height', contentHeight);
  }
}