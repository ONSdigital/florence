function createCollection() {
  var publishDay,publishMonth,publishYear,publishTime,collectionName;
  publishDay   = $('#day').val();
  publishMonth = $('#month').val();
  publishYear  = $('#year').val();
  publishTime  = $('#time').val();
  collectionName = $('#collectionname').val();
  
  var publishDate = new Date(publishYear, publishMonth, publishDay, 9, 30, 0, 0);

  // Create the collection
  console.log(collectionName + " " + publishDate);
  $.ajax({
    url: "/zebedee/collection",
    dataType: 'json',
    type: 'POST',
    data: JSON.stringify({name: collectionName, publishDate: publishDate}),
    success: function () {
      console.log("Collection " + collectionName + " created" );
      document.cookie = "collection=" + collectionName + ";path=/";
      localStorage.setItem("collection", collectionName);
      viewWorkspace();
      $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
      $('.fl-main-menu__item--edit .fl-main-menu__link').addClass('fl-main-menu__link--active');
      clearInterval(window.intervalID);
      window.intervalID = setInterval(function () {
        checkForPageChanged(function () {
          loadPageDataIntoEditor(collectionName, true);
        });
      }, window.intIntervalTime);
    },
    error: function (response) {
      if(response.status === 409) {
        alert('A collection already exists with the name ' + collectionName);
      }
      else {
        handleApiError(response);
      }
    }
  });
}
