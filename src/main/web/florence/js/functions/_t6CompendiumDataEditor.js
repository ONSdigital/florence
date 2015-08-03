function compendiumDataEditor(collectionId, data) {

  var newFiles = [], newRelatedDocuments = [], newRelatedData = [], newRelatedMethodology = [];
  var parentUrl = data.parent.uri;
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if(setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition ();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  if (!Florence.collection.date) {
    if (!data.description.releaseDate){
      $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
        data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      });
    } else {
      dateTmp = data.description.releaseDate;
      var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
      $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
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
  $("#datasetId").on('input', function () {
    $(this).textareaAutoSize();
    data.description.datasetId = $(this).val();
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
                        singleField: true,
                        allowSpaces: true,
                        singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(', ');
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
      updateContent(collectionId, data.uri, JSON.stringify(data));
    });
  });

  // New correction
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '#save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  editNav.on('click', '#save-and-exit', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data), parentUrl);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

  function save() {
    // Files are uploaded. Save metadata
    var orderFile = $("#sortable-file").sortable('toArray');
    $(orderFile).each(function(indexF, nameF){
      var title = $('#file-title_'+nameF).val();
      var fileDescription = $("#file-summary_"+nameF).val();
      var file = $('#file-filename_' + nameF).val();
      newFiles[indexF] = {title: title, fileDescription: fileDescription, file: file};
    });
    data.downloads = newFiles;
    // Related documents
    var orderRelatedDocument = $("#sortable-document").sortable('toArray');
    $(orderRelatedDocument).each(function(indexD, nameD){
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes (uri);
      newRelatedDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newRelatedDocuments;
    // Related datasets
    var orderRelatedDataset = $("#sortable-dataset").sortable('toArray');
    $(orderRelatedDataset).each(function(indexDt, nameDt){
      var uri = data.relatedDatasets[parseInt(nameDt)].uri;
      var safeUri = checkPathSlashes (uri);
      newRelatedData[indexDt] = {uri: safeUri};
    });
    data.relatedDatasets = newRelatedData;
    // Related methodology
    var orderRelatedMethodology = $("#sortable-methodology").sortable('toArray');
    $(orderRelatedMethodology).each(function(indexM, nameM){
      var uri = data.relatedMethodology[parseInt(nameM)].uri;
      var safeUri = checkPathSlashes (uri);
      newRelatedMethodology[indexM] = {uri: safeUri};
    });
    data.relatedMethodology = newRelatedMethodology;
  }
}

