function createCollection() {

  var publishTime, collectionId, collectionDate, collectionType, releaseUri;
  collectionId = $('#collectionname').val();
  collectionType = $('form input[type=radio]:checked').val();

  var publishType = collectionType;
  if (collectionType === 'release') {
    publishType = 'scheduled';
  }

  if (collectionType === 'scheduled') {
    publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
    var toIsoDate = $('#date').datepicker("getDate");
    collectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
  } else {
    collectionDate  = null;
  };

  if (collectionType === 'release') {
    releaseUri  = $('#collection-release').val();
  } else {
    releaseUri  = null;
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
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({name: collectionId, type: publishType, publishDate: collectionDate, releaseUri: releaseUri}),
      success: function (collection) {
        Florence.setActiveCollection(collection);
        createWorkspace('', collection.id, 'browse');
      },
      error: function (response) {
        if(response.status === 409) {
          alert(response.responseJSON.message);
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

