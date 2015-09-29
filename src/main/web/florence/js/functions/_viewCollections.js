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

  populateReleases();

  var response = [];

  function populateCollectionTable(data) {
    $.each(data, function (i, collection) {
      if (!collection.approvedStatus) {
        if (!collection.publishDate) {
          date = '[manual collection]';
          response.push({id: collection.id, name: collection.name, date: date});
        } else if (collection.publishDate && collection.type === 'manual') {
          var formattedDate = StringUtils.formatIsoDateString(collection.publishDate) + ' [rolled back]';
          response.push({id: collection.id, name: collection.name, date: formattedDate});
        } else {
          var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
          response.push({id: collection.id, name: collection.name, date: formattedDate});
        }
      }
    });

    var collectionsHtml = templates.collectionList(response);
    $('.section').html(collectionsHtml);

    if (collectionId) {
      $('.collections-select-table tr[data-id="' + collectionId + '"]')
        .addClass('selected');
      viewCollectionDetails(collectionId);
    } else {
      $('.collections-select-table tbody tr').click(function () {
        $('.collections-select-table tbody tr').removeClass('selected');
        $(this).addClass('selected');
        var collectionId = $(this).attr('data-id');
        viewCollectionDetails(collectionId);
      });
    }

    $('form input[type=radio]').click(function () {

      console.log();

      if ($(this).val() === 'manual') {
        $('#scheduledPublishOptions').hide();
        $('#releasePublishOptions').hide();
      } else if ($(this).val() === 'release') {
        $('#releasePublishOptions').show();
        $('#scheduledPublishOptions').hide();
      } else if ($(this).val() === 'scheduled') {
        $('#releasePublishOptions').hide();
        $('#scheduledPublishOptions').show();
      }
    });

    var noBefore = function (date) {
      if (date < new Date()) {
        return [false];
      }
      return [true];
    }


    $(function () {
      var today = new Date();
      $('#date').datepicker({
        minDate: today,
        dateFormat: 'dd/mm/yy',
        constrainInput: true,
        beforeShowDay: noBefore
      });
    });

    $('.form-create-collection').submit(function (e) {
      e.preventDefault();
      createCollection();
    });
  }

  function populateReleases() {
    $.ajax({
      url: "/releasecalendar/data?view=upcoming",
      type: "get",
      success: function (data) {
        //console.log('populating releases!');
        //console.log(data);
        populateReleasesDropdown(data);
      },
      error: function (response) {
        handleApiError(response);
      }
    });

    function populateReleasesDropdown(data) {

      var releaseSelect = $('#collection-release');

      _(data.results).each(function (release) {
        //console.log('release: ' + release.uri);
        //console.log(release);
        releaseSelect.append( new Option(release.description.title, release.uri) );
      });
    }

  }
}