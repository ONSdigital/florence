function bulletinEditor(collectionId, data) {

//  var index = data.release;
  var newSections = [], newTabs = [], newRelated = [], newLinks = [];
  var lastIndexRelated;
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);


  //console.log(data.sections);

  $("#relArticle").remove();
  $("#relDataset").remove();
  $("#used").remove();
  $("#download").remove();
  $("#note").remove();
  $("#metadata-a").remove();
  $("#metadata-d").remove();
  $("#metadata-m").remove();
  $("#abstract-p").remove();
  $("#migrated").remove();

  // Metadata load, edition and saving
  $("#title").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  if (!data.description.releaseDate){
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
    $('#releaseDate').on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
    });
  } else {
      dateTmp = $('#releaseDate').val();
      a = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(a);
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//    $('.release-date').hide();
  }
  $("#nextRelease").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
  });
  $("#contactName").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
  });
  $("#contactEmail").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
  });
  $("#contactTelephone").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#headline1").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.headline1 = $(this).val();
  });
  $("#headline2").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.headline2 = $(this).val();
  });
  $("#headline3").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.headline3 = $(this).val();
  });
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.keywords = $(this).val();
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    }
    return true;
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
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
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  // Edit sections
  // Load and edition
  $(data.sections).each(function(index, section) {

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = {
        "title": $('#section-title_' + index).val(),
        "markdown": $("#section-markdown_" + index).val()
      };

      var saveContent = function(updatedContent) {
        data.sections[index].markdown = updatedContent;
        data.sections[index].title = $('#section-title_' + index).val();
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#section-delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new section
  $("#addSection").one('click', function () {
    data.sections.push({title:"", markdown:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableSections() {
    $("#sortable-sections").sortable();
  }
  sortableSections();

  // Edit accordion
  // Load and edition
  $(data.accordion).each(function(index, tab) {

    $("#tab-edit_"+index).click(function() {
      var editedSectionValue = {
        "title": $('#tab-title_' + index).val(),
        "markdown": $("#tab-markdown_" + index).val()
      };

      var saveContent = function(updatedContent) {
        data.accordion[index].markdown = updatedContent;
        data.accordion[index].title = $('#tab-title_' + index).val();
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#tab-delete_"+index).click(function() {
      $("#"+index).remove();
      data.accordion.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new tab
  $("#addTab").one('click', function () {
    data.accordion.push({title:"", markdown:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
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
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related bulletins
  $("#addBulletin").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="bulletin-uri_' + lastIndexRelated + '" placeholder="Go to the related bulletin and click Get"></textarea>' +
        '  <button class="btn-page-get" id="bulletin-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="bulletin-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#bulletin-get_" + lastIndexRelated).one('click', function () {
      var pastedUrl = $('#bulletin-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var bulletinUrlData = myUrl.pathname + "/data";
      } else {
        var bulletinUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var bulletinUrlData = bulletinUrl + "/data";
      }

      $.ajax({
        url: bulletinUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'bulletin') {
            data.relatedBulletins.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a bulletin");
          }
        },
//        error: function () {
//          console.log('No page data returned');
                      // Hack to work with 404 Error
                      error: function (relatedData) {
                        if (relatedData.responseJSON.type === 'bulletin') {
                          data.relatedBulletins.push({uri: relatedData.responseJSON.uri});
                          saveRelated(collectionId, pageUrl, data);
                        } else {
                          alert("This is not a bulletin");
                        }
                        // End of hack
        }
      });
    });

    $("#bulletin-cancel_" + lastIndexRelated).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelated() {
    $("#sortable-related").sortable();
  }
  sortableRelated();

  //Add new related data
  $("#addData").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-related-data').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="data-uri_' + lastIndexRelated + '" placeholder="Go to the related data and click Get"></textarea>' +
        '  <button class="btn-page-get" id="data-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="data-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#data-get_" + lastIndexRelated).one('click', function () {
      var pastedUrl = $('#data-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var dataUrlData = myUrl.pathname + "/data";
      } else {
        var dataUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var dataUrlData = dataUrl + "/data";
      }

      $.ajax({
        url: dataUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'timeseries') {                //TO BE CHANGED
            data.relatedData.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a data document");
          }
        },
//        error: function () {
//          console.log('No page data returned');
                // Hack to work with 404 Error
                error: function (relatedData) {
                  if (relatedData.responseJSON.type === 'timeseries') {
                    data.relatedData.push({uri: relatedData.responseJSON.uri});
                    saveRelated(collectionId, pageUrl, data);
                  } else {
                    alert("This is not a data document");
                  }
                  // End of hack
        }
      });
    });

    $("#data-cancel_" + lastIndexRelated).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedData() {
    $("#sortable-related-data").sortable();
  }
  sortableRelatedData();

  // Edit external
  // Load and edition
  $(data.externalLinks).each(function(iLink){
    // No edit functionality.

    // Delete
    $("#link-delete_"+iLink).click(function() {
      $("#"+iLink).remove();
      data.externalLinks.splice(iLink, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new external
  $("#addLink").click(function () {
    data.externalLinks.push({url:"", linkText:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableLinks() {
    $("#sortable-external").sortable();
  }
  sortableLinks();

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  // completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      //pageData = $('.fl-editor__headline').val();
      save();
      saveAndCompleteContent(collectionId, getPathName(), JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      save()
      saveAndReviewContent(collectionId, getPathName(), JSON.stringify(data));
    });

  function save() {
    // Sections
    var orderSection = $("#sortable-sections").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
//      var markdown = $('#section-markdown_' + nameS).val();
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
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
    // Related bulletins
    var orderBulletin = $("#sortable-related").sortable('toArray');
    $(orderBulletin).each(function (indexB, nameB) {
      var uri = $('#bulletin-uri_' + nameB).val();
      newRelated[indexB] = {uri: uri};
    });
    data.relatedBulletins = newRelated;
    // External links
    var orderLink = $("#sortable-external").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var displayText = $('#link-title_'+nameL).val();
      var link = $('#link-url_'+nameL).val();
      newLinks[indexL] = {url: link, linkText: displayText};
    });
    data.externalLinks = newLinks;
//    console.log(data);
  }
}

