/**
 * Checks a file does not exist before saving
 * @param collectionId
 * @param uri
 * @param data
 */
function checkSaveContent(collectionId, uri, data) {
  // check if the page exists
  if (Florence.globalVars.welsh) {
    var getUri = uri + '/data_cy.json';
  } else {
    var getUri = uri + '/data.json';
  }
  getPageData(collectionId, getUri,
    success = function () {
      sweetAlert('This page already exists', '');
    },
    // if the page does not exist, create it
    error = function () {
      save(collectionId, uri, data);
    }
  );

  function save(collectionId, uri, data) {
    putContent(collectionId, uri, JSON.stringify(data),
      success = function (message) {
        console.log("Updating completed " + message);
        createWorkspace(uri, collectionId, 'edit');
      },
      error = function (response) {
        if (response.status === 400) {
            sweetAlert("Cannot edit this page", "It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }
}
