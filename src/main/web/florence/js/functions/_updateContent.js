function updateContent(collectionName, path, content) {
  // Update content
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    data: content,
    success: function (message) {
      console.log("Updating completed" + message);
      //
      $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
      $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);
    },
    error: function (error) {
      if(response.status == 400) {
        alert("Cannot edit this file. It is already part of another collection.");
      }
      else {
        handleApiError(error);
      }
    }
  });
}
