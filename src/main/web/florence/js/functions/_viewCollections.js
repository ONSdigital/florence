function viewCollections(collectionId) {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
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
      if(!collection.approvedStatus) {
        if (!collection.publishDate) {
          date = '[manual collection]';
          response.push({id: collection.id, name: collection.name, date: date});
        } else {
          var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
          response.push({id: collection.id, name: collection.name, date: formattedDate});
        }
      }
    });

    var collectionsHtml = templates.collectionList(response);
    $('.section').html(collectionsHtml);

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      viewCollectionDetails(collectionId);
    });

    $('form input[type=radio]').click(function () {
      if ($('form input[type=radio]:checked').val() === 'manual') {
        $('#day').hide();
        $('#month').hide();
        $('#year').hide();
        $('#time').hide();
      } else {
        $('#day').show();
        $('#month').show();
        $('#year').show();
        $('#time').show();
      }
    });

    $('.form-create-collection').submit(function (e) {
      e.preventDefault();
      createCollection();
    });

    if(collectionId) {
      $('.collections-select-table tr[data-id="' + collectionId + '"]')
        .addClass('selected');
      viewCollectionDetails(collectionId);
    }
  }
}