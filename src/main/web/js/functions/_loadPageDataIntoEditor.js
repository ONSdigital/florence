function loadPageDataIntoEditor(){

  var pageurl = window.location.href;
  var newSections = [];
  var pageurldata = pageurl.replace("#!", "data");

  $.ajax({
    url: pageurldata,
    dataType: 'json', // Notice! JSONP <-- P (lowercase)
    crossDomain: true,
    // jsonpCallback: 'callback',
    // type: 'GET',
    success: function(response) {

      if (response.type === "bulletin"){
        $('.fl-editor__headline').hide();
        $(response.sections).each(function(index, section){
          $('.fl-editor__sections').append(
              '<div id="' + index + '" style="background-color:grey; color:white;">' +
              '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
              'Title' +
              '<textarea id="section__' + index + '">' + section.title + '</textarea>' +
              '<textarea style="visibility:hidden; height:5px;" id="section_markdown_' + index + '">' + section.markdown + '</textarea>' +
              '<button class="fl-panel--editor__sections__section-item__edit_'+index+'">Edit</button>' +
              '</div>');
          $(".fl-panel--editor__sections__section-item__edit_"+index).one('click', function () {
            contents = $("#section_markdown_"+ index).val();
            alert(contents);
            //this will load the editor and pass markdown content
          });
        });
        $(".fl-panel--editor__nav__save").click(function(){
          var order = $(".fl-editor__sections").sortable('toArray');
          //console.log(string);
          $(order).each(function(index, name){
            var title = $('#section__'+name).val();
            var markdown = $('#section_markdown_'+name).val(); //|| section.markdown;
            newSections[parseInt(index)] = {title: title, markdown: markdown};
          });
          response.sections = newSections;
          //save("testCollection", JSON.stringify(response));
          console.log(response);
        });

      } else {
        $('.fl-editor__headline').val(JSON.stringify(response, null, 2));
        $('.fl-panel--editor__nav__save').click(function() {
          //if($('.fl-panel--editor__publish-owner').val().length != 0 && $('.fl-panel--editor__publish-id').val().length != 0){
            pageData = $('.fl-editor__headline').val();
            save("testCollection", pageData);
          //} else {
          //  alert('Publish owner and Publish id cannot be blank!');
          //}
        });
      }
    },

    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });

  function sortable() {
    $(".fl-editor__sections").sortable();
    //$("fl-editor__sections").disableSelection();
  }
  sortable();

  //function aa() {
  //
  //  $(".fl-editor__sections").sortable({
  //    start: function (event, ui) {
  //      $(this).data('preventBehaviour', true);
  //    }
  //  });
  //  $("#sortable :input").on('mousedown', function (e) {
  //    var mdown = document.createEvent("MouseEvents");
  //    mdown.initMouseEvent("mousedown", true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
  //    $(this).closest('li')[0].dispatchEvent(mdown);
  //  }).on('click', function (e) {
  //    var $sortable = $("#sortable");
  //    if ($sortable.data("preventBehaviour")) {
  //      e.preventDefault();
  //      $sortable.data("preventBehaviour", false)
  //    }
  //  });
  //
  //}
  //
  //aa();
}


