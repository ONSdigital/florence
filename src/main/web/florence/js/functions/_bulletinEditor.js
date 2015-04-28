function bulletinEditor(collectionName, data) {

  var newSections = [];
  var newTabs = [];
  var newRelated = [];
  var newLinks = [];
  var lastIndexRelated;
  var setActiveTab;
  var getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);


  //console.log(data.sections);

  $("#description-p").remove();
  $("#relArticle").remove();
  $("#relDataset").remove();
  $("#used").remove();
  $("#download").remove();
  $("#note").remove();

  // Metadata load, edition and saving
  $("#title").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.title = $(this).val();
  });
  $("#nextRelease").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.nextRelease = $(this).val();
  });
  $("#contactName").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.name = $(this).val();
  });
  $("#contactEmail").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.email = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.summary = $(this).val();
  });
  $("#headline1").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline1 = $(this).val();
  });
  $("#headline2").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline2 = $(this).val();
  });
  $("#headline3").on('click keyup', function () {
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
  $(data.sections).each(function(index, section) {

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

  //Add new section
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

  // Related bulletin
  // Load
  if (data.relatedBulletins.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedBulletins).each(function (iBulletin) {
      lastIndexRelated = iBulletin + 1;

      // Delete
      $("#bulletin-delete_"+iBulletin).click(function () {
        $("#" + iBulletin).remove();
        data.relatedBulletins.splice(iBulletin, 1);
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related
  $("#addBulletin").one('click', function () {
    var pageurl = localStorage.getItem('pageurl');
    localStorage.setItem('historicUrl', pageurl);
    var reload = localStorage.getItem("historicUrl");

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="bulletin-uri_' + lastIndexRelated + '" placeholder="Go to the related bulletin and click Get"></textarea>' +
        '  <button class="btn-page-get" id="bulletin-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="bulletin-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');
    $("#bulletin-cancel_" + lastIndexRelated).hide();

    $("#bulletin-get_" + lastIndexRelated).one('click', function () {
      $("#bulletin-cancel_" + lastIndexRelated).show().one('click', function () {
        $("#bulletin-cancel_" + lastIndexRelated).hide();
        $('#' + lastIndexRelated).hide();
        $('#iframe')[0].contentWindow.document.location.href = localStorage.getItem("historicUrl");
      });

      var bulletinurl = $('#iframe')[0].contentWindow.document.location.href;
      var bulletinurldata = "/data" + bulletinurl.split("#!")[1];
      $.ajax({
        url: bulletinurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'bulletin') {
            data.relatedBulletins.push({uri: relatedData.uri, title: relatedData.title, summary: relatedData.summary});
            updateContent(collectionName, reload, JSON.stringify(data));
            localStorage.removeItem('historicUrl');
          } else {
            alert("This is not a bulletin");
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
    var orderSection = $("#sortable-sections").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
        var markdown = $('#section-markdown_' + nameS).val();
        var title = $('#section-title_' + nameS).val();
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
    data.accordion = newTabs;
    // Related links
    var orderBulletin = $(".fl-editor__related").sortable('toArray');
    $(orderBulletin).each(function (indexB, nameB) {
      var uri = $('#bulletin__' + nameB).val();
      var summary = $('#bulletin_summary_' + nameB).val();
      var name = $('#bulletin_name_' + nameB).val();
      newRelated[indexB] = {uri: uri, name: name, summary: summary};
    });
    data.relatedBulletins = newRelated;
    // External links
    var orderLink = $(".fl-editor__external").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var displayText = $('#link_text_'+nameL).val();
      var link = $('#link_url_'+nameL).val();
      newLinks[indexL] = {url: link, linkText: displayText};
    });
    data.externalLinks = newLinks;
  }
}

