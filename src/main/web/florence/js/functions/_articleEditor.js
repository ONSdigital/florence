function articleEditor(collectionName, data) {

  var newSections = [];
  var newTabs = [];
  var newRelated = [];
  var newLinks = [];
  var lastIndexSection, lastIndexTab, lastIndexRelated, lastIndexLink;

  //console.log(data.sections);

  $(".section-list").remove();
  //$(".tab-list").remove();
  //$(".article-list").remove();
  //$(".link-list").remove();
  $("#addSection").remove();
  $("#addTab").remove();
  $("#addArticle").remove();
  $("#addLink").remove();

  $("#metadata-list").remove();

  // Metadata load
  $("#metadata-section").append(
      '<div id="metadata-list">' +
      ' <p>Title: <textarea class="auto-size" type="text" id="title" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Contact name: <textarea class="auto-size" type="text" id="contactName" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Contact email: <textarea class="auto-size" type="text" id="contactEmail" cols="30" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Headline 1: <textarea class="auto-size" type="text" id="headline1" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Headline 2: <textarea class="auto-size" type="text" id="headline2" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Headline 3: <textarea class="auto-size" type="text" id="headline3" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      ' <p>Summary: <textarea class="auto-size" type="text" id="summary" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
      '</div>');

  // Metadata edition and saving
  $("#title").val(data.title).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.title = $(this).val();
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
  $("#headline1").val(data.headline1).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline1 = $(this).val();
  });
  $("#headline2").val(data.headline2).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline2 = $(this).val();
  });
  $("#headline3").val(data.headline3).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline3 = $(this).val();
  });

  var style = "background-image:url(img/sb_v_double_arrow.png);background-repeat: no-repeat; background-position:10px 25px";

  // Edit sections
  // Load and edition
  $(data.sections).each(function(index, section){
    lastIndexSection = index + 1;
    $('.fl-editor__sections').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
          //'<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
        'Title ' +
        ' <textarea id="section__' + index + '" cols="50">' + section.title + '</textarea>' +
        ' <textarea style="display: none;" id="section_markdown_' + index + '">' + section.markdown + '</textarea>' +
        ' <button class="fl-panel--editor__sections__section-item__edit_' + index + '">Edit</button>' +
        ' <button class="fl-panel--editor__sections__section-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__sections__section-item__edit_"+index).click(function() {
      var editedSectionValue = $("#section_markdown_" + index).val();

      var editorPrev = '<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>';
      var editorEdit = '<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
          '<div id="wmd-button-bar"></div>' +
          ' <textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedSectionValue + '</textarea>' +
          ' <button id="finish-section">Finish editing</button>' +
          '</div>';

      $('body').prepend(editorPrev, editorEdit);

      markdownEditor();

      $("#finish-section").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.sections[index].markdown = editedSectionText;
        var editedSectionTitle = $('#section__' + index).val();
        data.sections[index].title = editedSectionTitle;
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
        articleEditor(collectionName, data);
        save();
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });

    // Delete
    $(".fl-panel--editor__sections__section-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      articleEditor(collectionName, data);
    });
  });

  //Add new sections
  $("#content-section").append('<button id="addSection">Add new section</button>');
  $("#addSection").click(function () {
    $('.fl-editor__sections').append(
        '<div id="' + lastIndexSection + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="section__' + lastIndexSection + '" cols="50"></textarea>' +
        ' <textarea style="display: none;" id="section_markdown_' + lastIndexSection + '"></textarea>' +
        ' <button class="fl-panel--editor__sections__section-item__edit_' + lastIndexSection + '">Edit</button>' +
        ' <button class="fl-panel--editor__sections__section-item__delete_' + lastIndexSection + '">Delete</button>' +
        '</div>');
    sortableSections();
    saveNewSection();
  });

  function saveNewSection() {
    var orderSection = $(".fl-editor__sections").sortable('toArray');
    $(orderSection).each(function(index, name){
      var title = $('#section__'+name).val();
      var markdown = $('#section_markdown_'+name).val();
      newSections[index] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    $(".section-list").remove();
    $("#metadata-list").remove();
    articleEditor(collectionName, data);
  }

  function sortableSections() {
    $(".fl-editor__sections").sortable();
  }
  sortableSections();

  // Edit accordion
  // Load and edition
  $(data.accordion).each(function(index, tab) {
    lastIndexTab = index + 1;
    $('.fl-editor__accordion').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="tab__' + index + '" cols="50">' + tab.title + '</textarea>' +
        ' <textarea style="display: none;" id="tab_markdown_' + index + '">' + tab.markdown + '</textarea>' +
        ' <button class="fl-panel--editor__accordion__tab-item__edit_' + index + '">Edit</button>' +
        ' <button class="fl-panel--editor__accordion__tab-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__accordion__tab-item__edit_"+index).click(function() {
      var editedTabValue = $("#tab_markdown_" + index).val();

      var editorPrev = '<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>';
      var editorEdit = '<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
          '<div id="wmd-button-bar"></div>' +
          ' <textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedTabValue + '</textarea>' +
          ' <button id="finish-tab">Finish editing</button>' +
          '</div>';

      $('body').prepend(editorPrev, editorEdit);

      markdownEditor();

      $("#finish-tab").click(function() {
        data.accordion[index].markdown = $('#wmd-input').val();
        data.accordion[index].title = $('#tab__' + index).val();
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
        save();
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });

    // Delete
    $(".fl-panel--editor__accordion__tab-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.accordion.splice(index, 1);
      articleEditor(collectionName, data);
    });
  });

  //Add new tab
  $("#accordion-section").append('<button id="addTab">Add new tab</button>');
  $("#addTab").click(function () {
    $('.fl-editor__accordion').append(
        '<div id="' + lastIndexTab + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="tab__' + lastIndexTab + '" cols="50"></textarea>' +
        ' <textarea style="display: none;" id="tab_markdown_' + lastIndexTab + '"></textarea>' +
        ' <button class="fl-panel--editor__accordion__tab-item__edit_' + lastIndexTab + '">Edit</button>' +
        ' <button class="fl-panel--editor__accordion__tab-item__delete_' + lastIndexTab + '">Delete</button>' +
        '</div>');
    sortableTabs();
    saveNewTab();
  });

  function saveNewTab() {
    var orderTab = $(".fl-editor__accordion").sortable('toArray');
    $(orderTab).each(function(index, name){
      var title = $('#tab__'+name).val();
      var markdown = $('#tab_markdown_'+name).val();
      newTabs[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    console.log(data.accordion);
    $(".tab-list").remove();
    $("#metadata-list").remove();
    articleEditor(collectionName, data);
  }

  function sortableTabs() {
    $(".fl-editor__accordion").sortable();
  }
  sortableTabs();

  // Related article
  // Load
  if (data.relatedArticles.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedArticles).each(function (iArticle, article) {
      lastIndexRelated = iArticle + 1;
      $('.fl-editor__related').append(
          '<div id="' + iArticle + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
          'Link ' +
          '  <textarea id="article_' + iArticle + '" cols="50">' + article.uri + '</textarea>' +
          '  <textarea style="display: none;" id="article_name_' + iArticle + '">' + article.name + '</textarea>' +
          '  <textarea style="display: none;" id="article_summary_' + iArticle + '">' + article.summary + '</textarea>' +
          '  <button class="fl-panel--editor__related__article-item__delete_' + iArticle + '">Delete</button>' +
          '</div>');

      // Delete
      $(".fl-panel--editor__related__article-item__delete_" + iArticle).click(function () {
        $("#" + iArticle).remove();
        data.relatedArticles.splice(iArticle, 1);
        articleEditor(collectionName, data);
      });
    });
  }

  //Add new related
  $("#related-section").append('<button id="addArticle">Add new link</button>');
  $("#addArticle").one('click', function () {
    $('.fl-editor__related').append(
        '<div id="' + lastIndexRelated + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Link ' +
        '  <textarea id="article__' + lastIndexRelated + '" placeholder="Go to the related article and click Get" cols="50"></textarea>' +
        '  <button class="fl-panel--editor__related__article-item__get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="fl-panel--editor__related__article-item__cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');

    $(".fl-panel--editor__related__article-item__cancel_" + lastIndexRelated).hide();

    unCheckPage();
    loadPageDataIntoEditor(collectionName, false);

    $(".fl-panel--editor__related__article-item__get_" + lastIndexRelated).one('click', function () {
      $(".fl-panel--editor__related__article-item__cancel_" + lastIndexRelated).show().one('click', function () {
        $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
        checkPage();
        $(".fl-panel--editor__related__article-item__cancel_" + lastIndexRelated).remove();
        articleEditor(collectionName, data);
      });
      var articleurl = $('.fl-panel--preview__content').contents().get(0).location.href;
      var articleurldata = "/data" + articleurl.split("#!")[1];
      $.ajax({
        url: articleurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'article') {
            $('#article__' + lastIndexRelated).val(relatedData.uri);
            $('.article-list').append(
                '<textarea style="display: none;" id="article_name_' + lastIndexRelated + '"></textarea>' +
                '<textarea style="display: none;" id="article_summary_' + lastIndexRelated + '"></textarea>');
            $('#article_name_' + lastIndexRelated).val(relatedData.name);
            $('#article_summary_' + lastIndexRelated).val(relatedData.summary);
            saveNewArticle();
            $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
            checkPage();
            save();
            updateContent(collectionName, getPathName(), JSON.stringify(data));
          } else {
            alert("This is not a article");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
    sortableRelated();
  });

  function checkPage() {
    window.intervalID = setInterval(function () {
      checkForPageChanged(function () {
        loadPageDataIntoEditor(collectionName, true);
      });
    }, intIntervalTime);
  }

  function unCheckPage() {
    clearInterval(window.intervalID);
  }

  function sortableRelated() {
    $(".fl-editor__related").sortable();
  }

  sortableRelated();

  function saveNewArticle() {
    var orderArticle = $(".fl-editor__related").sortable('toArray');
    $(orderArticle).each(function(indexB, nameB){
      var uri = $('#article__'+nameB).val();
      var summary = $('#article_summary_'+nameB).val();
      var names = $('#article_name_'+nameB).val();
      newRelated[parseInt(indexB)] = {uri: uri, name: names, summary: summary};
    });
    data.relatedArticles = newRelated;
    $(".article-list").remove();
    $("#metadata-list").remove();
    articleEditor(collectionName, data);
  }

  // Edit external
  // Load and edition
  $(data.externalLinks).each(function(index, link){
    lastIndexLink = index + 1;
    $('.fl-editor__external').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="link__' + index + '" cols="50">' + link.url + '</textarea>' +
        ' <button class="fl-panel--editor__external__link-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    // Delete
    $(".fl-panel--editor__external__link-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.externalLinks.splice(index, 1);
      articleEditor(collectionName, data);
    });
  });

  //Add new external
  $("#external-section").append('<button id="addLink">Add new link</button>');
  $("#addLink").click(function () {
    $('.fl-editor__external').append(
        '<div id="' + lastIndexLink + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="link__' + lastIndexLink + '" placeholder="Copy the link here" cols="50"></textarea>' +
        ' <button class="fl-panel--editor__external__link-item__delete_' + lastIndexLink + '">Delete</button>' +
        '</div>');
    sortableLinks();
    saveNewLink();
  });

  function saveNewLink() {
    var orderLink = $(".fl-editor__external").sortable('toArray');
    $(orderLink).each(function(index, name){
      var link;
      if($('#link__' + name).val().length === 0) {
        link = "";
      } else {
        link = $('#link__' + name).val();
      }
      newLinks[index] = {url: link};
    });
    data.externalLinks = newLinks;
    $(".link-list").remove();
    $("#metadata-list").remove();
    articleEditor(collectionName, data);
  }

  function sortableLinks() {
    $(".fl-editor__external").sortable();
  }
  sortableLinks();



  // Save
  $('.fl-panel--editor__nav__save').unbind("click").click(function () {
    save();
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // complete
  $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
    pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
  });


  function save() {
    // Sections
    var orderSection = $(".fl-editor__sections").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = $('#section_markdown_' + nameS).val();
      var title = $('#section__' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $(".fl-editor__accordion").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab__' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    console.log(newTabs);
    data.accordion = newTabs;
    // Related links
    var orderArticle = $(".fl-editor__related").sortable('toArray');
    $(orderArticle).each(function (indexB, nameB) {
      var uri = $('#article__' + nameB).val();
      var summary = $('#article_summary_' + nameB).val();
      var name = $('#article_name_' + nameB).val();
      newRelated[indexB]= {uri: uri, name: name, summary: summary};
    });
    data.relatedArticles = newRelated;
    //console.log(data.relatedArticles);
    // External links
    var orderLink = $(".fl-editor__external").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var link = $('#link__'+nameL).val();
      newLinks[indexL] = {url: link};
    });
    data.externalLinks = newLinks;
    //console.log(data);
    articleEditor(collectionName, data);
  }
}

