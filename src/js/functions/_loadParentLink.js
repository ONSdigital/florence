function loadParentLink(collectionId, data, parentUrl) {

  getPageDataTitle(collectionId, parentUrl,
      function (response) {
        var parentTitle = response.title;
        $('.child-page__title').append(parentTitle);
      },
      function () {
        sweetAlert("Error", "Could not find parent that this is a sub page of", "error");
      }
  );

  //Add link back to parent page
  $('.child-page').append("<a class='child-page__link'>Back to parent page</a>");

  //Take user to parent edit screen on link click
  $('.child-page__link').click(function () {
    //If there are edits check whether user wants to continue
    if (Florence.Editor.isDirty) {
      swal ({
        title: "Warning",
        text: "You have unsaved changes. Are you sure you want to continue?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Continue",
        cancelButtonText: "Cancel"
      }, function (result) {
        if (result === true) {
          Florence.Editor.isDirty = false;
          //Return to parent if user confirms it
          updateContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
          return true;
        }
      });
    } else {
      //Return to parent without saving
      createWorkspace(parentUrl, collectionId, 'edit');
    }
  });

}