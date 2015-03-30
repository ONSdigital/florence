function updateContent(collectionName, path, content) {
<<<<<<< HEAD

  postContent(collectionName, path, content,
    success = function (response) {
      console.log("Updating completed" + response);
      refreshPreview();
=======
  // Update content
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    data: content,
    success: function (message) {
      console.log("Updating completed " + message);
      //
      $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
      $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);
>>>>>>> Editor retrieves links automatically
    },
    error = function (response) {
      if (response.status == 400) {
        alert("Cannot edit this file. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    });
}
