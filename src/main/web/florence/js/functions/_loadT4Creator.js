function loadT4Creator (collectionName) {
  var parent, pageType, pageName, uriSection, pageNameTrimmed, releaseDate, createButton, newUri, pageData, breadcrumb;

  getCollection(collectionName,
    success = function (response) {
      releaseDate = response.publishDate;
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  createButton = $('.fl-panel--creator__nav').append('<button class="fl-panel--creator__nav__create">Create Page</button>').hide();
  var parentUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
  var parentUrlData = "/data" + parentUrl.split("#!")[1];

  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.level === 't3') {
        $('.fl-creator__parent').val(parentUrl.split("#!")[1]);
        createButton.show();
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
        $('.fl-creator__parent').attr("placeholder", "This is not a valid place to create this page.");
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  // Default
  pageType = "bulletin";

  $('.fl-creator__page_type_list_select').change(function () {
    pageType = $(this).val();
  });
  createButton.one('click', function () {
    pageData = pageTypeData(pageType);
    parent = $('.fl-creator__parent').val().trim();
    pageName = $('.fl-creator__new_name').val().trim();
    pageData.name = pageName;
    uriSection = pageType + "s";
    pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
    pageData.fileName = pageNameTrimmed;
    newUri = makeUrl(parent, uriSection, pageNameTrimmed);
    pageData.uri = newUri;
    date = new Date(releaseDate);
    pageData.releaseDate = $.datepicker.formatDate('dd/mm/yy', date);
    pageData.breadcrumb = breadcrumb;


    $.ajax({
      url: "/zebedee/content/" + collectionName + "?uri=" + newUri + "/data.json",
      dataType: 'json',
      crossDomain: true,
      type: 'POST',
      data: JSON.stringify(pageData),
      headers: {
        "X-Florence-Token": accessToken()
      },
      success: function (message) {
        console.log("Updating completed " + message);
        // To be changed when #! gets removed
        var local = localStorage.getItem("pageurl").split("#!")[0];
        $('.fl-panel--preview__content').get(0).src = local + "#!/" + newUri;
        loadEditT4Screen(collectionName);
      },
      error: function (error) {
        console.log(error);
      }
    });
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
      "relatedBulletins": [],
      "title": "",
      "releaseDate": "",
      type: pageType,
      "name": "",
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
      "relatedArticles": [],
      "title": "",
      "releaseDate": "",
      type: pageType,
      "name": "",
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
      "nationalStatistic": "",
      "description": "",
      "title": "",
      "releaseDate": "",
      type: pageType,
      "name": "",
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
