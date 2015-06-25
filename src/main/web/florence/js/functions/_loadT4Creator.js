function loadT4Creator (collectionId, releaseDate, pageType, parentUrl) {
  var parent, pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDate, releaseDateManual, isInheriting, newUri, pageData, breadcrumb;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if (checkData.type === 'product_page') {
        $('#location').val(parentUrl);
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
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
        pageTitle = checkData.description.title;
        isInheriting = true;
        submitFormHandler (pageTitle, contentUrl, isInheriting);
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

  function submitFormHandler (title, uri, isInheriting) {
    if (pageType === 'bulletin' || pageType === 'article') {
      $('.edition').append(
        '<label for="edition">Edition</label>' +
        '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
      );
    } if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!releaseDate)) {
      $('.edition').append(
        '<label for="releaseDate">Release date</label>' +
        '<input id="releaseDate" type="text" placeholder="day month year" />'
      );
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    }
    if (title) {
      pageTitle = title;
      $('#pagename').val(title);
    }

    $('form').submit(function (e) {
      releaseDateManual = $('#releaseDate').val()
      pageData = pageTypeDataT4(pageType);
      parent = $('#location').val().trim();
      if (pageType === 'bulletin' || pageType === 'article') {
        pageData.description.edition = $('#edition').val();
      }
      if (title) {
        //do nothing;
      } else {
        pageTitle = $('#pagename').val();
      }
      pageData.description.title = pageTitle;
      uriSection = pageType + "s";
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      if (releaseDateManual) {                                                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!releaseDate)) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else if (pageType === 'methodology') {           // does not have release date
        pageData.description.releaseDate = null;
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      if (isInheriting) {
        newUri = makeUrl(parent, releaseUri);
      } else {
        if ((pageType === 'bulletin' || pageType === 'article')) {
          newUri = makeUrl(parent, uriSection, pageTitleTrimmed, releaseUri);
        } else {
          newUri = makeUrl(parent, uriSection, pageTitleTrimmed);
        }
      }
      pageData.uri = newUri;
      pageData.breadcrumb = breadcrumb;

      if ((pageType === 'bulletin' || pageType === 'article') && (!pageData.description.edition)) {
        alert('Edition can not be empty');
        return true;
      } if ((pageType === 'bulletin' || pageType === 'article' || pageType === 'dataset') && (!pageData.description.releaseDate)) {
        alert('Release date can not be empty');
        return true;
      } if (pageTitle.length < 4) {
        alert("This is not a valid file title");
        return true;
      }
       else {
        postContent(collectionId, newUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            viewWorkspace(newUri, collectionId, 'edit');
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
        "description": {
          "headline1": "",
          "headline2": "",
          "headline3": "",
          "nationalStatistic": false,
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "title": "",
          "summary": "",
          "keywords": [],
          "edition": "",
          "releaseDate": "",
          "nextRelease": "",
          "metaDescription": "",
        },
        "sections": [],
        "accordion": [],
        "relatedBulletins": [],
        "relatedData": [],
        "externalLinks": [],
        "charts": [],
        "correction": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else if (pageType === "article") {
      return {
        "description": {
          "edition": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "abstract": "",
          "authors": [],
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
          "releaseDate": "",
        },
        "sections": [],
        "accordion": [],
        "relatedArticles": [],
        "relatedData": [],
        "externalLinks": [],
        "charts": [],
        "correction": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else if (pageType === "methodology") {
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
//          "releaseDate": "",
        },
        "sections": [],
        "accordion": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else if (pageType === "dataset") {
      return {
        "description": {
          "releaseDate": "",
          "nextRelease": "",
          "contact": {
            "name": "",
            "email": "",
            "telephone": ""
          },
          "summary": "",
          "datasetID":"",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "migrated": false,
          "title": "",
        },
        "downloads": [],
        "section": {},
        "correction": [],
        "relatedDatasets": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": "",
        "breadcrumb": [],
      };
    }

    else {
      alert('unsupported page type');
    }
  }
}

