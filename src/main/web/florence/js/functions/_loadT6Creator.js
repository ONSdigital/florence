/**
 * Creates compendium documents
 * @param collectionId
 * @param releaseDate
 * @param pageType
 * @param parentUrl
 * @param pageTitle
 */

function loadT6Creator (collectionId, releaseDate, pageType, parentUrl, pageTitle) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageType, pageTitle, pageEdition, uriSection, pageTitleTrimmed, pageEditionTrimmed, releaseDateManual, isInheriting, newUri, pageData, parentData;
  var parentUrlData = parentUrl + "/data";
  $.ajax({
    url: parentUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (checkData) {
      parentData = $.extend(true, {}, checkData);
      if ((checkData.type === 'product_page' && pageType === 'compendium_landing_page' && !Florence.globalVars.welsh) ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_chapter') ||
          (checkData.type === 'compendium_landing_page' && pageType === 'compendium_data')) {
        parentUrl = checkData.uri;
        pageData = pageTypeDataT6(pageType, checkData);
        if (pageTitle) {
          submitNoForm (parentUrl, pageTitle);
        } else {
          submitFormHandler(parentUrl);
        }
        return true;
      } if (checkData.type === 'compendium_landing_page' && pageType === 'compendium_landing_page') {
        parentUrl = getParentPage(checkData.uri);
        pageTitle = checkData.description.title;
        isInheriting = true;
        pageData = pageTypeDataT6(pageType, checkData);
        submitFormHandler(parentUrl, pageTitle, isInheriting);
        return true;
      } else {
        sweetAlert("This is not a valid place to create this page.");
        loadCreateScreen(collectionId);
      }
    },
    error: function () {
      console.log('No page data returned');
    }
  });

  function submitFormHandler (parentUrl, title, isInheriting) {
    $('.edition').empty();
    if (pageType === 'compendium_landing_page') {
      $('.edition').append(
        '<label for="edition">Edition</label>' +
        '<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />' +
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
      releaseDateManual = $('#releaseDate').val();
      //Check for reserved words
      if ($('#pagename').val().toLowerCase() === 'current' || $('#pagename').val().toLowerCase() === 'latest' || $('#pagename').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for a title');
        $('#pagename').val('');
        return false;
      }
      if ($('#edition').val().toLowerCase() === 'current' || $('#edition').val().toLowerCase() === 'latest' || $('#edition').val().toLowerCase() === 'data') {
        alert ('That is not an accepted value for an edition');
        $('#edition').val('');
        return false;
      }
      if (pageType === 'compendium_landing_page') {
        pageData.description.edition = $('#edition').val();
      }
      if (!title) {
        pageTitle = $('#pagename').val();
      }

      pageData.description.title = pageTitle;
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      pageEdition = pageData.description.edition;
      pageEditionTrimmed = pageEdition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (pageType === 'compendium_landing_page' && releaseDate == null) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      }
      else if (pageType === 'compendium_landing_page' && releaseDate) {
        pageData.description.releaseDate = releaseDate;
      }

      if (isInheriting && pageType === 'compendium_landing_page') {
        newUri = makeUrl(parentUrl, pageEditionTrimmed);
      }
      else if (pageType === 'compendium_landing_page') {
        uriSection = "compendium";
        newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, pageEditionTrimmed);
      }
      else if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
        newUri = makeUrl(parentUrl, pageTitleTrimmed);
      }
      else {
        sweetAlert('Oops! Something went the wrong.', "", "error");
        loadCreateScreen(collectionId);
      }
      var safeNewUri = checkPathSlashes(newUri);

      if ((pageType === 'compendium_landing_page') && (!pageData.description.edition)) {
        sweetAlert('Edition can not be empty');
        e.preventDefault();
        return true;
      } if ((pageType === 'compendium_landing_page') && (!pageData.description.releaseDate)) {
        sweetAlert('Release date can not be empty');
        e.preventDefault();
        return true;
      } if (pageTitle.length < 5) {
        sweetAlert("This is not a valid file title");
        e.preventDefault();
        return true;
      } if (pageTitle.toLowerCase() === 'current' || pageTitle.toLowerCase() === 'latest') {
        alert("This is not a valid file title");
        e.preventDefault();
        return true;
      }
      else {
        putContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            if (pageData.type === 'compendium_landing_page') {
              viewWorkspace(safeNewUri, collectionId, 'edit');
              refreshPreview(safeNewUri);
              return true;
            }
            else if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
              updateParentLink (safeNewUri);
              return true;
            }
          },
          error = function (response) {
            if (response.status === 409) {
              sweetAlert("Cannot create this page", "It already exists.");
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

function submitNoForm (parentUrl, title) {

    pageData.description.title = title;
    pageTitleTrimmed = title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
      newUri = makeUrl(parentUrl, pageTitleTrimmed);
    } else {
      sweetAlert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }

  var safeNewUri = checkPathSlashes(newUri);

    // check if the page exists
    getPageData(collectionId, safeNewUri,
      success = function() {
        sweetAlert('This page already exists');
      },
      // if the page does not exist, create it
      error = function() {
        putContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            updateParentLink (safeNewUri);
          },
          error = function (response) {
            if (response.status === 400) {
              sweetAlert("Cannot edit this page. It is already part of another collection.");
            }
            else {
              handleApiError(response);
            }
          }
        );
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
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "topics": [],
        "alerts": [],
        type: pageType
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
          "_abstract": "",
          "authors": [],
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": "",
          "headline": "",
        },
        "sections": [],
        "accordion": [],
        "relatedDocuments": [],
        "relatedData": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        "externalLinks": [],
        "charts": [],
        "tables": [],
        "images": [],
        "versions": [],
        "alerts": [],
        type: pageType
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
          "datasetId": "",
          "keywords": checkData.description.keywords || [],
          "metaDescription": checkData.description.metaDescription || "",
          "nationalStatistic": checkData.description.nationalStatistic,
          "title": ""
        },
        "downloads": [],
        "versions": [], //{date, uri, correctionNotice}
        "relatedDocuments": [],
        "relatedMethodology": [],
        "relatedMethodologyArticle": [],
        type: pageType
      };
    }

    else {
      sweetAlert('Unsupported page type. This is not a compendium file type');
    }
  }

  function updateParentLink (childUri) {
    if (pageType === "compendium_chapter") {
      parentData.chapters.push({uri: childUri})
    }
    else if (pageType === 'compendium_data') {
      parentData.datasets.push({uri: childUri})
    }
    else
    {
      sweetAlert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }
    putContent(collectionId, parentUrl, JSON.stringify(parentData),
      success = function (message) {
        viewWorkspace(childUri, collectionId, 'edit');
        refreshPreview(childUri);
        console.log("Parent link updating completed " + message);
      },
      error = function (response) {
        if (response.status === 400) {
          sweetAlert("Cannot edit this page. It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}

