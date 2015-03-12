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
      if (response.type === "bulletin"){

        var dataString = String(response);
        // pageType = data.level
        console.log(response);
        for(i=0;i<response.sections.length;i++){

          $('.fl-editor').append(response.sections[i].title + "<br>");
        }
      }
    },
    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}
