function bulletinEditor(data){

  var newSections = [];
  var data;
  var lastIndex;

  $('.fl-editor__headline').hide();
  $(".list").remove();

  // Edit sections
  $(data.sections).each(function(index, section){
    lastIndex = index + 1;
    var element = $('.fl-editor__sections').append(
        '<div id="' + index + '" class="list" style="background-color:grey; color:white;">' +
        '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
        'Title' +
        '<textarea id="section__' + index + '">' + section.title + '</textarea>' +
        '<textarea style="visibility:hidden; height:2px;" id="section_markdown_' + index + '">' +
        section.markdown + '</textarea>' +
        '<button class="fl-panel--editor__sections__section-item__edit_' + index + '">Edit</button>' +
        '<button class="fl-panel--editor__sections__section-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__sections__section-item__edit_"+index).click(function() {
      editedValue = $("#section_markdown_" + index).val();

      $('body').prepend('<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>');

      $('body').prepend('<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
      '<div id="wmd-button-bar"></div>' +
      '<textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedValue + '</textarea>' +
      '<button id="finish">Finish editing</button>' +
      '</div>');

      $("#finish").click(function(){
        editedText = $('#wmd-input').val();
        data.sections[index].markdown = editedText;
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
      });

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

    // Delete functionality
    $(".fl-panel--editor__sections__section-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      saveNewSection();
    });
  });

  function sortable() {
    $(".fl-editor__sections").sortable();
  }
  sortable();

  // Save ordered sections
  $(".fl-panel--editor__nav__save").click(function() {
    var order = $(".fl-editor__sections").sortable('toArray');
    $(order).each(function(index, name){
      var title = $('#section__'+name).val();
      var markdown = data.sections[index].markdown;
      newSections[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    updateContent(collectionName, JSON.stringify(data));
  });

  //Add new sections
  if($("#addSection").length === 0) {
    $(".fl-panel--editor__nav").prepend('<button id="addSection">Add new section</button>');

    $("#addSection").click(function () {
      $('.fl-editor__sections').append(
          '<div id="' + lastIndex + '" class="list" style="background-color:grey; color:white;">' +
          '<div style="background-color:grey; color:white;">' +
          '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
          'Title' +
          '<textarea id="section__' + lastIndex + '"></textarea>' +
          '<textarea style="visibility:hidden; height:2px;" id="section_markdown_' + lastIndex + '"></textarea>' +
          '<button class="fl-panel--editor__sections__section-item__edit_' + lastIndex + '">Edit</button>' +
          '</div>');
      sortable();
      saveNewSection();
    });
  }

  function saveNewSection() {
    var order = $(".fl-editor__sections").sortable('toArray');
    $(order).each(function(index, name){
      var title = $('#section__'+name).val();
      var markdown = $('#section_markdown_'+name).val();
      newSections[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    $(".list").remove();
    bulletinEditor(collectionName, data);
  }

}

