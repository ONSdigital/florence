function loadT7Creator (collectionId, releaseDate, pageType, parentUrl) {
  var parent, pageName, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;
  if (parentUrl === '/') {
    parentUrl = '';
  }
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if ((pageType === 'static_landing_page' && checkData.type === 'home_page') || (pageType.match(/static_.+/) && checkData.match(/static_.+/))) {
        $('#location').val(parentUrl);
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
    $('form').submit(function (e) {
      e.preventDefault();
      pageData = pageTypeDataT7(pageType);
      parent = $('#location').val().trim();
      pageName = $('#pagename').val().trim();
      pageData.name = pageName;
      pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      pageData.fileName = pageNameTrimmed;
      newUri = makeUrl(parent, pageNameTrimmed);
      pageData.uri = '/' + newUri;
      if (pageData.releaseDate) {
        date = new Date(releaseDate);
        pageData.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
      }
      pageData.breadcrumb = breadcrumb;

      if (pageName.length < 4) {
        alert("This is not a valid file name");
      } else {
        postContent(collectionId, newUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            viewWorkspace(newUri, collectionName, 'edit');
            refreshPreview(newUri);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this file. It is already part of another collection.");
            }
            else if (response.status === 401) {
              alert("You are not authorised to update content.");
            }
            else {
              handleApiError(response);
            }
          }
        );
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
        "name": "",
      },
      "markdown": [],
      type: pageType,
      "uri": "",
      "breadcrumb": "",
    };
  }

  else if (pageType === "static_article") {
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
    };
  }

  else if (pageType === "static_landing_page") {
    return {
      "description": {
        "summary": "",
        "keywords": [],
        "metaDescription": "",
        "name": "",
      },
      "sections": [],
      type: pageType,
      "uri": "",
      "breadcrumb": "",
    };
  }

  else if (pageType === "static_qmi") {
      return {
        "contact": {
          "name": "",
          "email": "",
          "phone": ""
        },
        "surveyName": "",
        "frequency": "",
        "compilation": "",
        "geoCoverage": "",
        "sampleSize": "",
        "lastRevised": "",
        "markdown": [],
        "keywords": [],
        "metaDescription": "",
        "name": "",
        "download": [],
        type: pageType,
        "uri": "",
        "fileName": "",
        "breadcrumb": "",
      };
    }

  else if (pageType === "static_foi") {
    return {
      "download": [],
      "markdown": [],
      "keywords": [],
      "metaDescription": "",
      "name": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": "",
    };
  }

  else if (pageType === "static_adhoc") {
    return {
      "download": [],
      "markdown": [],
      "keywords": [],
      "metaDescription": "",
      "name": "",
      "releaseDate": "",
      "reference": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": "",
    };
  }

  else {
    alert('unsupported page type');
  }
}


