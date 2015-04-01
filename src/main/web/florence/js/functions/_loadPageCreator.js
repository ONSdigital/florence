function loadPageCreator (collectionName) {
  var parent, pageType, pageName, uriSection, pageNameTrimmed, releaseDate, createButton, newUri, pageData;

  getCollection(collectionName,
    success = function (response) {
      console.log(response);
      releaseDate = new Date(response.publishDate);
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  pageType = $('.fl-creator__page_type_list_select').val().trim();
  createButton = $('.fl-panel--creator__nav__create');
  createButton.one('click', function () {
    pageData = pageTypeData(pageType);
    parent = $('.fl-creator__parent').val().trim();
    pageName = $('.fl-creator__new_name').val().trim();
    pageData.name = pageName;
    console.log(parent);
    uriSection = pageType + "s";
    pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
    pageData.fileName = pageNameTrimmed;
    newUri = makeUrl(parent, uriSection, pageNameTrimmed);
    pageData.uri = newUri;
    console.log(newUri);
    pageData.releaseDate = $.datepicker.formatDate('dd MM yy', releaseDate);

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
        //$('.fl-panel--preview__content').get(0).src = "#!/" + newUri;
        //loadEditScreen();
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
      nextRelease: "",
      contact: {
        name: "",
        email: ""
      },
      lede: "",
      more: "",
      sections: [],
      accordion: [],
      headline1: "",
      headline2: "",
      headline3: "",
      summary: "",
      relatedBulletins: [],
      externalLinks: [],
      title: "",
      releaseDate: "",
      type: pageType,
      //"type": "bulletin",
      name: "",
      uri: "",
      fileName: "",
      breadcrumb: [
        {
          index: 0,
          type: "home",
          name: "Economy",
          fileName: "economy"
        },
        {
          index: 0,
          type: "home",
          name: "Gross Domestic Product (GDP)",
          fileName: "grossdomesticproductgdp",
          breadcrumb: []
        }
      ]
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
  console.log(accumulator);
  return accumulator.join('/');
}
