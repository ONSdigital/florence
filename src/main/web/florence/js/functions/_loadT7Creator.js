function loadT7Creator(collectionId, releaseDate, pageType, parentUrl) {
  var pageName, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;
  if (parentUrl === '/') {
    parentUrl = '';
  }
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function(checkData) {
      if (pageType === 'static_landing_page' && checkData.type === 'home_page' ||
        (pageType === 'static_qmi' || pageType === 'static_adhoc' || pageType === 'static_methodology') && checkData.type === 'product_page') {
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        submitFormHandler();
        return true;
      } else if ((pageType === 'static_foi' || pageType === 'static_page' || pageType === 'static_landing_page' || pageType === 'static_article') && checkData.type.match(/static_.+/)) {
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        submitFormHandler();
        return true;
      } else {
        alert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function() {
      console.log('No page data returned');
    }
  });

  function submitFormHandler() {
    $('form').submit(function(e) {
      e.preventDefault();
      pageData = pageTypeDataT7(pageType);
      pageName = $('#pagename').val().trim();
      pageData.description.title = pageName;
      pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      pageData.fileName = pageNameTrimmed;
      if (pageType === 'static_qmi') {
        newUri = makeUrl(parentUrl, 'qmis', pageNameTrimmed);
      } else if (pageType === 'static_adhoc') {
        newUri = makeUrl(parentUrl, 'adhocs', pageNameTrimmed);
      } else if (pageType === 'static_methodology') {
        newUri = makeUrl(parentUrl, 'methodologies', pageNameTrimmed);
      } else {
        newUri = makeUrl(parentUrl, pageNameTrimmed);
      }
      var safeNewUri = checkPathSlashes(newUri);
      pageData.uri = safeNewUri;
      if (pageData.releaseDate) {
        date = new Date(releaseDate);
        pageData.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
      }
      pageData.breadcrumb = breadcrumb;

      if (pageName.length < 4) {
        alert("This is not a valid file name");
      } else {
        Florence.globalVars.pagePath = safeNewUri;              //Delete this after test
        checkSaveContent(collectionId, safeNewUri, pageData);
      }
    });
  }
}

function pageTypeDataT7(pageType) {

  if (pageType === "static_page") {
    return {
      "description": {
        "summary": "",
        "keywords": [],
        "metaDescription": "",
        "title": "",
      },
      "markdown": [],
      type: pageType,
      "uri": "",
      "breadcrumb": [],
      "links" : []
    };
  } else if ((pageType === "static_article") || (pageType === "static_methodology")) {
    return {
      "description": {
        "contact": {
          "name": "",
          "email": "",
          "telephone": ""
        },
        "summary": "",
        "keywords": [],
        "metaDescription": "",
        "title": "",
        //        "releaseDate": "",
      },
      "sections": [],
      "accordion": [],
      type: pageType,
      "uri": "",
      "breadcrumb": [],
      "downloads":[],
      "links" : []
    };
  } else if (pageType === "static_landing_page") {
    return {
      "description": {
        "summary": "",
        "keywords": [],
        "metaDescription": "",
        "title": "",
      },
      "sections": [],
      type: pageType,
      "uri": "",
      "breadcrumb": [],
      "links" : []

    };
  } else if (pageType === "static_qmi") {
    return {
      "description": {
        "contact": {
          "name": "",
          "email": "",
          "phone": ""
        },
        "surveyName": "",
        "frequency": "",
        "compilation": "",
        "geographicCoverage": "",
        "sampleSize": null,
        "lastRevised": null,
        "keywords": [],
        "metaDescription": "",
        "title": ""
      },
      "markdown": [],
      "downloads": [],
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": [],
      "links" : []
    };
  } else if (pageType === "static_foi") {
    return {
      "description": {
        "keywords": [],
        "metaDescription": "",
        "title": "",
        "releaseDate": null
      },
      "downloads": [],
      "markdown": [],
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": [],
      "links" : []
    };
  } else if (pageType === "static_adhoc") {
    return {
      "description": {
        "keywords": [],
        "metaDescription": "",
        "title": "",
        "releaseDate": null,
        "reference": null,
      },
      "downloads": [],
      "markdown": [],
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": [],
      "links" : []
    };
  } else {
    alert('unsupported page type');
  }
}