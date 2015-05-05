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
      var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
      response.push({id: collection.id, name: collection.name, date: formattedDate});
    });

    var collectionsHtml = templates.collections(response);
    $('.section').html(collectionsHtml);

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      viewCollectionDetails(collectionId);
    });

    $('.form-create-collection').submit(function (e) {
      e.preventDefault();
      createCollection();
    });
  }
}