function loadT7Creator (collectionId, releaseDate, pageType, parentUrl) {
  var parent, pageName, uriSection, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (pageType === 'methodology_landing_page' && checkData.type === 'methodology_landing_page' ||
            pageType === 'about_us_landing_page' && checkData.type === 'about_us_landing_page') {
        $('.btn-page-create').show();
        $('#location').val(parentUrl);
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "index": 0,
          "type": "home",
          "name": checkData.name,
          "fileName": checkData.fileName,
          "breadcrumb": []
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        submitFormHandler ();
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
      uriSection = pageType;
      pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      pageData.fileName = pageNameTrimmed;
      newUri = makeUrl(parent, uriSection, pageNameTrimmed);
      pageData.uri = '/' + newUri;
      if (pageData.releaseDate) {
        date = new Date(releaseDate);
        pageData.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
      }
      pageData.breadcrumb = breadcrumb;

      if (pageName.length < 4) {
        alert("This is not a valid file name");
      } else {
        postContent(collectionName, newUri, JSON.stringify(pageData),
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

  if (pageType === "about_us") {
    return {
      "description": {
        "summary": "",
        "keywords": [],
        "metaDescription": "",
        "name": "",
      },
      "content": [],
      type: pageType,
      "uri": "",
      "breadcrumb": "",
    };
  }

  else if (pageType === "qmi") {
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
        "content": [],
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

  else if (pageType === "foi") {
    return {
      "download": [],
      "content": [],
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

  else if (pageType === "adhoc") {
    return {
      "download": [],
      "content": [],
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


