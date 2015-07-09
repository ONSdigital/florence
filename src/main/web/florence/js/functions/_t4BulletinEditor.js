function bulletinEditor(collectionId, data) {

//  var index = data.release;
  var newSections = [], newTabs = [], newBulletin = [], newRelated = [], newLinks = [];
  var lastIndexBulletin, lastIndexData;
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#edition").on('input', function () {
    $(this).textareaAutoSize();
    data.description.edition = $(this).val();
  });
  if (!Florence.collection.date) {
    if (!data.description.releaseDate){
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = $('#releaseDate').val();
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(dateTmpFormatted);
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
      $('#releaseDate').on('change', function () {
        data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      });
    }
  } else {
      $('.release-date').hide();
  }
  $("#nextRelease").on('input', function () {
    $(this).textareaAutoSize();
    data.description.nextRelease = $(this).val();
  });
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#headline1").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline1 = $(this).val();
  });
  $("#headline2").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline2 = $(this).val();
  });
  $("#headline3").on('input', function () {
    $(this).textareaAutoSize();
    data.description.headline3 = $(this).val();
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
                        availableTags: data.description.keywords,
                        singleField: true,
                        singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = [$('#keywords').val()];
  });
  $("#metaDescription").on('input', function () {
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

    $("#correction_text_" + index).on('input', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('input', function () {
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
  if (!data.relatedBulletins || data.relatedBulletins.length === 0) {
    lastIndexBulletin = 0;
  } else {
    $(data.relatedBulletins).each(function (iBulletin, bulletin) {
      lastIndexBulletin = iBulletin + 1;

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

    $('#sortable-bulletin').append(
        '<div id="' + lastIndexBulletin + '" class="edit-section__sortable-item">' +
        '  <textarea id="bulletin-uri_' + lastIndexBulletin + '" placeholder="Go to the related bulletin and click Get"></textarea>' +
        '  <button class="btn-page-get" id="bulletin-get_' + lastIndexBulletin + '">Get</button>' +
        '  <button class="btn-page-cancel" id="bulletin-cancel_' + lastIndexBulletin + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#bulletin-get_" + lastIndexBulletin).one('click', function () {
      var pastedUrl = $('#bulletin-uri_'+lastIndexBulletin).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var bulletinUrlData = myUrl.pathname + "/data";
      } else {
        var bulletinUrl = getPathNameTrimLast();
        var bulletinUrlData = bulletinUrl + "/data";
      }

      $.ajax({
        url: bulletinUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'bulletin') {
            if (!data.relatedBulletins) {
              data.relatedBulletins = [];
            }
            data.relatedBulletins.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#bulletin-cancel_" + lastIndexBulletin).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelated() {
    $("#sortable-bulletin").sortable();
  }
  sortableRelated();

  // Related Dataset
  // Load
  if (!data.relatedData || data.relatedData.length === 0) {
    lastIndexData = 0;
  } else {
    $(data.relatedData).each(function (iData, data) {
      lastIndexData = iData + 1;

      // Delete
      $("#data-delete_" + iData).click(function () {
        $("#" + iData).remove();
        data.relatedData.splice(iData, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related data
  $("#addData").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-related-data').append(
        '<div id="' + lastIndexData + '" class="edit-section__sortable-item">' +
        '  <textarea id="data-uri_' + lastIndexData + '" placeholder="Go to the related data and click Get"></textarea>' +
        '  <button class="btn-page-get" id="data-get_' + lastIndexData + '">Get</button>' +
        '  <button class="btn-page-cancel" id="data-cancel_' + lastIndexData + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#data-get_" + lastIndexData).one('click', function () {
      var pastedUrl = $('#data-uri_'+lastIndexData).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var dataUrlData = myUrl.pathname + "/data";
      } else {
        var dataUrl = getPathNameTrimLast();
        var dataUrlData = dataUrl + "/data";
      }

      $.ajax({
        url: dataUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'timeseries' || relatedData.type === 'dataset' || relatedData.type === 'reference_tables') {
            if (!data.relatedData) {
              data.relatedData = [];
            }
            data.relatedData.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a data document");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#data-cancel_" + lastIndexData).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedData() {
    $("#sortable-related-data").sortable();
  }
  sortableRelatedData();

  // Edit links
  // Load and edition
  $(data.links).each(function(iLink){

    $("#link-edit_"+iLink).click(function() {
      var editedSectionValue = {
        "title": $('#link-uri_' + iLink).val(),
        "markdown": $("#link-markdown_" + iLink).val()
      };

       var saveContent = function(updatedContent) {
         data.links[iLink].title = updatedContent;
         data.links[iLink].uri = $('#link-uri_' + iLink).val();
         updateContent(collectionId, getPathName(), JSON.stringify(data));
       };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#link-delete_"+iLink).click(function() {
      $("#"+iLink).remove();
      data.links.splice(iLink, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new external
  $("#addLink").click(function () {
    data.links.push({uri:"", title:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableLinks() {
    $("#sortable-links").sortable();
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
    var orderBulletin = $("#sortable-bulletin").sortable('toArray');
    $(orderBulletin).each(function (indexB, nameB) {
      var uri = $('#bulletin-uri_' + nameB).val();
      newBulletin[indexB] = {uri: uri};
    });
    data.relatedBulletins = newRelated;
    // Related data
    var orderData = $("#sortable-related-data").sortable('toArray');
    $(orderData).each(function (indexD, nameD) {
      var uri = $('#data-uri_' + nameD).val();
      newRelated[indexD] = {uri: uri};
    });
    data.relatedData = newRelated;
    // External links
    var orderLink = $("#sortable-links").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var displayText = $('#link-markdown_'+nameL).val();
      var link = $('#link-uri_'+nameL).val();
      newLinks[indexL] = {uri: link, title: displayText};
    });
    data.links = newLinks;
  }
}

