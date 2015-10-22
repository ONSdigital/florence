/**
 * Load the release selector screen and populate the list of available releases.
 */
function viewReleaseSelector() {

  var releases = [];
  var baseReleaseUri = "/releasecalendar/data?view=upcoming";

  var html = templates.releaseSelector();
  $('body').append(html);

  populateReleases();

  /**
   * Get the first page of release pages and see if there any others to add.
   */
  function populateReleases() {
    $.ajax({
        url: baseReleaseUri,
        type: "get",
        success: function (data) {
          populateAnyOtherPages(data);
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
  function populateAnyOtherPages(data) {
    var pageSize = 10;
    _(data.results).each(function (release) {
      releases.push(release);
    });

    // if there are more results than the existing page size, go get them.
    if (data.numberOfResults > pageSize) {

      var pagesToGet = Math.ceil((data.numberOfResults - pageSize) / pageSize);
      var pageDataRequests = []; // list of promises - one for each ajax request to load page data.

      for (var i = 2; i < pagesToGet + 2; i++) {
        var dfd = getReleasesPage(i, releases);
        pageDataRequests.push(dfd);
      }

      $.when.apply($, pageDataRequests).then(function () {
        populateReleasesList(releases);
      });
    }
  }

  /**
   * Get the release page for the given index and add the response to the given releases array.
   * @param i
   * @param releases
   * @returns {*}
   */
  function getReleasesPage(i, releases) {
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

  /**
   * Populate the releases list from the given array of releases.
   * @param releases
   */
  function populateReleasesList(releases) {
    var releaseList = $('#release-list');
    _(_.sortBy(releases, 'uri')).each(function (release) {
      console.log(release);
      var date = StringUtils.formatIsoFullDateString(release.description.releaseDate);
      releaseList.append('<tr data-id="' + release.description.title + '" data-uri="' + release.uri + '"><td>' + release.description.title + '</td><td>' + date + '</td></tr>');
    });

    releaseList.find('tr').on('click', function () {
      var releaseTitle = $(this).attr('data-id');
      var releaseUri = $(this).attr('data-uri');
      //console.log(releaseTitle);
      Florence.CreateCollection.selectedRelease = {uri: releaseUri, title: releaseTitle};

      $('.selected-release').text(releaseTitle);
      $('.release-select').stop().fadeOut(200).remove();
    })
  }
}