function loadReviewScreen(collectionName){

  // todo if the current page being browsed is in the review list, then select it
  //var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  //var pageurldata = "/data" + pageurl.split("#!")[1];

  getCollection(collectionName,
    success = function(response) {
      console.log(response);
      populateAwaitingReviewList(response);
    },
    error = function(response) {
      handleApiError(response)
    });

  function populateAwaitingReviewList(data) {

    var review_list = '<ul>';

    $.each(data.completeUris, function(i, item) {


      review_list += '<li>' + item + '</li>';

      // display only the path

      // store the actual file in data attribute

      // add click handler to navigate to that page

      // maintain the currently selected file.
    });

    review_list += '</ul>';

    $('.fl-review-list-holder').html(review_list);

    //$('.fl-collections-table-row').click(function() {
    //
    //  console.log('Collection row clicked for id: ' + $(this).attr('data-id'));
    //  var collectionId = $(this).attr('data-id');
    //
    //  if(collectionId) {
    //
    //    $('.fl-panel--collections').removeClass('fl-panel--collections__not-selected');
    //    $('.fl-panel--collection-details').show();
    //    $('.fl-create-collection-button').hide();
    //
    //    $(this).addClass('fl-panel--collections__selected');
    //
    //    viewCollectionDetails(collectionId);
    //  }
    //});
  }

}


