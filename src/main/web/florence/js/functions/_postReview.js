function saveAndReviewContent(collectionId, path, content) {
  postContent(collectionId, path, content,
    success = function (response) {
      Florence.Editor.isDirty = false;
      postReview(collectionId, path);
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this file. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}

function postReview(collectionId, path) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Florence.globalVars.welsh) {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data_cy.json";
  } else {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data.json";
  }
  // Open the file for editing
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    success: function () {
      viewCollections(collectionId);
    },
    error: function () {
      console.log('Error');
    }
  });
}
