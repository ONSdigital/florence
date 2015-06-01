function postApproveCollection(collectionId) {
  $.ajax({
    url: "/zebedee/approve/" + collectionId,
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    success: function (response) {
      console.log(response);
      console.log(collectionId + ' collection is now approved');
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function(){
        viewController('collections');
      }, 500);
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
