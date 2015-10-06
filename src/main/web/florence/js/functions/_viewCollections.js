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

  function populateReleases() {

    var releases = [];
    var baseReleaseUri = "/releasecalendar/data?view=upcoming";

    function getReleasesPage(i, releases) {
      var dfd = $.Deferred();
      $.ajax({
        url: baseReleaseUri + '&page=' + i,
        type: "get",
        success: function (data) {
          console.log('populating releases for page ' + i);
          console.log(data);
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

    $.ajax({
        url: baseReleaseUri,
        type: "get",
        success: function (data) {

          var pageSize = 10;
          _(data.results).each(function (release) {
            releases.push(release);
          });

          console.log('populating releases!');
          console.log(data);

          // if there are more results than the existing page size, go get them.
          if (data.numberOfResults > pageSize) {

            var pagesToGet = Math.ceil((data.numberOfResults - pageSize) / pageSize);
            var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

            for (var i = 2; i < pagesToGet + 2; i++) {
              console.log("Calling release list for page " + baseReleaseUri + '&page=' + i);
              var dfd = getReleasesPage(i, releases);
              pageDataRequests.push(dfd);
            }

            $.when.apply($, pageDataRequests).then(function () {
              console.log('Finished getting all release pages');
              populateReleasesDropdown(releases);
            });
          }
        },
        error: function (response) {
          handleApiError(response);
        }
      }
    );

    function populateReleasesDropdown(releases) {

      var releaseSelect = $('#collection-release');

      _(_.sortBy(releases, 'uri')).each(function (release) {
        //console.log('release: ' + release.uri);
        //console.log(release);
        releaseSelect.append(new Option(release.description.title, release.uri));
      });
    }
  }
}