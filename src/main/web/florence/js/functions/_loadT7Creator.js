function loadT7Creator (collectionName, pageType) {

  var parent, pageName, uriSection, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;

  getCollection(collectionName,
    success = function (response) {
      releaseDate = response.publishDate;
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  $('form').append('<button class="btn-page-create">Create page</button>');
  $('.btn-page-create').hide();
  var parentUrl = localStorage.getItem("pageurl");
  var parentUrlData = "/data" + parentUrl;

  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
//      if (pageType === 'something' && checkData.level === 'methodology' ||
//            pageType === 'somethingElse' && checkData.level === 'about')    { //not working -> no data
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
//      } else {
//        $('#location').attr("placeholder", "This is not a valid place to create this page.");
//      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });


  function submitFormHandler () {
    $('form').submit(function (e) {
    console.log(breadcrumb);
      e.preventDefault();
      pageData = pageTypeData(pageType);
      parent = $('#location').val().trim();
      pageName = $('#pagename').val().trim();
      pageData.name = pageName;
      uriSection = pageType + "s";
      pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      pageData.fileName = pageNameTrimmed;
      newUri = makeUrl(parent, uriSection, pageNameTrimmed);
      pageData.uri = newUri;
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

    function pageTypeData(pageType) {

      if (pageType === "static") {
        return {
          "summary": "",
          "keywords": [],
          "metaDescription": "",
          "name": "",
          "releaseDate": "",
          "content": "",
          type: pageType,
          "uri": "",
          "fileName": "",
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
          "geoCoverage": [],
          "sampleSize": "",
          "lastRevised": "",
          "content": "",
          "summary": "",
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
          "content": "",
          "summary": "",
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

      else if (pageType === "adHoc") {
        return {
          "download": [],
          "content": "",
          "summary": "",
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

  }
}

function makeUrl(args) {
  var accumulator;
  accumulator = [];
  for(var i=0; i < arguments.length; i++) {
    accumulator =  accumulator.concat(arguments[i]
                              .split('/')
                              .filter(function(argument){return argument !== "";}));
  }
  return accumulator.join('/');
}
