function viewPublish() {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (collections) {
      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

 var response = [];
 var result = [];
  function populatePublishTable(collections) {

    var collectionsByDate = _.chain(collections)
      .filter( function(collection) { return collection.approvedStatus; })
      .sortBy('publishDate')
      .groupBy('publishDate')
      .value();

    _.mapObject(collectionsByDate, function (val, key) {
      var formattedDate = StringUtils.formatIsoFullDateString(key);
      $.each(val, function (i) {
        response.push(val[i].id)
      });

      result.push({date: formattedDate, ids: response});
    });

    var publishList = templates.publishList(result);
    $('.section').html(publishList);

    $('.publish-select-table tbody tr').click(function(){
      var collections = $(this).attr('data-collections').split(',');
      Florence.collectionToPublish.publishDate = $(this).find('td').html();
      viewPublishDetails(collections);

      $('.publish-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      $('.publish-selected').animate({right: "0%"}, 800);
      $('.publish-select').animate({marginLeft: "0%"}, 500);
    });

//    $('.publish-selected .btn-cancel').click(function(){
//      $('.publish-selected').animate({right: "-50%"}, 500);
//      $('.publish-select').animate({marginLeft: "25%"}, 800);
//      $('.publish-select-table tbody tr').removeClass('selected');
//    });
  }
}

