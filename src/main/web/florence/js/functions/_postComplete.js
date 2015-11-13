function saveAndCompleteContent(collectionId, path, content, redirectToPath) {
  putContent(collectionId, path, content,
    success = function () {
      Florence.Editor.isDirty = false;
      if (redirectToPath) {
        completeContent(collectionId, path, redirectToPath);
      } else {
        completeContent(collectionId, path);
      }
    },
    error = function (response) {
      if (response.status === 400) {
        sweetAlert("Cannot edit this page", "It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}

function completeContent(collectionId, path, redirectToPath) {
  var redirect = redirectToPath;
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Florence.globalVars.welsh) {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data_cy.json";
  } else {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data.json";
  }
  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    success: function () {
      if (redirect) {
        createWorkspace(redirect, collectionId, 'edit');
        return;
      } else {
        viewCollections(collectionId);
      }
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}
