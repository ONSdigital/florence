function postReview(collectionName, path) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/review/" + collectionName + "?uri=" + path + "/data.json",
    dataType: 'json',
    type: 'POST',
    success: function () {
      console.log("File set to reviewed.");
      alert("The file is now awaiting approval.");
    },
    error: function () {
      console.log('Error');
    }
  });
}
