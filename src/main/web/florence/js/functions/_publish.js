function publish(collectionName) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/publish/" + collectionName,
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    success: function () {
      console.log("File published");
      document.cookie = 'collection=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      alert("Published!");
    },
    error: function () {
      console.log('Error');
    }
  });
}

