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
    console.log(JSON.stringify(result));
  });

  $('.collections-accordion').accordion({
    header: '.collections-section__head',
    active: false,
    collapsible: true
  });

  $('.publish-selected .btn-cancel').click(function(){
    $('.publish-selected').animate({right: "-50%"}, 500);
    $('.publish-select').animate({marginLeft: "25%"}, 800);
    $('.publish-select-table tbody tr').removeClass('selected');
  });
}
