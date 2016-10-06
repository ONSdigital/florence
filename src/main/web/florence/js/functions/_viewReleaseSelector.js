/**
 * Load the release selector screen and populate the list of available releases.
 */
function viewReleaseSelector() {

    var stubbedData = {"type":"list","listType":"releasecalendar","uri":"/releasecalendar/data","result":{"numberOfResults":489,"took":25,"results":[{"_type":"release","description":{"summary":"Inputs, output and productivity estimates for public services in the UK between 1997 and 2012 and new estimates for 2013.","nextRelease":"","releaseDate":"2016-02-18T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"UK total public services, productivity estimates: 2013","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/uktotalpublicservicesproductivityestimates2013"},{"_type":"release","description":{"summary":"","nextRelease":"","releaseDate":"2016-03-15T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Consumer price inflation basket of goods and services: 2016","nationalStatistic":true,"unit":"","contact":{"name":"","telephone":"","email":""},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/consumerpriceinflationbasketofgoodsandservices2016"},{"_type":"release","description":{"summary":"The number of deaths registered in England and Wales in the latest eight weeks for which data are available.","nextRelease":"","releaseDate":"2016-03-15T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Deaths registered in England and Wales, weekly provisional: ending 4 March 2016","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/deathsregisteredinenglandandwalesweeklyprovisionalending4march2016"},{"_type":"release","description":{"summary":"The value of UK exports and imports of goods, grouped by product.","nextRelease":"","releaseDate":"2016-03-16T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"UK trade in goods by classification of product by activity (CPA 08): Oct to Dec 2015","nationalStatistic":false,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/uktradeingoodsbyclassificationofproductbyactivitycpa08octtodec2015"},{"_type":"release","description":{"summary":"Employment, unemployment, inactivity, jobs and the Claimant Count for regions, local authorities and parliamentary constituencies.","nextRelease":"","releaseDate":"2016-03-16T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Regional labour market statistics: March 2016","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/regionallabourmarketstatisticsmarch2016"},{"_type":"release","description":{"summary":"The release includes employment, unemployment, economic inactivity, claimant count, average earnings, vacancies and labour disputes statistics.","nextRelease":"","releaseDate":"2016-03-16T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Labour market statistics: March 2016","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/labourmarketstatisticsmarch2016"},{"_type":"release","description":{"summary":"Quarterly comparisons on a headcount and full-time equivalent basis, by sector, industry and region. Made up of central and local government and public corporations, such as the NHS and civil service.","nextRelease":"","releaseDate":"2016-03-16T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Public sector employment, UK: Oct to Dec 2015","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/publicsectoremploymentukocttodec2015"},{"_type":"release","description":{"summary":"Investment choices of insurance companies, self-administered pension funds, investment trusts, unit trusts and property unit trusts. Includes quarterly balance sheet data for short-term assets and liabilities, quarterly income and expenditure data for insurance companies and self-administered pension funds.","nextRelease":"","releaseDate":"2016-03-17T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Investment by insurance companies, pension funds and trusts in the UK (MQ5): Oct to Dec 2015","nationalStatistic":true,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/investmentbyinsurancecompaniespensionfundsandtrustsintheukmq5octtodec2015"},{"_type":"release","description":{"summary":"","nextRelease":"","releaseDate":"2016-03-17T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Analysis of the UK labour market - estimates of skills mismatch using measures of over and under education: 2015","nationalStatistic":false,"unit":"","contact":{"name":"General and statistical enquiries","telephone":"0845 601 3034","email":"info@ons.gsi.gov.uk"},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/analysisoftheuklabourmarketestimatesofskillsmismatchusingmeasuresofoverandundereducation2015"},{"_type":"release","description":{"summary":"","nextRelease":"","releaseDate":"2016-03-18T09:30:00.000Z","finalised":true,"source":"","published":false,"title":"Towns and Cities Analysis","nationalStatistic":false,"unit":"","contact":{"name":"","telephone":"","email":""},"provisionalDate":"","cancelled":false,"preUnit":"","cancellationNotice":[]},"searchBoost":[],"type":"release","uri":"/releases/townsandcitiesanalysis"}],"suggestions":[],"docCounts":{},"paginator":{"numberOfPages":49,"currentPage":1,"start":1,"end":5,"pages":[1,2,3,4,5]},"sortBy":"release_date_asc"}};

    var templateData = {
        columns: ["Calendar entry", "Calendar entry date"],
        title: "Select a calendar entry"
    };
    templateData['noOfColumns'] = templateData.columns.length;
    viewSelectModal(templateData, onSearch = function(searchValue) {
        populateReleasesList(releases, searchValue);
    });


    var releases = [];
    PopulateReleasesForUri("/releasecalendar/data?view=upcoming", releases);

    // var $searchInput = $('#release-search-input');
    // $searchInput.focus();
    // $searchInput.on('input', function () {
    //     var searchText = $(this).val();
    //     populateReleasesList(releases, searchText);
    // });

    function PopulateReleasesForUri(baseReleaseUri, releases) {
        //console.log("populating release for uri " + baseReleaseUri);
        // $.ajax({
        //         url: baseReleaseUri,
        //         type: "get",
        //         success: function (data) {
        //             populateRemainingReleasePages(data, releases, baseReleaseUri);
        //         },
        //         error: function (response) {
        //             handleApiError(response);
        //         }
        //     }
        // );
        populateRemainingReleasePages(stubbedData, releases, baseReleaseUri)
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
        var releaseList = $('#js-modal-select__body');
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
            var releaseUri = $(this).attr('data-uri'),
                $releaseTitle = $('.selected-release');
            Florence.CreateCollection.selectedRelease = {uri: releaseUri, title: releaseTitle};


            $releaseTitle.show().text(releaseTitle);
            $('#js-modal-select').stop().fadeOut(200).remove();
        })
    }
}