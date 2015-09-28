function viewPublish() {
var manual = '[manual collection]';

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (collections) {
    $(collections).each(function (i) {
      if (!collections[i].type || (collections[i].type === 'manual')) {
        collections[i].publishDate = manual;
      }
    });
      populatePublishTable(collections);
    },
    error: function (response) {
      handleApiError(response);
    }
  });

  var result = [];
  function populatePublishTable(collections) {


    var collectionsByDate = _.chain(collections)
      .filter( function(collection) { return collection.approvedStatus; })
      .sortBy('publishDate')
      .groupBy('publishDate')
      .value();

    for (var key in collectionsByDate) {
      var response = [];
      if (key === manual) {
        var formattedDate = manual;
      } else {
        var formattedDate = StringUtils.formatIsoFull(key);
      }
      $(collectionsByDate[key]).each(function (n) {
        var id = collectionsByDate[key][n].id;
        response.push(id);
      });
      result.push({date: formattedDate, ids: response});
    }

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
  }
}

