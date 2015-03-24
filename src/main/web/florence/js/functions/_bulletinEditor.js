function bulletinEditor(collectionName, data){

  var newSections = [];
  var lastIndex;

  $('.fl-editor__headline').hide();
  $(".list").remove();
  $("#metadata-list").remove();

  // Metadata load
  $("#metadata-section").append(
    '<div id="metadata-list">' +
    '<p>Title: <textarea class="auto-size" type="text" id="title" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    '<p>Next release: <textarea class="auto-size" type="text" id="nextRelease" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    '<p>Contact name: <textarea class="auto-size" type="text" id="contactName" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    '<p>Contact email: <textarea class="auto-size" type="text" id="contactEmail" cols="30" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    // Not being used at the moment
    //'<p>Headline 1: <textarea type="text" id="headline1" cols="40" rows="5"></textarea></p>' +
    //'<p>Headline 2: <textarea type="text" id="headline2" cols="40" rows="5"></textarea></p>' +
    //'<p>Headline 3: <textarea type="text" id="headline3" cols="40" rows="5"></textarea></p>' +
    '<p>Summary: <textarea class="auto-size" type="text" id="summary" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    '</div>');

  //$("textarea.auto-size").change(function() {$("textarea.auto-size").textareaAutoSize();});
  $("#title").val(data.title).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.title = $(this).val();
  });
  $("#nextRelease").val(data.nextRelease).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.nextRelease = $(this).val();
  });
  $("#contactName").val(data.contact.name).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.name = $(this).val();
  });
  $("#contactEmail").val(data.contact.email).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.email = $(this).val();
  });
  $("#summary").val(data.summary).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.summary = $(this).val();
  });
  //$("#headline1").val(data.headline1);
  //$("#headline2").val(data.headline2);
  //$("#headline3").val(data.headline3);

  // Edit sections
  $(data.sections).each(function(index, section){
    lastIndex = index + 1;
    var element = $('.fl-editor__sections').append(
        '<div id="' + index + '" class="list" style="background-color:grey; color:white;">' +
        '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
        'Title ' +
        '<textarea id="section__' + index + '">' + section.title + '</textarea>' +
        '<textarea style="display: none;" id="section_markdown_' + index + '">' +
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

      markdownEditor();
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
  $('.fl-panel--editor__nav__save').unbind("click");
  $(".fl-panel--editor__nav__save").click(function() {
    var order = $(".fl-editor__sections").sortable('toArray');
    $(order).each(function (index, name) {
      var title = $('#section__' + name).val();
      var markdown = data.sections[index].markdown;
      newSections[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    updateContent(collectionName, JSON.stringify(data));
  });

  //Add new sections
  if ($("#addSection").length === 0) {
    $(".fl-panel--editor__nav").prepend('<button id="addSection">Add new section</button>');

    $("#addSection").click(function () {
      $('.fl-editor__sections').append(
          '<div id="' + lastIndex + '" class="list" style="background-color:grey; color:white;">' +
          '<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
          'Title ' +
          '<textarea id="section__' + lastIndex + '"></textarea>' +
          '<textarea style="display: none;" id="section_markdown_' + lastIndex + '"></textarea>' +
          '<button class="fl-panel--editor__sections__section-item__edit_' + lastIndex + '">Edit</button>' +
          '<button class="fl-panel--editor__sections__section-item__delete_' + lastIndex + '">Delete</button>' +
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
    $("#metadata-list").remove();
    bulletinEditor(collectionName, data);
  }

}

