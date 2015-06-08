function updateVersionedContent(collectionName, path, content, index) {
  var release = content.release.replace(/[^A-Z0-9]+/ig, "").toLowerCase().slice(0, -2); //change if there is more than a release per month
  var releasePath = path + "/" + release;
  postContent(collectionName, releasePath, content,
    success = function (response) {
      console.log("Updating version completed " + response);
      Florence.Editor.isDirty = false;
      refreshPreview(path);
      loadPageDataIntoEditor(path, collectionName);
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
  // Create a link/most recent page only if this release is the newest
  if (index) {
//    $.ajax({
//      url: "/zebedee/content/" + collectionId + "?uri=" + path + "/data.json",
//      dataType: 'json',
//      type: 'POST',
//      data: {type: link, release: release, uri: collectionId + releasePath},
//      success: function (response) {
//        success(response);
//      },
//      error: function (response) {
//        error(response);
//      }
//    });
    postContent(collectionName, path, content,
      success = function (response) {
        console.log("Updating completed " + response);
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

}