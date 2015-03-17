function loadPageDataIntoEditor(){

  var pageurl = window.location.href;
  var newSections = [];
  var pageurldata = pageurl.replace("#!", "data");

  $.ajax({
    url: pageurldata,
    dataType: 'json', // Notice! JSONP <-- P (lowercase)
    crossDomain: true,

    success: function(response) {
      makeEditSections(response)
    },

    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });

  function makeEditSections(response){
    if (response.type == 'bulletin'){
      bulletinSections(response);
    }
  }

  function bulletinSections(response){
    $('.fl-editor__headline').hide();

    $(response.sections).each(function(index, section){
      var element = $('.fl-editor__sections').append(
          '<div id="' + index + '" style="background-color:grey; color:white;">' +
          '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
          'Title' +
          '<textarea id="section__' + index + '">' + section.title + '</textarea>' +
          '<textarea id="editor__' + index + '">' + section.markdown + '</textarea>' +
          '<div style="visibility:hidden; height:5px;" id="section_markdown_' + index + '">' +
          section.markdown +
          '</div>' +
          '<button class="fl-panel--editor__sections__section-item__edit_' + index + '">Edit</button>' +
          '</div>');


      $(".fl-panel--editor__sections__section-item__edit_"+index).one('click', function () {
        var textarea = $("#editor__"+index)

        $('body').prepend('<div id="epiceditor"> </div>')
        console.log(textarea.val())
        var opts = {
          file:{
            // need a unique name for the local storage file, achieved by
            // concatenating the pageurl and the section title
            name: pageurldata + section.title,
            defaultContent: textarea.val()
          }
        }
        var editor = new EpicEditor(opts).load().enterFullscreen()
      });
    });

  }


  function sortable() {
    $(".fl-editor__sections").sortable();
    //$("fl-editor__sections").disableSelection();
  }
  sortable();

}


