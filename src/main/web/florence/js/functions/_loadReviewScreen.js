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
    var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

    $.each(data.completeUris, function(i, item) {
      pageDataRequests.push(getPageData(collectionName, item,
        success=function(response) {
          review_list += '<li class="fl-review-page-list-item" data-path="' + item.uri + '">' + item.name + '</li>';
          console.log("Got page content for " + response.name);
        },
        error=function(response) {
          handleApiError(response);
        }));
    });

    $.when.apply($, pageDataRequests).then(function () {
      console.log(arguments); //it is an array like object which can be looped

      review_list += '</ul>';
      $('.fl-review-list-holder').html(review_list);

      console.log(review_list);

      $.each(arguments, function (i, data) {
        console.log(data); //data is the value returned by each of the ajax requests
      });
    });

    $('.fl-review-page-list-item').click(function() {
      var pageUrl = $(this).attr('data-path');
      console.log('Collection row clicked for id: ' + pageUrl);
      if(pageUrl) {
        $('.fl-review-page-list-item').removeClass('fl-panel-review-page-item__selected');
        $(this).addClass('fl-panel-review-page-item__selected');
        setupPageLocation(pageUrl)
      }
    });
  }

}


