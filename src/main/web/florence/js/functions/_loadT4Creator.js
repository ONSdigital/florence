function loadT4Creator (collectionName) {

  var parent, pageType, pageName, uriSection, pageNameTrimmed, releaseDate, newUri, pageData, breadcrumb;

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
        return breadcrumb;
      } else {
        $('#location').attr("placeholder", "This is not a valid place to create this page.");
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  // Default
  pageType = "bulletin";

  $('#pagetype').change(function () {
    pageType = $(this).val();
  });
  $('.btn-page-create').click(function () {
    pageData = pageTypeData(pageType);
    parent = $('#location').val().trim();
    pageName = $('#pagename').val().trim();
    pageData.title = pageName;
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
      $.ajax({
        url: "/zebedee/content/" + collectionName + "?uri=" + newUri + "/data.json",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify(pageData),
        success: function (message) {
          console.log("Updating completed " + message);
          var path = newUri;

          viewWorkspace(path, collectionName, 'edit');
        },
        error: function (error) {
          console.log(error);
        }
      });
    }
  });
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
      "nationalStatistic": "false",
      "relatedBulletins": [],
      "externalLinks": [],
      "correction": [],
      "title": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": ""
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
      "headline1": "",
      "headline2": "",
      "headline3": "",
      "summary": "",
      "nationalStatistic": "false",
      "relatedArticles": [],
      "externalLinks": [],
      "correction": [],
      "title": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "breadcrumb": ""
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
      "nationalStatistic": "false",
      "description": "",
      "correction": [],
      "title": "",
      "releaseDate": "",
      type: pageType,
      "uri": "",
      "fileName": "",
      "relatedDatasets": [],
      "usedIn": [],
      "breadcrumb": ""
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
