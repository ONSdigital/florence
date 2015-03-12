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
        $('.fl-editor__headline').hide();
        $(response.sections).each(function(index, section){
          $('.fl-editor__sections').append('<textarea id="section__' + index + '">' + section.title + "</textarea>");
          //$('.fl-editor__sections').append('<textarea id="section_markdown_' + index + '">' + section.markdown + "</textarea>");
          $(".fl-editor__sections").append('<button class="fl-panel--editor__sections__section-item__edit">Edit</button>');
          $(".fl-panel--editor__sections__section-item__edit").click(function () {
            $(this).append('<textarea id="section_markdown_' + index + '">' + section.markdown + "</textarea>");
          });
        })
      } else {
        $('.fl-editor__headline').val(JSON.stringify(response, null, 2));
      }
      $(".fl-panel--editor__nav__complete").click(function(){
        //saveEditedJson();
      });
    },
    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });
}
