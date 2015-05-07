function viewPublishDetails(collections) {

  var result = {
    date: Florence.collectionToPublish.publishDate,
    collectionDetails: [],
  }
  var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

  $.each(collections, function (i, collectionId) {
    pageDataRequests.push(
      getCollectionDetails(collectionId,
        success = function (response) {
          console.log(response);
          response.reviewed = response.reviewed.filter(function(page) { return PathUtils.isJsonFile(page.uri) });
          result.collectionDetails.push({id: response.id, name: response.name, pageDetails: response.reviewed});
        },
        error = function (response) {
          handleApiError(response);
        }
      )
    );
  });
  $.when.apply($, pageDataRequests).then(function () {
    var publishDetails = templates.publishDetails(result);
//    console.log(publishDetails);
    $('.publish-selected').html(publishDetails);
    $('.collections-accordion').accordion({
      header: '.collections-section__head',
      heightStyle: "content",
      active: false,
      collapsible: true
    });
    //page-list
    $('.page-item').click(function(){
      $('.page-list li').removeClass('selected');
      $('.page-options').hide();

      $(this).parent('li').addClass('selected');
      // $(this).addClass('page-item--selected');
      $(this).next('.page-options').show();
    });
    $('.publish-selected .btn-cancel').click(function(){
      $('.publish-selected').animate({right: "-50%"}, 500);
      $('.publish-select').animate({marginLeft: "25%"}, 800);
      $('.publish-select-table tbody tr').removeClass('selected');
    });
  });
}
