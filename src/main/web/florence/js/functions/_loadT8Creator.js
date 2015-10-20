/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

function loadT8Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
  var releaseDate = null;             //overwrite scheduled collection date
  var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData, parentData;
  var timeseries = false;
  var nextRelease, natStat, contactName, contactEmail, contactTel, keyWords, metaDescr, relatedDatasets, relatedDocuments, relatedMethodology;
  var parentUrlData = parentUrl + "/data";
  if (pageType === 'timeseries_landing_page') {
    timeseries = true;
    var pageType = 'dataset_landing_page';
  }

  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      parentData = $.extend(true, {}, checkData);
      if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
        submitFormHandler();
        return true;
      } else if ((checkData.type === 'dataset_landing_page' && pageType === 'dataset') ||
                 (checkData.type === 'dataset_landing_page' && pageType === 'timeseries_dataset')) {
        parentUrl = checkData.uri;
        pageData = pageTypeDataT8(pageType, checkData);
        submitNoForm(parentUrl, pageTitle);
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
      pageData.timeseries = timeseries;
      uriSection = "datasets";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
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

  function submitNoForm (parentUrl, title) {

    pageData.description.title = title;
    pageTitleTrimmed = title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'dataset') || (pageType === 'timeseries_dataset')) {
      newUri = makeUrl(parentUrl, pageTitleTrimmed);
    } else {
      alert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }

    var safeNewUri = checkPathSlashes(newUri);

    // check if the page exists
    getPageData(collectionId, safeNewUri,
      success = function() {
        alert('This page already exists');
      },
      // if the page does not exist, create it
      error = function() {
        postContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            updateParentLink (safeNewUri);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this page. It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
      }
    );
  }

  function pageTypeDataT8(pageType, checkData) {

    if (pageType === "dataset_landing_page") {
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
        //"timeseries": true or false will be on created
        "datasets": [],
        "section": {},      //notes
        "corrections": [],
        "relatedDatasets": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        "topics": [],
        type: pageType
      };
    }

    if (pageType === "dataset") {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "summary": checkData.description.contact.summary || "",
          "datasetId": checkData.description.contact.datasetId || "",
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic || false,
          "title": checkData.description.title || ""       //edition
        },
        "section": checkData.section || {},      //notes
        "versions": [], //{date, uri, correctionNotice}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else if (pageType === "timeseries_dataset") {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "summary": checkData.description.contact.summary || "",
          "datasetId": checkData.description.contact.datasetId || "",
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic || false,
          "title": checkData.description.title || ""       //edition
        },
        "section": checkData.section || {},      //notes
        "versions": [], //{date, uri, correctionNotice}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else {
      alert('Unsupported page type. This is not a dataset type');
    }
  }

  function updateParentLink (childUri) {

    parentData.datasets.push({uri: childUri});

    postContent(collectionId, parentUrl, JSON.stringify(parentData),
      success = function (message) {
        viewWorkspace(childUri, collectionId, 'edit');
        refreshPreview(childUri);
        console.log("Parent link updating completed " + message);
      },
      error = function (response) {
        if (response.status === 400) {
          alert("Cannot edit this page. It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}

