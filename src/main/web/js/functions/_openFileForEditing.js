function openFileForEditing(collectionName, data) {
    // Open the file for editing
    $.ajax({
        url: "http://localhost:8082/edit/" + collectionName,
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({uri: getPathName() + "/data.json"}),
        success: function () {
            console.log("File opened for editing");
            updateContent(collectionName, data);
        },
        error: function () {
            console.log('Error opening file for edit');
            updateContent(collectionName, data);
            console.log("update content called.");
        }
    });
}