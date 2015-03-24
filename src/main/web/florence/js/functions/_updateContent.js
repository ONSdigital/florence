function updateContent(collectionName, content) {
  // Update content
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + getPathName() + "/data.json",
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    data: content,
    headers: {
      "X-Florence-Token":accessToken()
    },
    success: function (message) {
      console.log("Updating completed" + message);
      //
      $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
      $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);
    },
    error: function (error) {
      console.log(error);
    }
  });
}
