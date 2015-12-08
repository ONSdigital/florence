/**
 * Load the release selector screen and populate the list of available releases.
 */
function viewReleaseSelector() {

  var html = templates.releaseSelector();
  $('body').append(html);

  var releases = [];
  PopulateReleasesForUri("/releasecalendar/data?view=upcoming", releases);

  $('.btn-release-selector-cancel').on('click', function () {
    $('.release-select').stop().fadeOut(200).remove();
  });

  $('#release-search-input').on('input', function () {
    var searchText = $(this).val();
    populateReleasesList(releases, searchText)
  });

  function PopulateReleasesForUri(baseReleaseUri, releases) {
    //console.log("populating release for uri " + baseReleaseUri);
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

  /**
   * Take the data from the response of getting the first release page and
   * determine if there are any more pages to get.
   * @param data
   */
  function populateRemainingReleasePages(data, releases, baseReleaseUri) {
    var pageSize = 10;
    _(data.result.results).each(function (release) {
      releases.push(release);
    });

    // if there are more results than the existing page size, go get them.
    if (data.result.numberOfResults > pageSize) {

      var pagesToGet = Math.ceil((data.result.numberOfResults - pageSize) / pageSize);
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      for (var i = 2; i < pagesToGet + 2; i++) {
        var dfd = getReleasesPage(baseReleaseUri, i, releases);
        pageDataRequests.push(dfd);
      }

      $.when.apply($, pageDataRequests).then(function () {
        populateReleasesList(releases);
      });
    } else {
      populateReleasesList(releases);
    }
  }

  /**
   * Get the release page for the given index and add the response to the given releases array.
   * @param i
   * @param releases
   * @returns {*}
   */
  function getReleasesPage(baseReleaseUri, i, releases) {
    //console.log("getting page  " + i + " for " + baseReleaseUri);
    var dfd = $.Deferred();
    $.ajax({
      url: baseReleaseUri + '&page=' + i,
      type: "get",
      success: function (data) {
        _(data.result.results).each(function (release) {
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

  /**
   * Populate the releases list from the given array of releases.
   * @param releases
   */
  function populateReleasesList(releases, filter) {
    var releaseList = $('#release-list');
    releaseList.find('tr').remove(); // remove existing table entries

    _(_.sortBy(releases, function (release) {
      return release.description.releaseDate
    }))
      .each(function (release) {
        if (!filter || (release.description.title.toUpperCase().indexOf(filter.toUpperCase()) > -1)) {
          var date = StringUtils.formatIsoFullDateString(release.description.releaseDate);
          releaseList.append('<tr data-id="' + release.description.title + '" data-uri="' + release.uri + '"><td>' + release.description.title + '</td><td>' + date + '</td></tr>');
        }
      });

    releaseList.find('tr').on('click', function () {
      var releaseTitle = $(this).attr('data-id');
      var releaseUri = $(this).attr('data-uri');
      Florence.CreateCollection.selectedRelease = {uri: releaseUri, title: releaseTitle};

      $('.selected-release').text(releaseTitle);
      $('.release-select').stop().fadeOut(200).remove();
    })
  }
}