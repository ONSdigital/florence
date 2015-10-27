function viewCollections(collectionId) {

  $.ajax({
    url: "/zebedee/collections",
    type: "get",
    success: function (data) {
      populateCollectionTable(data);
      populateReleases();
    },
    error: function (jqxhr) {
      handleApiError(jqxhr);
    }
  });

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
    }

    $('.collections-select-table tbody tr').click(function () {
      $('.collections-select-table tbody tr').removeClass('selected');
      $(this).addClass('selected');
      var collectionId = $(this).attr('data-id');
      viewCollectionDetails(collectionId);
    });

    $('form input[type=radio]').click(function () {

      if ($(this).val() === 'manual') {
        $('#scheduledPublishOptions').hide();
      } else if ($(this).val() === 'scheduled') {
        $('#scheduledPublishOptions').show();
      } else if ($(this).val() === 'custom') {
        $('#customScheduleOptions').show();
        $('#releaseScheduleOptions').hide();
      } else if ($(this).val() === 'release') {
        $('#customScheduleOptions').hide();
        $('#releaseScheduleOptions').show();
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

  function populateReleasesDropdown(releases) {
    var releaseSelect = $('#collection-release');
    releaseSelect.find('option').remove();
    _(_.sortBy(releases, 'uri')).each(function (release) {
      releaseSelect.append(new Option(release.description.title, release.uri));
    });
  }


  function populateReleases() {
    var releases = [];

    PopulateReleasesForUri("/releasecalendar/data?view=upcoming", releases);
    PopulateReleasesForUri("/releasecalendar/data", releases);
  }

  function populateRemainingReleasePages(data, releases, baseReleaseUri) {
    var pageSize = 10;
    _(data.results).each(function (release) {
      releases.push(release);
    });

    console.log("data.numberOfResults:  " + data.numberOfResults + " for " + baseReleaseUri);

    // if there are more results than the existing page size, go get them.
    if (data.numberOfResults > pageSize) {


      var pagesToGet = Math.ceil((data.numberOfResults - pageSize) / pageSize);
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      for (var i = 2; i < pagesToGet + 2; i++) {
        var dfd = getReleasesPage(baseReleaseUri, i, releases);
        pageDataRequests.push(dfd);
      }

      $.when.apply($, pageDataRequests).then(function () {
        populateReleasesDropdown(releases);
      });
    } else {
      populateReleasesDropdown(releases);
    }
  }


  function getReleasesPage(baseReleaseUri, i, releases) {

    console.log("getting page  " + i + " for " + baseReleaseUri);

    var dfd = $.Deferred();
    $.ajax({
      url: baseReleaseUri + '&page=' + i,
      type: "get",
      success: function (data) {
        _(data.results).each(function (release) {
          releases.push(release);
        });
        dfd.resolve();
      },
      error: function (response) {
        handleApiError(response);
        dfd.resolve();
      }
    });
    return dfd;
  }


  function PopulateReleasesForUri(baseReleaseUri, releases) {
    console.log("populating release for uri " + baseReleaseUri);
    $.ajax({
        url: baseReleaseUri,
        type: "get",
        success: function (data) {
          populateRemainingReleasePages(data, releases, baseReleaseUri);
        },
        error: function (response) {
          handleApiError(response);
        }
      }
    );
  }

}