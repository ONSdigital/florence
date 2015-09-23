function publish(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/publish/" + collectionId,
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    type: 'POST',
    success: function (response) {
      $('.over').remove();

      if(response === 'true') {
        alert("Published!");

        $('.publish-selected').animate({right: "-50%"}, 500);
        // Wait until the animation ends
        setTimeout(function () {
          viewController('publish');
        }, 500);
      } else {
        console.log('An error has occurred during the publish process, please contact an administrator. ' + response);
        alert('An error has occurred during the publish process, please contact an administrator. ');
      }
    },
    error: function (response) {
      $('.over').remove();
      handleApiError(response);
    }
  });
}

function unlock(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/unlock/" + collectionId,
    dataType: 'json',
    contentType: 'application/json',
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

