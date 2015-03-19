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
          '<button class="fl-panel--editor__sections__section-item__edit_' + index + '">Edit</button>' +
          '</div>');

      $(".fl-panel--editor__sections__section-item__edit_"+index).one('click', function () {
        editedValue = $("#section_markdown_" + index).val();


        $('body').prepend('<div id="wmd-preview" class="wmd-panel wmd-preview"></div>');

        $('body').prepend('<div class="wmd-panel">' +
                              '<div id="wmd-button-bar"></div>' +
                              '<textarea class="wmd-input" id="wmd-input">' + editedValue + '</textarea>' +
                              '<button>Save edited content</button>' +
                              '</div>');

        var converter = Markdown.getSanitizingConverter();

        Markdown.Extra.init(converter, {
          extensions: "all"
        });

        var editor = new Markdown.Editor(converter);

        editor.hooks.chain("onPreviewRefresh", function () {
          MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        });
        editor.run();
        });
    });
  }

  function saveMarkdown(index){
    editedText = $('wmd-input').val();
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


