function deleteContent(collectionName, path) {
  $.ajax({
    url: "/zebedee/content/" + collectionName + "?uri=" + path + "/data.json",
    type: 'DELETE',
    success: function (response) {
      console.log("Delete success: " + path);
    },
    error: function (response) {
      console.log("Delete fail #" + response.status + ": " + path);
    }
  });
}