function loadT6Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
  var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDate, releaseDateManual, isInheriting, newUri, pageData, breadcrumb;
  if (parentUrl.charAt(0) !== '/') {
    var parentUrlData = "/" + parentUrl + "/data";
  } else {
    var parentUrlData = parentUrl + "/data";
  }
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      if ((checkData.type === 'product_page' && pageType === 'compendium_landing_page') ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_chapter') ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_data')) {
        var inheritedBreadcrumb = checkData.breadcrumb;
        var parentBreadcrumb = {
          "uri": checkData.uri
        };
        inheritedBreadcrumb.push(parentBreadcrumb);
        breadcrumb = inheritedBreadcrumb;
        pageData = pageTypeDataT6(pageType, checkData);
        if (pageTitle) {
          submit (pageTitle);
        } else {
          submitFormHandler ();
        }
        return true;
      } if (checkData.type === 'compendium_landing_page' && pageType === 'compendium_landing_page') {
        contentUrlTmp = parentUrl.split('/');
        contentUrlTmp.splice(-1, 1);
        contentUrl = contentUrlTmp.join('/');
        parentUrl = contentUrl;
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
    if (pageType === 'compendium_landing_page') {
      $('.edition').append(
        '<label for="edition">Edition</label>' +
        '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
      );
    } if ((pageType === 'compendium_landing_page') && (!releaseDate)) {
      $('.edition').append(
        '<br>' +
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
      if (pageType === 'compendium_landing_page') {
        pageData.description.edition = $('#edition').val();
      }
      if (title) {
        //do nothing;
      } else {
        pageTitle = $('#pagename').val();
      }
      // TO CHECK
      pageData.description.title = pageTitle;
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
      if (releaseDateManual) {                                                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if (!releaseDate) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      } else {
        pageData.description.releaseDate = releaseDate;
      }
      if (isInheriting && pageType === 'compendium_landing_page') {
        newUri = makeUrl(parentUrl, releaseUri);
      }
      if (pageType === 'compendium_chapter') {
        newUri = makeUrl(parentUrl, pageTitleTrimmed);
      }
      if (pageType === 'compendium_data') {
        newUri = makeUrl(parentUrl, pageTitleTrimmed);
      }
      if ((pageType === 'compendium_landing_page')) {
        uriSection = "compendium";
        newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, releaseUri);
      } else {
        alert('Oops! Something went the wrong way.');
        loadCreateScreen(collectionId);
      }

      pageData.uri = '/' + newUri;
      pageData.breadcrumb = breadcrumb;

      if ((pageType === 'compendium-landing-page') && (!pageData.description.edition)) {
        alert('Edition can not be empty');
        return true;
      } if ((pageType === 'compendium-landing-page') && (!pageData.description.releaseDate)) {
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

function submit (title) {

    pageData.description.title = pageTitle;
    pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
      newUri = makeUrl(parentUrl, pageTitleTrimmed);
    }
    else {
      alert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }

    pageData.uri = '/' + newUri;

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

  function pageTypeDataT6(pageType, checkData) {

    if (pageType === "compendium_landing_page") {
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
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": false,
          "title": "",
          "edition": ""
        },
        "datasets": [],
        "chapters": [],
        "correction": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": "",
        "breadcrumb": []
      };
    }

    else if (pageType === 'compendium_chapter') {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "abstract": "",
          "authors": [],
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": "",
          "headline": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "externalLinks": [],
        "charts": [],
        "tables": [],
        "correction": [],
        type: pageType,
        "uri": newUri,
        "parent": {uri: checkData.uri},
        "breadcrumb": []
      };
    }

    else if (pageType === 'compendium_data') {
      return {
        "description": {
          "releaseDate": checkData.description.releaseDate || "",
          "nextRelease": checkData.description.nextRelease || "",
          "contact": {
            "name": checkData.description.contact.name || "",
            "email": checkData.description.contact.email || "",
            "telephone": checkData.description.contact.telephone || ""
          },
          "summary": "",
          "datasetId":"",
          "keywords": [],
          "metaDescription": "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": ""
        },
        "downloads": [],
        "correction": [],
        "relatedDocuments": [],
        "relatedMethodology": [],
        type: pageType,
        "uri": newUri,
        "parent": {uri: checkData.uri},
        "breadcrumb": []
      };
    }

    else {
      alert('unsupported page type');
    }
  }

}

