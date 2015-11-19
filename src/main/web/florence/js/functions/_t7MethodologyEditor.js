function methodologyEditor(collectionId, data) {

  var newSections = [], newTabs = [], newChart = [], newTable = [], newImage = [], newDocuments = [], newDatasets = [];
  var setActiveTab, getActiveTab;
  var renameUri = false;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    renameUri = true;
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  //if (!Florence.collection.date) {                        //overwrite scheduled collection date
  if (!data.description.releaseDate) {
    $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  } else {
    //dateTmp = $('#releaseDate').val();
    dateTmp = data.description.releaseDate;
    var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
    $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
      data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        autoSaveMetadata(collectionId, data);
      }, 3000);
    });
  }
  //} else {
  //    $('.release-date').hide();
  //}
  if (!data.description.contact) {
    data.description.contact = {};
  }
  $("#contactName").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.name = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactEmail").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.email = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#contactTelephone").on('input', function () {
    $(this).textareaAutoSize();
    data.description.contact.telephone = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      autoSaveMetadata(collectionId, data);
    }, 3000);
  });

  $('#add-chart').click(function () {
    loadChartBuilder(data, function () {
      refreshPreview();

      putContent(collectionId, data.uri, JSON.stringify(data),
        success = function () {
          Florence.Editor.isDirty = false;
          refreshPreview();
          refreshChartList(collectionId, data);
        },
        error = function (response) {
          handleApiError(response);
        }
      );
    });
  });

  $('#add-table').click(function () {
    loadTableBuilder(data, function () {
      Florence.Editor.isDirty = false;
      refreshPreview();
      refreshTablesList(collectionId, data);
    });
  });

  $('#add-image').click(function () {
    loadImageBuilder(data, function () {
      Florence.Editor.isDirty = false;
      //refreshPreview();
      refreshImagesList(collectionId, data);
    });
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save(updateContent);
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    save(saveAndCompleteContent);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save(saveAndReviewContent);
  });

  function save(onSave) {
    // Sections
    var orderSection = $("#sortable-section").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
      var markdown = data.sections[parseInt(nameS)].markdown;
      var title = $('#section-title_' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $("#sortable-tab").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab-title_' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    // charts
    var orderChart = $("#sortable-chart").sortable('toArray');
    $(orderChart).each(function (indexCh, nameCh) {
      var uri = data.charts[parseInt(nameCh)].uri;
      var title = data.charts[parseInt(nameCh)].title;
      var filename = data.charts[parseInt(nameCh)].filename;
      var safeUri = checkPathSlashes(uri);
      newChart[indexCh] = {uri: safeUri, title: title, filename: filename};
    });
    data.charts = newChart;
    // tables
    var orderTable = $("#sortable-table").sortable('toArray');
    $(orderTable).each(function (indexTable, nameTable) {
      var uri = data.tables[parseInt(nameTable)].uri;
      var title = data.tables[parseInt(nameTable)].title;
      var filename = data.tables[parseInt(nameTable)].filename;
      var safeUri = checkPathSlashes(uri);
      newTable[indexTable] = {uri: safeUri, title: title, filename: filename};
    });
    data.tables = newTable;
    // images
    var orderImage = $("#sortable-image").sortable('toArray');
    $(orderImage).each(function (indexImage, nameImage) {
      var uri = data.images[parseInt(nameImage)].uri;
      var title = data.images[parseInt(nameImage)].title;
      var filename = data.images[parseInt(nameImage)].filename;
      var safeUri = checkPathSlashes(uri);
      newImage[indexImage] = {uri: safeUri, title: title, filename: filename};
    });
    data.images = newImage;
    // Related documents
    var orderDocument = $("#sortable-document").sortable('toArray');
    $(orderDocument).each(function (indexD, nameD) {
      var uri = data.relatedDocuments[parseInt(nameD)].uri;
      var safeUri = checkPathSlashes(uri);
      newDocuments[indexD] = {uri: safeUri};
    });
    data.relatedDocuments = newDocuments;
    // Related dataset
    var orderDataset = $("#sortable-dataset").sortable('toArray');
    $(orderDataset).each(function (indexData, nameData) {
      var uri = data.relatedDatasets[parseInt(nameData)].uri;
      var safeUri = checkPathSlashes(uri);
      newDatasets[indexData] = {uri: safeUri};
    });
    data.relatedDatasets = newDatasets;

    checkRenameUri(collectionId, data, renameUri, onSave);
  }
}

