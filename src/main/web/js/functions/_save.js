function save(collectionName, data) {


    // Create the collection
    $.ajax({
        url: "http://localhost:8082/collection",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({name: collectionName}),
        success: function () {
          console.log("Collection created");
          updateContent(collectionName, data);
        },
        error: function () {
          console.log('Error creating collection');
          updateContent(collectionName, data);
        }
    });
}