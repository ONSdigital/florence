function loadT4Creator (collectionName) {
  console.log('loadT4');
  var parent, pageType, pageName, uriSection, pageNameTrimmed, releaseDate, releaseDateManual, isBullArt, newUri, pageData, breadcrumb;

  getCollection(collectionName,
    success = function (response) {
      if (response.publishDate === '[manual collection]') {
        releaseDate = null;
      } else {
        releaseDate = response.publishDate;
      }
    },
    error = function (response) {
      handleApiError(response);
    }
  );

  $('select').change(function () {
    pageType = $(this).val();
    var parentUrl = localStorage.getItem("pageurl");
    var parentUrlData = "/data" + parentUrl;                //TBC when not angular

    if (pageType === 'staticpage' || pageType === 'qmi' || pageType === 'foi' || pageType === 'adhoc') {
        loadT7Creator(collectionName, releaseDate, pageType);
    }
    else if (pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset' || pageType === 'methodology') {
      $.ajax({
        url: parentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (checkData) {
          if (checkData.level === 't3') {
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
            return true;
          } if ((checkData.type === 'bulletin' && pageType === 'bulletin') || (checkData.type === 'article' && pageType === 'article')) {
            contentUrlTmp = parentUrl.split('/');
            contentUrlTmp.splice(-1, 1);
            contentUrl = contentUrlTmp.join('/');
            $('#location').val(contentUrl);
            breadcrumb = checkData.breadcrumb;
            pageName = checkData.name;
            isBullArt = true;
            submitFormHandler (pageName, contentUrl, isBullArt);
            return true;
          } else {
            $('.btn-page-create').hide();
            $('#location').attr("placeholder", "This is not a valid place to create this page.");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    }

    function submitFormHandler (name, uri, isBullArt) {
      if (isBullArt == undefined) {
        $('select').off().change(function () {
          createWorkspace(parentUrl, Florence.collection.id, 'create');
        });
        }
      if (pageType === 'bulletin' || pageType === 'article') {
        $('.release').append(
          '<label for="release">Release</label>' +
          '<input id="release" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
        );
      } if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!releaseDate)) {
        $('.release').append(
          '<div>' +
          '  <label for="releaseDate">Release date</label>' +
          '  <input id="releaseDate" type="text" placeholder="dd/mm/yyyy" />' +
          '</div>'
        );   //style="display: none;
        $('#releaseDate').datepicker({dateFormat: 'dd/mm/yy'});
      }
      if (name) {
        pageName = name;
        $('#pagename').val(name);
      }

      $('form').submit(function (e) {
        releaseDateManual = $('#releaseDate').val()
        pageData = pageTypeDataT4(pageType);
        parent = $('#location').val().trim();
        if (pageType === 'bulletin' || pageType === 'article') {
          pageData.release = $('#release').val();
        }
        if (name) {
          //do nothing;
        } else {
          pageName = $('#pagename').val();
        }
        pageData.name = pageName;
        uriSection = pageType + "s";
        pageNameTrimmed = pageName.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        pageData.fileName = pageNameTrimmed;
        if (releaseDateManual) {                                                          //Manual collections
          date = $.datepicker.parseDate("dd/mm/yy", releaseDateManual);
          releaseUri = $.datepicker.formatDate('yymmdd', date);
        } else {
          releaseUri = $.datepicker.formatDate('yymmdd', new Date(releaseDate));
          releaseDateTemp = $.datepicker.formatDate('dd/mm/yy', new Date(releaseDate));
          releaseDate = releaseDateTemp;
        }

        if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!releaseDate)) {
          pageData.releaseDate = $('#releaseDate').val();
        } else if ((pageType !== 'bulletin' || pageType !== 'article' || pageType !== 'dataset') && (!releaseDate)) {
          pageData.releaseDate = null;
        } else {
          pageData.releaseDate = releaseDate;
        }
        if (isBullArt) {
          newUri = makeUrl(parent, releaseUri);
        } else {
          if ((pageType === 'bulletin' || pageType === 'article')) {
            newUri = makeUrl(parent, uriSection, pageNameTrimmed, releaseUri);
          } else {
            newUri = makeUrl(parent, uriSection, pageNameTrimmed);
          }
        }
        pageData.uri = newUri;
        pageData.breadcrumb = breadcrumb;

        if ((pageType === 'bulletin' || pageType === 'article') && (!pageData.release)) {
          alert('Release can not be empty');
          return true;
        } if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!pageData.releaseDate)) {
          alert('Release date can not be empty');
          return true;
        } if (pageName.length < 4) {
          alert("This is not a valid file name");
          return true;
        }
         else {
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
        e.preventDefault();
      });
    }

    function pageTypeDataT4(pageType) {

      if (pageType === "bulletin") {
        return {
          "release": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "phone": ""
          },
          "sections": [],
          "accordion": [],
          "headline1": "",
          "headline2": "",
          "headline3": "",
          "summary": "",
          "keywords": "",
          "metaDescription": "",
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
        };
      }

      else if (pageType === "article") {
        return {
          "release": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "phone": ""
          },
          "sections": [],
          "accordion": [],
          "abstract": "",
          "authors": [],
          "keywords": "",
          "metaDescription": "",
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
        };
      }

      else if (pageType === "methodology") {
        return {
          "contact": {
            "name": "",
            "email": "",
            "phone": ""
          },
          "sections": [],
          "accordion": [],
          "summary": "",
          "keywords": "",
          "metaDescription": "",
          "name": "",
          "releaseDate": "",
          type: pageType,
          "uri": "",
          "fileName": "",
          "breadcrumb": "",
        };
      }

      else if (pageType === "dataset") {
        return {
          "release": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "phone": ""
          },
          "download": [],
          "notes": [],
          "summary": "",
          "datasetID":"",
          "keywords": "",
          "metaDescription": "",
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
        };
      }

      else {
        alert('unsupported page type');
      }
    }
  });
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
