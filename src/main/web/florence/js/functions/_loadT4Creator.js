function loadT4Creator (collectionName) {
  console.log('loadT4');
  var parent, pageType, pageName, uriSection, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;

  getCollection(collectionName,
    success = function (response) {
      releaseDate = response.publishDate;
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  // Default
    pageType = "bulletin";

    $('select').change(function () {
      pageType = $(this).val();
      console.log(pageType);
    });

  $('form').append('<button class="btn-page-create">Create page</button>');
  $('.btn-page-create').hide();
  var parentUrl = localStorage.getItem("pageurl");
  var parentUrlData = "/data" + parentUrl;

  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.level === 't3') {
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
        $('#location').attr("placeholder", "This is not a valid place to create this page.");
      }
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
      date = new Date(releaseDate);
      pageData.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
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

function pageTypeData(pageType) {

  if (pageType === "bulletin") {
    return {
      "nextRelease": "",
      "contact": {
        "name": "",
        "email": ""
      },
      "lede": "",
      "more": "",
      "sections": [],
      "accordion": [],
      "headline1": "",
      "headline2": "",
      "headline3": "",
      "summary": "",
      "keywords": [],
      "nationalStatistic": "false",
      "relatedBulletins": [],
      "externalLinks": [],
      "charts": [],
      "correction": [],
      "name": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": "",
//      "isPageComplete": false
    };
  }

  else if (pageType === "article") {
    return {
      "contact": {
        "name": "",
        "email": ""
      },
      "lede": "",
      "more": "",
      "sections": [],
      "accordion": [],
      "abstract": "",
      "keywords": [],
      "nationalStatistic": "false",
      "relatedArticles": [],
      "externalLinks": [],
      "charts": [],
      "correction": [],
      "name": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": "",
//      "isPageComplete": false
    };
  }

  else if (pageType === "dataset") {
    return {
      "nextRelease": "",
      "contact": {
        "name": "",
        "email": ""
      },
      "lede": "",
      "more": "",
      "download": [],
      "notes": [],
      "summary": "",
      "keywords": [],
      "nationalStatistic": "false",
      "migrated": "false",
      "description": "",
      "charts": [],
      "correction": [],
      "name": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "relatedDatasets": [],
      "usedIn": [],
      "breadcrumb": "",
//      "isPageComplete": false
    };
  }

  else {
    alert('unsupported page type');
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
