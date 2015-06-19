function timeseriesEditor(collectionId, data) {

  var newRelated = [], newLinks = [];
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

  // Metadata edition and saving
  $("#title").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
//  $("#edition").on('click keyup', function () {
//    $(this).textareaAutoSize();
//    data.description.edition = $(this).val();
//  });
//  if (!data.description.releaseDate){
//    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//    $('#releaseDate').on('change', function () {
//      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
//    });
//  } else {
//    dateTmp = $('#releaseDate').val();
//    a = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
//    $('#releaseDate').val(a);
//    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
////    $('.release-date').hide();
//  }
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
  $("#number").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.number = $(this).val();
  });
  $("#keyNote").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.keyNote = $(this).val();
  });
  $("#unit").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.unit = $(this).val();
  });
  $("#preUnit").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.preUnit = $(this).val();
  });
  $("#source").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.source = $(this).val();
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
    if(data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
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
  $(data.sections).each(function(index, section){

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = $("#section-markdown_" + index).val();

      var saveContent = function(updatedContent) {
        data.section[index].markdown = updatedContent;
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#section-delete_"+index).click(function() {
      $("#"+index).remove();
      data.section.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new sections
  $("#addSection").one('click', function () {
    data.section.push({markdown:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableSections() {
    $("#sortable-sections").sortable();
  }
  sortableSections();

  // Edit notes
  // Load and edition
  $(data.notes).each(function(index, note) {

    $("#note-edit_"+index).click(function() {
      var editedSectionValue = $("#note-markdown_" + index).val();

      var saveContent = function(updatedContent) {
        data.notes[index].markdown = updatedContent;
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
    $("#note-delete_"+index).click(function() {
      $("#"+index).remove();
      data.notes.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new note
  $("#addNote").one('click', function () {
    data.notes.push({markdown:""});
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableNotes() {
    $("#sortable-notes").sortable();
  }
  sortableNotes();

  // Related documents
  // Load
  if (data.relatedDocuments.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedDocuments).each(function (iArticle, document) {
      lastIndexRelated = iArticle + 1;

      // Delete
      $("" + iArticle).click(function () {
        $("#" + iArticle).remove();
        data.relatedDocuments.splice(iArticle, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related documents
  $("#addArticle").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="document-uri_' + lastIndexRelated + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="document-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="document-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#document-get_" + lastIndexRelated).one('click', function () {
      var pastedUrl = $('#document-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var documentUrlData = myUrl.pathname + "/data";
      } else {
        var documentUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var documentUrlData = documentUrl + "/data";
      }

      $.ajax({
        url: documentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'article' || relatedData.type === 'bulletin') {
            data.relatedDocuments.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not an article or bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#document-cancel_" + lastIndexRelated).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableDocument() {
    $("#sortable-document").sortable();
  }
  sortableDocument();

  //Add new related timeseries
  $("#addTimeseries").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-timeseries').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="timeseries-uri_' + lastIndexRelated + '" placeholder="Go to the related timeseries and click Get"></textarea>' +
        '  <button class="btn-page-get" id="timeseries-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="timeseries-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#timeseries-get_" + lastIndexRelated).one('click', function () {
      var pastedUrl = $('#timeseries-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var timeseriesUrlData = myUrl.pathname + "/data";
      } else {
        var timeseriesUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var timeseriesUrlData = timeseriesUrl + "/data";
      }

      $.ajax({
        url: timeseriesUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'timeseries') {
            data.relatedData.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a timeseries");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#timeseries-cancel_" + lastIndexRelated).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedTimeseries() {
    $("#sortable-timeseries").sortable();
  }
  sortableRelatedTimeseries();

  //Add new related datasets
  $("#addDataset").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-related').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="dataset-uri_' + lastIndexRelated + '" placeholder="Go to the related dataset and click Get"></textarea>' +
        '  <button class="btn-page-get" id="dataset-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="dataset-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#dataset-get_" + lastIndexRelated).one('click', function () {
      pastedUrl = $('#bulletin-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var datasetUrlData = myUrl.pathname + "/data";
      } else {
        var datasetUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var datasetUrlData = datasetUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: datasetUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            data.relatedDatasets.push({uri: relatedData.uri, title: relatedData.title, summary: relatedData.summary});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a dataset");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#dataset-cancel_" + lastIndexRelated).show().one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelated() {
    $("#sortable-related").sortable();
  }
  sortableRelated();


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
      var markdown = $('#section-markdown_' + nameS).val();
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.section = newSections;
    // Notes
    var orderNote = $("#sortable-notes").sortable('toArray');
    $(orderNote).each(function (indexN, nameN) {
      var markdown = data.notes[parseInt(nameN)].markdown;
      var title = $('#tab-title_' + nameN).val();
      newNotes[indexN] = {title: title, markdown: markdown};
    });
    data.notes = newNotes;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = $('#document-uri_' + nameD).val();
      newDocument[indexD]= {uri: uri};
    });
    data.relatedDocuments = newDocument;
    // Related timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, nameT) {
      var uri = $('#timeseries-uri_' + nameT).val();
      newTimeseries[indexT]= {uri: uri};
    });
    data.relatedTimeseries = newTimeseries;
    // Related datasets
    var orderDataset = $("#sortable-related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset-uri_' + nameD).val();
      newRelated[indexD]= {uri: uri};
    });
    data.relatedDatasets = newRelated;
  }
}

