function timeseriesEditor(collectionId, data) {

  var newSections = [], newNotes = [], newDocument = [], newRelated = [], newTimeseries = [], newRelatedMethodology = [];
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
//      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
//      $('#releaseDate').val(dateTmpFormatted);
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
  if (!data.section || data.section === 0) {
    $("#add-section").one('click', function () {
      data.section = {markdown:""};
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  } else {
    $("#add-section").one('click', function () {
      alert('At the moment you can have one section here.')
    });
  }


//  function sortableSections() {               //Only one at the moment
//    $("#sortable-sections").sortable();
//  }
//  sortableSections();

  editMarkdownWithNoTitle (collectionId, data, 'notes', 'note');

  editRelated (collectionId, data, 'relatedDocuments', 'document');

  editRelated (collectionId, data, 'relatedData', 'timeseries');

  editRelated (collectionId, data, 'relatedDatasets', 'data');

  editRelated (collectionId, data, 'relatedMethodology', 'methodology');

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
    var orderNote = $("#sortable-note").sortable('toArray');
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

