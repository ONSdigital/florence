/**
 * Creates data JSON
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 */

//function loadT8Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
//  var releaseDate = null;             //overwrite scheduled collection date
//  var uriSection, pageTitleTrimmed, releaseDateManual, newUri, pageData;
//  var parentUrlData = parentUrl + "/data";
//  // will add this var in dataset_landing_page
//  var timeseries = false;
//  if (pageType === 'timeseries_landing_page') {
//    timeseries = true;
//    pageType = 'dataset_landing_page';
//  }
//
//  $.ajax({
//    url: parentUrlData,
//    dataType: 'json',
//    crossDomain: true,
//    success: function (checkData) {
//      if (checkData.type === 'product_page' && !Florence.globalVars.welsh) {
//        submitFormHandler();
//        return true;
//      } else {
//        alert("This is not a valid place to create this page.");
//        loadCreateScreen(collectionId);
//      }
//    },
//    error: function () {
//      console.log('No page data returned');
//    }
//  });
//
//  function submitFormHandler () {
//
//    if (!releaseDate) {
//      $('.edition').append(
//        '<label for="releaseDate">Release date</label>' +
//        '<input id="releaseDate" type="text" placeholder="day month year" />'
//      );
//      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//    }
//
//    $('form').submit(function (e) {
//      releaseDateManual = $('#releaseDate').val()
//      pageData = pageTypeDataT8(pageType);
//      pageTitle = $('#pagename').val();
//      pageData.description.title = pageTitle;
//      pageData.timeseries = timeseries;
//      uriSection = "datasets";
//      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
//
//      if (!releaseDate) {
//        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
//      } else {
//        pageData.description.releaseDate = releaseDate;
//      }
//      newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
//      var safeNewUri = checkPathSlashes(newUri);
//
//      if (!pageData.description.releaseDate) {
//        alert('Release date can not be empty');
//        return true;
//      } if (pageTitle.length < 5) {
//        alert("This is not a valid file title");
//        return true;
//      }
//       else {
//        saveContent(collectionId, safeNewUri, pageData);
//      }
//      e.preventDefault();
//    });
//  }
//
//  function pageTypeDataT8(pageType) {
//
//    if (pageType === "dataset_landing_page") {
//      return {
//        "description": {
//          "releaseDate": "",
//          "nextRelease": "",
//          "contact": {
//            "name": "",
//            "email": "",
//            "telephone": ""
//          },
//          "summary": "",
//          "datasetId": "",
//          "keywords": [],
//          "metaDescription": "",
//          "nationalStatistic": false,
//          "title": ""
//        },
//        "timeseries": false,
//        "datasets": [],
//        "section": {},      //notes
//        "corrections": [],
//        "relatedDatasets": [],
//        "relatedDocuments": [],
//        "relatedMethodology": [],
//        "topics": [],
//        type: pageType
//      };
//    }
//    else {
//      alert('Unsupported page type. This is not a dataset type');
//    }
//  }
//}

