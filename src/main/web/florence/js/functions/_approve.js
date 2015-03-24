function approve(collectionName) {


    // Open the file for editing
    $.ajax({
        url: "http://localhost:8082/approve/" + collectionName + "?uri=" + getPathName() + "/data.json",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        headers:{ "X-Florence-Token":accessToken() },
        success: function () {
            console.log("File approved!")
            alert("Your file is now approved");
        },
        error: function () {
            console.log('Error');
        }
    });
}
