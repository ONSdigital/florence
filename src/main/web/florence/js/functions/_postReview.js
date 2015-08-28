function saveAndReviewContent(collectionId, path, content) {
  postContent(collectionId, path, content,
    success = function (response) {
      Florence.Editor.isDirty = false;
      postReview(collectionId, path);
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}

function postReview(collectionId, path) {
  var safePath = checkPathSlashes(path);
  // Open the file for editing
  $.ajax({
    url: "/zebedee/review/" + collectionId + "?uri=" + safePath + "/data.json",
    dataType: 'json',
    type: 'POST',
    success: function () {
      //console.log("File set to reviewed.");
      //alert("The file is now awaiting approval.");
      viewCollections(collectionId);
    },
    error: function () {
      console.log('Error');
    }
  });
}
