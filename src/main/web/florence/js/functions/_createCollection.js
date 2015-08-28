function createCollection() {

  var publishDate, publishTime, collectionId, collectionDate, collectionType;
  collectionId = $('#collectionname').val();
  collectionType = $('form input[type=radio]:checked').val();

  if (collectionType === 'scheduled') {
    publishDate  = $('#date').val();
    publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
    var toIsoDate = $('#date').datepicker("getDate");
    collectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
  } else {
    collectionDate  = null;
  };


  // inline tests
  if (collectionId === '') {
    alert('This is not a valid collection name');
    return true;
  } if (collectionId.match(/\./)) {
    alert('This is not a valid collection name. You can not use dots');
    return true;
  } if ((collectionType === 'scheduled') && (isValidDate(new Date(collectionDate)))) {
    alert('This is not a valid date');
    return true;
  } if ((collectionType === 'scheduled') && (Date.parse(collectionDate) < new Date())) {
    alert('This is not a valid date');
    return true;
  } else {
    // Create the collection
    $.ajax({
      url: "/zebedee/collection",
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({name: collectionId, type: collectionType, publishDate: collectionDate}),
      success: function (collection) {
        //console.log("Collection " + collection.name + " created");
        collection.type = collectionType;
        Florence.setActiveCollection(collection);

        //localStorage.setItem("collection", collectionId);
        createWorkspace('', collection.id, 'browse');
      },
      error: function (response) {
        if(response.status === 409) {
          alert('A collection already exists with the name ' + collectionId);
        }
        else {
          handleApiError(response);
        }
      }
    });
  }
}

function isValidDate(d) {
  if (!isNaN(d.getTime()))
    {return false;}
  else
    {return true;}
}

