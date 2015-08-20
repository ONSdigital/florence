function loadT8Creator (collectionId, releaseDate, pageType, parentUrl) {
  var pageTitle, uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData;
  var nextRelease, natStat, contactName, contactEmail, contactTel, keyWords, metaDescr, relatedDatasets, relatedDocuments, relatedMethodology;
  var safeParent = checkPathSlashes(parentUrl);
  var parentUrlData = safeParent + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
        submitFormHandler ();
        return true;
      } else if (checkData.type === 'dataset' || checkData.type === 'reference_tables' && Florence.globalVars.welsh) {
        releaseDate = checkData.description.releaseDate;
        nextRelease = checkData.description.nextRelease;
        natStat = checkData.description.nationalStatistic;
        contactName = checkData.description.contact.name;
        contactEmail = checkData.description.contact.email;
        contactTel = checkData.description.contact.telephone;
        pageTitle = checkData.description.title;
        keyWords = checkData.description.keywords;
        metaDescr = checkData.description.metaDescription;
        relatedDatasets = checkData.relatedDatasets || [];
        relatedDocuments = checkData.relatedDocuments;
        relatedMethodology = checkData.relatedMethodology;
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
      newUri = makeUrl(safeParent, uriSection, pageTitleTrimmed);
      var safeNewUri = checkPathSlashes(newUri);

      if (!pageData.description.releaseDate) {
        alert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 5) {
        alert("This is not a valid file title");
        return true;
      }
       else {
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
          "title": ""
        },
        "downloads": [],
        "section": {},
        "correction": [],
        "relatedDatasets": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType
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
          "title": ""
        },
        "migrated": true,
        "downloads": [],
        "correction": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType
      };
    }

    else {
      alert('unsupported page type');
    }
  }
}

