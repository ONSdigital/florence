function createCollection() {

  var publishTime, collectionId, collectionDate, releaseUri;
  collectionId = $('#collectionname').val();
  var publishType = $('input[name="publishType"]:checked').val();
  var scheduleType = $('input[name="scheduleType"]:checked').val();

  console.log('publish type: ' + publishType);
  console.log('schedule type: ' + scheduleType);

  if (publishType === 'scheduled') {
    publishTime  = parseInt($('#hour').val()) + parseInt($('#min').val());
    var toIsoDate = $('#date').datepicker("getDate");
    collectionDate = new Date(parseInt(new Date(toIsoDate).getTime()) + publishTime).toISOString();
  } else {
    collectionDate  = null;
  };

  if (scheduleType === 'release') {
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
  } if ((publishType === 'scheduled') && (scheduleType === 'custom')  && (isValidDate(new Date(collectionDate)))) {
    alert('This is not a valid date');
    return true;
  } if ((publishType === 'scheduled') && (scheduleType === 'custom') && (Date.parse(collectionDate) < new Date())) {
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

