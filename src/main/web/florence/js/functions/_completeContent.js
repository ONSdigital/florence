function saveAndCompleteContent(collectionName, path, content) {
  postContent(collectionName, path, content,
    success = function (response) {
      completeContent(collectionName, path);
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

function completeContent(collectionName, path) {
  // Update content
  $.ajax({
    url: "/zebedee/complete/" + collectionName + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    success: function (message) {
      console.log("Page is now marked as complete " + message);
      alert("This content has now been submitted for internal review.")
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}
