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
      $('.fl-editor__sections').append(
          '<div id="' + index + '" style="background-color:grey; color:white;">' +
          '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
          'Title' +
          '<textarea id="section__' + index + '">' + section.title + '</textarea>' +
          '<textarea id="editor__' + index + '">' + section.markdown + '</textarea>' +
          '<textarea style="visibility:hidden; height:5px;" id="section_markdown_' + index + '">' +
          section.markdown +
          '</textarea>' +
          '<button class="fl-panel--editor__sections__section-item__edit_'+index+'">Edit</button>' +
          '</div>');

      var element = $("section_markdown_" + index);

      var markdown = $("#section_markdown_"+ index).val();
      $(".fl-panel--editor__sections__section-item__edit_"+index).one('click', function () {

        console.log(contents);
        console.log(index)
      });
    });

      var editor = new EpicEditor({container:element}).load().enterFullscreen()
  }

  function addMarkdownSection(){}
  function sortable() {
    $(".fl-editor__sections").sortable();
    //$("fl-editor__sections").disableSelection();
  }
  sortable();

}


