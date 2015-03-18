function loadPageDataIntoEditor(){

  var pageurl = window.location.href;
  var newSections = [];
  var pageurldata = pageurl.replace("#!", "data");
  var data

  $.ajax({
    url: zebedeeUrl(),
    dataType: 'json', // Notice! JSONP <-- P (lowercase)
    crossDomain: true,

    success: function(response) {
      data = response
      console.log(response)
      makeEditSections(response)
    },

    error: function() {
      console.log(zebedeeUrl())
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

        //clearing local storage here to ensure epic editor uses the default value
        // it wouldnt work with the default value
        localStorage.clear()
        var opts = {
          file:{
            // need a unique name for the local storage file, achieved by
            // concatenating the pageurl and the section title

            name: pageurldata + section.title,
            defaultContent: textarea.val(),
            autoSave: false
          }
        }

        var editor = new EpicEditor(opts).load().enterFullscreen()

        editor.on('save',function(){
          that = this;
          saveToServer(index);
        })


      });
    });

  }

  function saveToServer(index){
    var editedText = that.exportFile()

    data['sections'][index]['markdown'] = editedText

    $.ajax({
      type:"POST",
      url: zebedeeUrl(),
      data:JSON.stringify(data),
      dataType: 'json', // Notice! JSONP <-- P (lowercase)
      crossDomain: true,

      success: function(response) {
        console.log( "DATA posted!")
      },
      error: function() {
        console.log(zebedeeUrl())
        console.log('there was a problem posting the data');
        $('.fl-editor').val('');
      }
    });
  };

  function sortable() {
    $(".fl-editor__sections").sortable();
    //$("fl-editor__sections").disableSelection();
  }
  sortable();

}

function zebedeeUrl(){
  // zebedee expects /content/<collectionName>?uri=<uri>+data.json
  var zebedeeHost = "http://localhost:8082/content"
  var collectionName = "/kanes"
  // Window location pathname would be better here but we can't use because of angular
  var uri = window.location.href.replace("http://localhost:8080/#!", "")
  return zebedeeHost + collectionName + "?uri=" + uri + "/data.json"
}

