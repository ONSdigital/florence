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
  var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDateManual, isInheriting, newUri, pageData, parentData;
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
        alert("This is not a valid place to create this page.");
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
      releaseDateManual = $('#releaseDate').val();
      if (pageType === 'compendium_landing_page') {
        pageData.description.edition = $('#edition').val();
      }
      if (!title) {
        pageTitle = $('#pagename').val();
      }

      pageData.description.title = pageTitle;
      pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      if (pageData.description.edition) {
        releaseUri = pageData.description.edition;
      }

      if (!pageData.description.edition && releaseDateManual) {                          //Manual collections
        date = $.datepicker.parseDate("dd MM yy", releaseDateManual);
        releaseUri = $.datepicker.formatDate('yy-mm-dd', date);
      } else if (!pageData.description.edition && !releaseDateManual) {
        releaseUri = $.datepicker.formatDate('yy-mm-dd', new Date(releaseDate));
      }

      if (pageType === 'compendium_landing_page' && releaseDate == null) {
        pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
      }
      else if (pageType === 'compendium_landing_page' && releaseDate) {
        pageData.description.releaseDate = releaseDate;
      }

      if (isInheriting && pageType === 'compendium_landing_page') {
        newUri = makeUrl(parentUrl, releaseUri);
      }
      else if (pageType === 'compendium_landing_page') {
        uriSection = "compendium";
        newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed, releaseUri);
      }
      else if ((pageType === 'compendium_chapter') || (pageType === 'compendium_data')) {
        newUri = makeUrl(parentUrl, pageTitleTrimmed);
      }
      else {
        alert('Oops! Something went the wrong way.');
        loadCreateScreen(collectionId);
      }
      var safeNewUri = checkPathSlashes(newUri);

      if ((pageType === 'compendium_landing_page') && (!pageData.description.edition)) {
        alert('Edition can not be empty');
        e.preventDefault();
        return true;
      } if ((pageType === 'compendium_landing_page') && (!pageData.description.releaseDate)) {
        alert('Release date can not be empty');
        e.preventDefault();
        return true;
      } if (pageTitle.length < 5) {
        alert("This is not a valid file title");
        e.preventDefault();
        return true;
      }
      else {
        getPageData(collectionId, safeNewUri,
          success = function() {
            alert('This page already exists');
          },
          // if the page does not exist, create it
          error = function() {
            postContent(collectionId, safeNewUri, JSON.stringify(pageData),
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
                if (response.status === 400) {
                  alert("Cannot edit this page. It is already part of another collection.");
                }
                else {
                  handleApiError(response);
                }
              }
            )
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
      alert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }

  var safeNewUri = checkPathSlashes(newUri);

    // check if the page exists
    getPageData(collectionId, safeNewUri,
      success = function() {
        alert('This page already exists');
      },
      // if the page does not exist, create it
      error = function() {
        postContent(collectionId, safeNewUri, JSON.stringify(pageData),
          success = function (message) {
            console.log("Updating completed " + message);
            updateParentLink (safeNewUri);
          },
          error = function (response) {
            if (response.status === 400) {
              alert("Cannot edit this page. It is already part of another collection.");
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
        "corrections": [],
        "relatedMethodology": [],
        "topics": [],
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
        "externalLinks": [],
        "charts": [],
        "tables": [],
        "images": [],
        "corrections": [],
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
        type: pageType
      };
    }

    else {
      alert('Unsupported page type. This is not a compendium file type');
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
      alert('Oops! Something went the wrong way.');
      loadCreateScreen(collectionId);
    }
    postContent(collectionId, parentUrl, JSON.stringify(parentData),
      success = function (message) {
        viewWorkspace(childUri, collectionId, 'edit');
        refreshPreview(childUri);
        console.log("Parent link updating completed " + message);
      },
      error = function (response) {
        if (response.status === 400) {
          alert("Cannot edit this page. It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}

