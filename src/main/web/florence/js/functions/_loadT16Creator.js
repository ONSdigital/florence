/**
 * Creates releases' JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT16Creator(collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, uriSection, pageTitleTrimmed;
  var parentUrlData = "/data"; //home page
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      //Checks page is built in correct location
      if (checkData.type === 'home_page') {
        submitFormHandler();
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler() {
    $('.edition').append(
      '<label for="releaseDate">Release date</label>' +
      '<input id="releaseDate" type="text" placeholder="day month year" />' +
      '<div class="select-wrap select-wrap--half">' +
      '<select id="hour">' +
      '  <option value="0">00</option>' +
      '  <option value="3600000">01</option>' +
      '  <option value="7200000">02</option>' +
      '  <option value="10800000">03</option>' +
      '  <option value="14400000">04</option>' +
      '  <option value="18000000">05</option>' +
      '  <option value="21600000">06</option>' +
      '  <option value="25200000">07</option>' +
      '  <option value="28800000">08</option>' +
      '  <option value="32400000" selected="selected">09</option>' +
      '  <option value="36000000">10</option>' +
      '  <option value="39600000">11</option>' +
      '  <option value="43200000">12</option>' +
      '  <option value="46800000">13</option>' +
      '  <option value="50400000">14</option>' +
      '  <option value="54000000">15</option>' +
      '  <option value="57600000">16</option>' +
      '  <option value="61200000">17</option>' +
      '  <option value="64800000">18</option>' +
      '  <option value="68400000">19</option>' +
      '  <option value="72000000">20</option>' +
      '  <option value="75600000">21</option>' +
      '  <option value="79200000">22</option>' +
      '  <option value="82800000">23</option>' +
      '</select>' +
      '</div>' +
      '<div class="select-wrap select-wrap--half">' +
      '<select id="min">' +
      '  <option value="0">00</option>' +
      '  <option value="1800000" selected="selected">30</option>' +
      '</select>' +
      '</div>'
    );
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});

    //Submits inherited and added information to JSON
    $('form').submit(function (e) {
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }

      pageData = pageTypeDataT16(pageType);
      var publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
      var toIsoDate = $('#releaseDate').datepicker("getDate");
      pageData.description.releaseDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
      pageData.description.edition = $('#edition').val();
      pageTitle = $('#pagename').val();
      pageData.description.title = pageTitle;
      uriSection = "releases";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
      safeNewUri = checkPathSlashes(newUri);

      if (!pageData.description.releaseDate) {
        sweetAlert('Release date can not be empty');
        return true;
      }
      if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        return true;
      } else {
        Florence.globalVars.pagePath = safeNewUri;
        saveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }
}

function pageTypeDataT16(pageType) {
  return {
    "description": {
      "releaseDate": "",
      "provisionalDate": "",
      "finalised": false,
      "nextRelease": "", //does not make sense
      "contact": {
        "name": "",
        "email": "",
        "telephone": ""
      },
      "summary": "",
      "title": "",
      "nationalStatistic": false,
      "cancelled": false,
      "cancellationNotice": [],
      "published": false
    },
    "markdown": [],
    "relatedDatasets": [],
    "relatedDocuments": [],
    type: pageType,
    "dateChanges": []
  };
}

