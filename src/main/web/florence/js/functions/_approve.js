function approve(collectionId) {

  // Open the file for editing
  $.ajax({
    url: "/zebedee/approve/" + collectionId,
    dataType: 'json',
    crossDomain: true,
    type: 'POST',
    success: function () {
      console.log("File approved");
      $('.collection-selected').stop().animate({right: "-50%"}, 500);
      $('.collections-select-table tbody tr').removeClass('selected');
      // Wait until the animation ends
      setTimeout(function(){
        viewController('collections');
      }, 500);
    },
    error: function () {
      console.log('Error');
    }
  });
}