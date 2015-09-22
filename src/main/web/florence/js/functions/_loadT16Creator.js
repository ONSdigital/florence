function loadT16Creator(collectionId, releaseDate, pageType, parentUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDateManual;
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
        alert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler() {
    //Adds manual 'release date' field
    $('.edition').append(
      '<label for="releaseDate">Release date</label>' +
      '<input id="releaseDate" type="text" placeholder="day month year" />'
    );
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});

    //Submits inherited and added information to JSON
    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val()
      pageData = pageTypeDataT16(pageType);
      pageData.description.edition = $('#edition').val();
      pageTitle = $('#pagename').val();
      pageData.description.title = pageTitle;
      uriSection = "releases";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      //if (!releaseDate) {
      pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      //} else {
      //  pageData.description.releaseDate = releaseDate;
      //}
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
      safeNewUri = checkPathSlashes(newUri);

      if (!pageData.description.releaseDate) {
        alert('Release date can not be empty');
        return true;
      }
      if (pageTitle.length < 5) {
        alert("This is not a valid file title");
        return true;
      } else {
        Florence.globalVars.pagePath = safeNewUri;
        checkSaveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }
}

function pageTypeDataT16(pageType) {
  return {
    "description": {
      "releaseDate": "",
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

