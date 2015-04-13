function postApproveCollection(collectionName) {
  $.ajax({
    url: "/zebedee/approve/" + collectionName,
    crossDomain: true,
    type: 'POST',
    headers: { "X-Florence-Token":accessToken() },
    success: function (response) {
      console.log(response);
      console.log(collectionName + ' collection is now approved');
    },
    error: function (response) {
      if (response.status === 409) {
        alert("Cannot approve this collection. It contains files that have not been approved.");
      }
      else {
        handleApiError(response);
      }
    }
  });
}
