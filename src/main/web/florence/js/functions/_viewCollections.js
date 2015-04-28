function viewCollections() {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    crossDomain: true,
    success: function (data) {
      populateCollectionTable(data);
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

  var response = [];
  function populateCollectionTable(data) {
    $.each(data, function (i, collection) {
      var id = collection.id;
      var name = collection.name;
      var date = new Date(collection.publishDate);
      var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
      var formattedDate = $.datepicker.formatDate('dd/mm/yy', date) + ' ' + date.getHours() + ':' + minutes;
      response.push({id: id, name: name, date: formattedDate});
    });

    var collectionsHtml = templates.collections(response);
    $('.section').html(collectionsHtml);

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      Florence.collection = {name: $(this).find(".collection-name").html(), date: $(this).find(".collection-date").html()};
      viewCollectionDetails(collectionId);
    });

    //click handlers
    //$('.btn-collection-create').unbind("click").click(function () {
    $('.btn-collection-create').click(function () {
      createCollection();
    });
  }
}


