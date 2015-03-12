function loadPageDataIntoEditor(){

  var pageurl = window.location.href;

  var pageurldata = pageurl.replace("#!", "data");

  $.ajax({
    url: pageurldata,
    dataType: 'json', // Notice! JSONP <-- P (lowercase)
    crossDomain: true,
    // jsonpCallback: 'callback',
    // type: 'GET',
    success: function(response) {
      // do stuff with json (in this case an array)
      // console.log("Success");
      var dataString = String(response);
      // pageType = data.level
      // console.log(response);
      $('.fl-editor').val(JSON.stringify(response, null, 2));
    },
    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}