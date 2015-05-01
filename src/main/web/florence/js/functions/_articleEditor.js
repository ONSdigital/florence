function articleEditor(collectionName, data) {

  var newSections = [], newTabs = [], newRelated = [], newLinks = [];
  var lastIndexRelated;
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);

  //console.log(data.sections);

  $("#nextRelease").remove();
  $("#description-p").remove();
  $("#relBulletin").remove();
  $("#relDataset").remove();
  $("#used").remove();
  $("#download").remove();
  $("#note").remove();


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

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if(data.nationalStatistic === "false" || data.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
  });

  // Correction section
  // Load
  $(data.correction).each(function (index, correction) {

    $("#correction_text_" + index).on('click keyup', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('click keyup', function () {
      data.correction[index].date = $(this).val();
    });

    // Delete
    $("#correction-delete_" + index).click(function () {
      $("#" + index).remove();
      data.correction.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // Edit sections
  // Load and edition
  $(data.sections).each(function(index, section){

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = $("#section-markdown_" + index).val();
      var html = templates.markdownEditor(editedSectionValue);
      $('body').append(html);
      $('.markdown-editor').stop().fadeIn(200);

      markdownEditor();
      markDownEditorSetLines();

      $('.btn-markdown-editor-cancel').on('click', function() {
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $(".btn-markdown-editor-save").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.sections[index].markdown = editedSectionText;
        var editedSectionTitle = $('#section-title_' + index).val();
        data.sections[index].title = editedSectionTitle;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });

      $(".btn-markdown-editor-exit").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.sections[index].markdown = editedSectionText;
        var editedSectionTitle = $('#section-title_' + index).val();
        data.sections[index].title = editedSectionTitle;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $("#wmd-input").on('click', function() {
        markDownEditorSetLines();
      });

      $("#wmd-input").on('keyup', function() {
        markDownEditorSetLines();
      });
    });

    // Delete
    $("#section-delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  //Add new sections
  $("#addSection").one('click', function () {
    data.sections.push({title:"", markdown:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  function sortableSections() {
    $("#sortable-sections").sortable();
  }
  sortableSections();

  // Edit accordion
  // Load and edition
  $(data.accordion).each(function(index, tab) {

    $("#tab-edit_"+index).click(function() {
      var editedSectionValue = $("#tab-markdown_" + index).val();
      var html = templates.markdownEditor(editedSectionValue);
      $('body').append(html);
      $('.markdown-editor').stop().fadeIn(200);

      markdownEditor();
      markDownEditorSetLines();

      $('.btn-markdown-editor-cancel').on('click', function() {
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $(".btn-markdown-editor-save").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.accordion[index].markdown = editedSectionText;
        var editedSectionTitle = $('#tab-title_' + index).val();
        data.accordion[index].title = editedSectionTitle;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });

      $(".btn-markdown-editor-exit").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.accordion[index].markdown = editedSectionText;
        var editedSectionTitle = $('#tab-title_' + index).val();
        data.accordion[index].title = editedSectionTitle;
        updateContent(collectionName, getPathName(), JSON.stringify(data));
        $('.markdown-editor').stop().fadeOut(200).remove();
      });

      $("#wmd-input").on('click', function() {
        markDownEditorSetLines();
      });

      $("#wmd-input").on('keyup', function() {
        markDownEditorSetLines();
      });
    });

    // Delete
    $("#tab-delete_"+index).click(function() {
      $("#"+index).remove();
      data.accordion.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  //Add new tab
  $("#addTab").one('click', function () {
    data.accordion.push({title:"", markdown:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  function sortableTabs() {
    $("#sortable-tabs").sortable();
  }
  sortableTabs();

  // Related article
  // Load
  if (data.relatedArticles.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedArticles).each(function (iArticle, article) {
      lastIndexRelated = iArticle + 1;

      // Delete
      $(".fl-panel--editor__related__article-item__delete_" + iArticle).click(function () {
        $("#" + iArticle).remove();
        data.relatedArticles.splice(iArticle, 1);
        articleEditor(collectionName, data);
      });
    });
  }

  //Add new related
  $("#addArticle").one('click', function () {
    var pageurl = localStorage.getItem('pageurl');
    localStorage.setItem('historicUrl', pageurl);
    var reload = localStorage.getItem("historicUrl");
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="bulletin-uri_' + lastIndexRelated + '" placeholder="Go to the related article and click Get"></textarea>' +
        '  <button class="btn-page-get" id="article-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="article-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');
    $("#article-cancel_" + lastIndexRelated).hide();

    $("#article-get_" + lastIndexRelated).one('click', function () {
      $("#article-cancel_" + lastIndexRelated).show().one('click', function () {
        $("#article-cancel_" + lastIndexRelated).hide();
        $('#' + lastIndexRelated).hide();
        refreshPreview(reload);
        loadPageDataIntoEditor(reload, collectionName);
        localStorage.removeItem('historicUrl');
      });

      var articleurl = $('#iframe')[0].contentWindow.document.location.href;
      var articleurldata = "/data" + articleurl.split("#!")[1];

      $.ajax({
        url: articleurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'article') {
            data.relatedArticles.push({uri: relatedData.uri, title: relatedData.title, summary: relatedData.summary});
            saveRelated(collectionName, reload, data);
          } else {
            alert("This is not an article");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
  });

  function sortableRelated() {
    $("#sortable-related").sortable();
  }
  sortableRelated();

  // Edit external
  // Load and edition
  $(data.externalLinks).each(function(iLink){
    // No edit functionality.

    // Delete
    $("#link-delete_"+iLink).click(function() {
      $("#"+iLink).remove();
      data.externalLinks.splice(iLink, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
    });
  });

  //Add new external
  $("#addLink").click(function () {
    data.externalLinks.push({url:"", linkText:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  function sortableLinks() {
    $("#sortable-external").sortable();
  }
  sortableLinks();

  // Save
  $('.btn-edit-save').click(function () {
    save();
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // complete
  $('.btn-edit-save-and-submit-for-review').click(function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // review
  $('.btn-edit-save-and-submit-for-approval').click(function () {
    postReview(collectionName, getPathName());
  });


  function save() {
    // Sections
    var orderSection = $("#sortable-sections").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = $('#section_markdown_' + nameS).val();
      var title = $('#section__' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tabs").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // Related links
    var orderArticle = $("#sortable-related").sortable('toArray');
    $(orderArticle).each(function (indexB, nameB) {
      var uri = $('#article__' + nameB).val();
      var summary = $('#article_summary_' + nameB).val();
      var name = $('#article_name_' + nameB).val();
      newRelated[indexB]= {uri: uri, name: name, summary: summary};
    });
    data.relatedArticles = newRelated;
    // External links
    var orderLink = $("#sortable-external").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var displayText = $('#link_text_'+nameL).val();
      var link = $('#link__'+nameL).val();
      newLinks[indexL] = {url: link, linkText: displayText};
    });
    data.externalLinks = newLinks;
//    console.log(data);
  }
}

