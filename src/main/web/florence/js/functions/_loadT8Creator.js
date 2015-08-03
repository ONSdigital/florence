function loadT8Creator (collectionId, releaseDate, pageType, parentUrl) {
  var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDate, releaseDateManual, newUri, pageData, breadcrumb;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page') {
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        submitFormHandler ();
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

  function submitFormHandler () {

    if (!releaseDate) {
      $('.edition').append(
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }

    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val()
      pageData = pageTypeDataT8(pageType);
      pageTitle = $('#pagename').val();
      pageData.description.title = pageTitle;
      uriSection = "datasets";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
      var safeNewUri = checkPathSlashes(newUri);
      pageData.uri = safeNewUri;
      pageData.breadcrumb = breadcrumb;

      if (!pageData.description.releaseDate) {
        alert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 4) {
        alert("This is not a valid file title");
        return true;
      }
       else {
        Florence.globalVars.pagePath = safeNewUri;              //Delete this after test
        checkSaveContent(collectionId, safeNewUri, pageData);
      }
      e.preventDefault();
    });
  }

  function pageTypeDataT8(pageType) {

    if (pageType === "dataset") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "datasetId":"",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "migrated": false,
          "title": "",
        },
        "downloads": [],
        "section": {},
        "correction": [],
        "relatedDatasets": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else if (pageType === "reference_tables") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "datasetId":"",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
        },
        "migrated": true,
        "downloads": [],
        "correction": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else {
      alert('unsupported page type');
    }
  }
}

