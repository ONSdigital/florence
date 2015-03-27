function completeContent(collectionName, path) {
  // Update content
  $.ajax({
    url: "/zebedee/complete/" + collectionName + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    success: function (message) {
      console.log("Page is now marked as complete " + message);

      $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
      $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);

      //Todo: go back to browse view?
    },
    error: function (response) {
      handleApiError(response)
    }
  });
}
