function loadPageDataIntoEditor(){

  var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
    var newSections = [];
  var pageurldata = "/data" + pageurl.split("#!")[1];
  var data;

  $.ajax({
    url: pageurldata,
    dataType: 'json',
    crossDomain: true,

    success: function(response) {
      data = response;
      console.log(response);
      makeEditSections(response);
    },

    error: function() {
      console.log('No page data returned');
      $('.fl-editor').val('');
    }
  });

  function makeEditSections(response){
    if (response.type == 'bulletin'){
      bulletinSections(response);
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
        var textarea = $("#editor__"+index);

        $('body').prepend('<div style="height: 500px; width: 600px;" id="epiceditor"> </div>' +
        '<div style="height: 500px; width: 600px;" id="preview"> </div>');

        var opts = {
          basePath: "http://localhost:8081/florence/css/third-party/epiceditor",
          file:{
            // need a unique name for the local storage file, achieved by
            // concatenating the pageurl and the section title
            name: pageurldata + section.title,
            defaultContent: textarea.val(),
            autoSave: true
          }
        };

        var myCustomPreviewDiv = document.querySelector('#preview');
        editor = new EpicEditor(opts);
        editor.on('load', function () {
          myCustomPreviewDiv.innerHTML = this.exportFile(null, 'html');
        });
        editor.on('update', function () {
          myCustomPreviewDiv.innerHTML = this.exportFile(null, 'html');
        });
        editor.load();

        editor.on('save',function(){
          that = this;
          saveMarkdown(index);
        })
      });
    });
  }

  function saveMarkdown(index){
    var editedText = that.exportFile();
    data.sections[index].markdown = editedText;
  }

  // Save ordered sections
  $(".fl-panel--editor__nav__save").click(function(){
    var order = $(".fl-editor__sections").sortable('toArray');
    $(order).each(function(index, name){
      var title = $('#section__'+name).val();
      var markdown = data.sections[name].markdown;
      newSections[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    //save("testCollection", JSON.stringify(response));
    console.log(data);
  });

  function sortable() {
    $(".fl-editor__sections").sortable();
  }
  sortable();
}


