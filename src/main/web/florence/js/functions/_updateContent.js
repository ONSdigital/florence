function updateContent(collectionName, data) {
    // Update content
    $.ajax({
        url: "http://localhost:8082/content/" + collectionName + "?uri=" + getPathName() + "/data.json",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: data,
        success: function (message) {
            console.log("Updating completed" + message);
          $('.fl-panel--preview__content').get(0).contentDocument.location.reload(true);
        },
        error: function (error) {
            console.log(error);
        }
    });
}   