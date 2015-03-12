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
      data = response;
      if (response.type === "bulletin"){
        $(response.sections).each(function(index, section){
          $('.fl-editor__sections').append('<textarea id="section__'+index+'">' + section.title + "</textarea>");
        })
      }
      $(".fl-panel--editor__nav__complete").click(function(){
        saveEditedJson();
      });
    },
    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}
