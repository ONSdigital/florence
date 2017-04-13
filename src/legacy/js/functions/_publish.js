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

      if(response) {
        sweetAlert("Published!", "Your collection has successfully published", "success");

        $('.publish-selected').animate({right: "-50%"}, 500);
        // Wait until the animation ends
        setTimeout(function () {
          viewController('publish');
        }, 500);
      } else {
        console.log('An error has occurred during the publish process, please contact an administrator. ' + response);
        sweetAlert("Oops!", 'An error has occurred during the publish process, please contact an administrator.', "error");
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
      sweetAlert("Unlocked!", "Your collection has be unlocked from publishing", "success");
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

