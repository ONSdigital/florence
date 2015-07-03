function timeseriesEditor(collectionId, data) {

  var newSections = [], newNotes = [], newDocument = [], newRelated = [], newTimeseries = [], newRelatedMethodology = [];
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
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
//  $("#edition").on('input', function () {
//    $(this).textareaAutoSize();
//    data.description.edition = $(this).val();
//  });
//  if (!Florence.collection.date) {
//    if (!data.description.releaseDate){
//      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//      $('#releaseDate').on('change', function () {
//        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
//      });
//    } else {
//      dateTmp = $('#releaseDate').val();
//      a = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
//      $('#releaseDate').val(a);
//      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
//      $('#releaseDate').on('change', function () {
//        data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
//      });
//    }
//  } else {
//      $('.release-date').hide();
//  }
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
  $("#number").on('input', function () {
    $(this).textareaAutoSize();
    data.description.number = $(this).val();
  });
  $("#keyNote").on('input', function () {
    $(this).textareaAutoSize();
    data.description.keyNote = $(this).val();
  });
  $("#unit").on('input', function () {
    $(this).textareaAutoSize();
    data.description.unit = $(this).val();
  });
  $("#preUnit").on('input', function () {
    $(this).textareaAutoSize();
    data.description.preUnit = $(this).val();
  });
  $("#source").on('input', function () {
    $(this).textareaAutoSize();
    data.description.source = $(this).val();
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
  $(data.section).each(function(index, section){

    $("#section-edit_"+index).click(function() {
      var editedSectionValue = $("#section-markdown_" + index).val();

      var saveContent = function(updatedContent) {
//        data.section[index].markdown = updatedContent;      //section[].markdown (not implemented yet)
        data.section.markdown = updatedContent;
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      };

      loadMarkdownEditor(editedSectionValue, saveContent, data);
    });

    // Delete
//    $("#section-delete_"+index).click(function() {
//      $("#"+index).remove();
//      data.section.splice(index, 1);
//      updateContent(collectionId, getPathName(), JSON.stringify(data));
//    });
    $("#section-delete_"+index).click(function() {
      $("#"+index).remove();
      data.section = {};
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new sections
//  $("#addSection").one('click', function () {
//    data.section.push({markdown:""});
//    updateContent(collectionId, getPathName(), JSON.stringify(data));
//  });
  if (!data.section) {
    $("#addSection").one('click', function () {
      data.section = {markdown:""};
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  } else {
    $("#addSection").one('click', function () {
      alert('At the moment you can have one section here.')
    });
  }


//  function sortableSections() {               //Only one at the moment
//    $("#sortable-sections").sortable();
//  }
//  sortableSections();

  // Edit notes
  // Load and edition
  $(data.notes).each(function(index, note) {

    $("#note-edit_"+index).click(function() {
      var editedSectionValue = $("#note-markdown_" + index).val();

//      var saveContent = function(updatedContent) {              //notes[].markdown (not implemented yet)
//        data.notes[index].markdown = updatedContent;
//        updateContent(collectionId, getPathName(), JSON.stringify(data));
//      };
      var saveContent = function(updatedContent) {
        data.notes[index] = updatedContent;
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
//  $("#addNote").one('click', function () {
//    data.notes.push({markdown:""});
//    updateContent(collectionId, getPathName(), JSON.stringify(data));
//  });
  $("#addNote").one('click', function () {
    data.notes.push("");
    updateContent(collectionId, getPathName(), JSON.stringify(data));
  });

  function sortableNotes() {
    $("#sortable-notes").sortable();
  }
  sortableNotes();

  // Related documents
  // Load
  if (!data.relatedDocuments) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedDocuments).each(function (iArticle, document) {
      lastIndexRelated = iArticle + 1;

      // Delete
      $("#document-delete_" + iArticle).click(function () {
        $("#" + iArticle).remove();
        data.relatedDocuments.splice(iArticle, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add new related documents
  $("#addDocument").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-document').append(
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
        var documentUrl = getPathNameTrimLast();
        var documentUrlData = documentUrl + "/data";
      }

      $.ajax({
        url: documentUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'article' || relatedData.type === 'bulletin') {
            if (!data.relatedDocuments) {
              data.relatedDocuments = [];
            }
            data.relatedDocuments.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not an article or a bulletin");
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
        var timeseriesUrl = getPathNameTrimLast();
        var timeseriesUrlData = timeseriesUrl + "/data";
      }

      $.ajax({
        url: timeseriesUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'timeseries') {
            if (!data.relatedData) {
              data.relatedData = [];
            }
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

    $('#sortable-dataset').append(
        '<div id="' + lastIndexRelated + '" class="edit-section__sortable-item">' +
        '  <textarea id="dataset-uri_' + lastIndexRelated + '" placeholder="Go to the related dataset and click Get"></textarea>' +
        '  <button class="btn-page-get" id="dataset-get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="btn-page-cancel" id="dataset-cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#dataset-get_" + lastIndexRelated).one('click', function () {
      pastedUrl = $('#dataset-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var datasetUrlData = myUrl.pathname + "/data";
      } else {
        var datasetUrl = getPathNameTrimLast();
        var datasetUrlData = datasetUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: datasetUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            if (!data.relatedDatasets) {
              data.relatedDatasets = [];
            }
            data.relatedDatasets.push({uri: relatedData.uri});
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

  function sortableRelatedDataset() {
    $("#sortable-dataset").sortable();
  }
  sortableRelatedDataset();

  // Related methodology
  // Load
  if (!data.relatedMethodology) {
    lastIndexRelatedMethodology = 0;
  } else {
    $(data.relatedMethodology).each(function (iMethodology, relatedMethodology) {
      lastIndexRelatedMethodology = iMethodology + 1;

      // Delete
      $("#used-delete_" + iMethodology).click(function () {
        $("#" + iMethodology).remove();
        data.relatedMethodology.splice(iMethodology, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }
  //Add related methodology
  $("#addMethodology").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-methodology').append(
        '<div id="' + lastIndexRelatedMethodology + '" class="edit-section__sortable-item">' +
        '  <textarea id="methodology-uri_' + lastIndexRelatedMethodology + '" placeholder="Go to the related document and click Get"></textarea>' +
        '  <button class="btn-page-get" id="methodology-get_' + lastIndexRelatedMethodology + '">Get</button>' +
        '  <button class="btn-page-cancel" id="methodology-cancel_' + lastIndexRelatedMethodology + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#methodology-get_" + lastIndexRelatedMethodology).one('click', function () {
      pastedUrl = $('#methodology-uri_'+lastIndexRelated).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var relatedMethodologyUrlData = myUrl.pathname + "/data";
      } else {
        var relatedMethodologyUrl = getPathNameTrimLast();
        var relatedMethodologyUrlData = relatedMethodologyUrl + "/data";
      }
      pastedUrl = null;

      $.ajax({
        url: relatedMethodologyUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedMethodologyData) {
          if (relatedMethodologyData.type === 'methodology') {
            if (!data.relatedMethodology) {
              data.relatedMethodology = [];
            }
            data.relatedMethodology.push({uri: relatedMethodologyData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a methodology");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#methodology-cancel_" + lastIndexRelatedMethodology).one('click', function () {
     createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableRelatedMethodology() {
    $("#sortable-methodology").sortable();
  }
  sortableRelatedMethodology();


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
//    var orderSection = $("#sortable-sections").sortable('toArray');
//    $(orderSection).each(function (indexS, nameS) {
//      var markdown = $('#section-markdown_' + nameS).val();
//      newSections[indexS] = {markdown: markdown};
//    });
//    data.section = newSections;
    data.section = {markdown: $('#section-markdown_0').val()};
    // Notes
    var orderNote = $("#sortable-notes").sortable('toArray');
//    $(orderNote).each(function (indexN, nameN) {
//      var markdown = $('#note-markdown_' + nameN).val();
//      newNotes[indexN] = {markdown: markdown};
//    });
    $(orderNote).each(function (indexN, nameN) {
      var markdown = $('#note-markdown_' + nameN).val();
      newNotes[indexN] = markdown;
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
    data.relatedData = newTimeseries;
    // Related datasets
    var orderDataset = $("#sortable-related").sortable('toArray');
    $(orderDataset).each(function (indexD, nameD) {
      var uri = $('#dataset-uri_' + nameD).val();
      newRelated[indexD]= {uri: uri};
    });
    data.relatedDatasets = newRelated;
    // Related methodology
    var orderUsedIn = $("#sortable-methodology").sortable('toArray');
    $(orderUsedIn).each(function(indexM, nameM){
      var uri = $('#methodology-uri_'+nameM).val();
      newRelatedMethodology[parseInt(indexM)] = {uri: uri};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

