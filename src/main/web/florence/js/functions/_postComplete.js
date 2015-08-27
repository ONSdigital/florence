function saveAndCompleteContent(collectionId, path, content) {
  postContent(collectionId, path, content,
    success = function () {
      Florence.Editor.isDirty = false;
      completeContent(collectionId, path);
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
      }
      else if (response.status === 401) {
        alert("You are not authorised to update content.");
      }
      else {
        handleApiError(response);
      }
    });
}

function completeContent(collectionId, path) {
  var safePath = checkPathSlashes(path);
  if (safePath === '/') {
    safePath = '';          // edge case for home
  }

  if (Florence.globalVars.welsh) {
    if (safePath.match(/\/cy\/?$/)) {
      var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data_cy.json";
    } else {
      var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/cy/data_cy.json";
    }
  } else {
    var url = "/zebedee/complete/" + collectionId + "?uri=" + safePath + "/data.json";
  }
  // Update content
  $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    success: function () {
      viewCollections(collectionId);
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}
