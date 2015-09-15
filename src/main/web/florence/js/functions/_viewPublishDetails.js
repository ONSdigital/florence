function viewPublishDetails(collections) {

  var manual = '[manual collection]';
  var result = {
    date: Florence.collectionToPublish.publishDate,
    subtitle: '',
    collectionDetails: [],
  }
  var pageDataRequests = []; // list of promises - one for each ajax request to load page data.
  var onlyOne = 0;

  $.each(collections, function (i, collectionId) {
    onlyOne += 1;
    pageDataRequests.push(
      getCollectionDetails(collectionId,
        success = function (response) {
          if (result.date === manual) {
            result.collectionDetails.push({id: response.id, name: response.name, pageDetails: response.reviewed, pageType: 'manual'});
          } else {
            result.collectionDetails.push({id: response.id, name: response.name, pageDetails: response.reviewed});
          }
        },
        error = function (response) {
          handleApiError(response);
        }
      )
    );
  });

  if (onlyOne < 2) {
    result.subtitle = 'The following collection has been approved'
  } else {
    result.subtitle = 'The following collections have been approved'
  }

  $.when.apply($, pageDataRequests).then(function () {
//  console.log(result)
    var publishDetails = templates.publishDetails(result);
    $('.publish-selected').html(publishDetails);
    $('.collections-accordion').accordion({
      header: '.collections-section__head',
      heightStyle: "content",
      active: false,
      collapsible: true
    });

    $('.btn-collection-publish').click(function () {
      $('.js').prepend(
        "<div class='over'>" +
        "<div class='hourglass'>" +
        "<div class='top'></div>" +
        "<div class='bottom'></div>" +
        "</div>" +
        "</div>");
      var collection = $(this).closest('.collections-section').find('.collection-name').attr('data-id');
      publish(collection);
    });

    $('.btn-collection-unlock').click(function () {
      var collection = $(this).closest('.collections-section').find('.collection-name').attr('data-id');
      unlock(collection);
    });

    //page-list
    $('.page-item').click(function () {
      $('.page-list li').removeClass('selected');
      $('.page-options').hide();

      $(this).parent('li').addClass('selected');
      $(this).next('.page-options').show();
    });
    $('.publish-selected .btn-collection-cancel').click(function () {
      $('.publish-selected').animate({right: "-50%"}, 500);
      $('.publish-select').animate({marginLeft: "25%"}, 800);
      $('.publish-select-table tbody tr').removeClass('selected');
    });
  });
}
