function approve(collectionID){
  $.ajax({
    url: "/zebedee/approve/"+collectionID,
    crossDomain: true,
    type: 'POST',
    headers: { "X-Florence-Token":accessToken() },
    success: function (response) {
      console.log(response);
      console.log('collection Approved')
    },
    error: function (response) {
      console.log(" Failed to approve collection")
      handleApiError(response)
    }
  });
}
