/**
 * Creates data JSON
 * @param collectionId
 * @param data
 * @param pageType
 * @param pageEdition
 * @param downloadUrl
 */

function loadT8EditionCreator (collectionId, data, pageType, pageEdition, downloadUrl) {
  var releaseDate = null;             //overwrite scheduled collection date
  var pageEditionTrimmed, newUri, pageData;

  pageData = pageTypeDataT8(pageType, data);
  submitNoForm(data.uri, pageEdition, downloadUrl);

  function submitNoForm (parentUrl, edition, downloadUrl) {
    pageData.description.edition = edition;
    pageData.downloads.push({file: downloadUrl});
    pageEditionTrimmed = edition.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if ((pageType === 'dataset') || (pageType === 'timeseries_dataset')) {
      newUri = makeUrl(parentUrl, pageEditionTrimmed);
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
          success = function () {
            updateContent(collectionId, data.uri, JSON.stringify(data));
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

  function pageTypeDataT8(pageType, parentData) {

    if (pageType === "dataset") {
      return {
        "description": {
          "releaseDate": parentData.description.releaseDate || "",
          "nextRelease": parentData.description.nextRelease || "",
          "contact": {
            "name": parentData.description.contact.name || "",
            "email": parentData.description.contact.email || "",
            "telephone": parentData.description.contact.telephone || ""
          },
          "summary": parentData.description.contact.summary || "",
          "datasetId": parentData.description.contact.datasetId || "",
          "keywords": parentData.description.keywords || [],
          "metaDescription": parentData.description.metaDescription || "",
          "nationalStatistic": parentData.description.nationalStatistic || false,
          "edition": ""
        },
        "section": parentData.section || {},      //notes
        "versions": [], //{updateDate, uri, correctionNotice}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else if (pageType === "timeseries_dataset") {
      return {
        "description": {
          "releaseDate": parentData.description.releaseDate || "",
          "nextRelease": parentData.description.nextRelease || "",
          "contact": {
            "name": parentData.description.contact.name || "",
            "email": parentData.description.contact.email || "",
            "telephone": parentData.description.contact.telephone || ""
          },
          "summary": parentData.description.contact.summary || "",
          "datasetId": parentData.description.contact.datasetId || "",
          "keywords": parentData.description.keywords || [],
          "metaDescription": parentData.description.metaDescription || "",
          "nationalStatistic": parentData.description.nationalStatistic || false,
          "edition": ""
        },
        "section": parentData.section || {},      //notes
        "versions": [], //{updateDate, uri, correctionNotice}
        "downloads": [],
        "supplementaryFiles": [],
        type: pageType
      };
    }

    else {
      alert('Unsupported page type. This is not a dataset type');
    }
  }
}

