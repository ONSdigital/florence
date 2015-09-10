function publish(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/publish/" + collectionId,
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    success: function () {
      alert("Published!");
      $('.publish-selected').animate({right: "-50%"}, 500);
      // Wait until the animation ends
      setTimeout(function () {
        viewController('publish');
      }, 500);
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

function unlock(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/unlock/" + collectionId,
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    success: function () {
      alert("Unlocked!");
      $('.publish-selected').animate({right: "-50%"}, 500);
      // Wait until the animation ends
      setTimeout(function () {
        viewController('publish');
      }, 500);
    },
    error: function (response) {
      handleApiError(response);
    }
  });
}

