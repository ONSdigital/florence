function datasetEditor(collectionId, data) {

  var newFiles = [];
  var setActiveTab, getActiveTab;
  //var timeoutId;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });


  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  resolveVersionCorrectionTitleT8(collectionId, data, 'versions');

  //// Metadata edition and saving
  //$("#edition").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.edition = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#summary").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.summary = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  ////if (!Florence.collection.date) {                  //overwrite scheduled collection date
  //if (!data.description.releaseDate) {
  //  $('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
  //    data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
  //    clearTimeout(timeoutId);
  //    timeoutId = setTimeout(function () {
  //      autoSaveMetadata(collectionId, data);
  //    }, 3000);
  //  });
  //} else {
  //  //dateTmp = $('#releaseDate').val();
  //  dateTmp = data.description.releaseDate;
  //  var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
  //  $('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
  //    data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
  //    clearTimeout(timeoutId);
  //    timeoutId = setTimeout(function () {
  //      autoSaveMetadata(collectionId, data);
  //    }, 3000);
  //  });
  //}
  ////} else {
  ////    $('.release-date').hide();
  ////}
  //$("#nextRelease").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.nextRelease = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //if (!data.description.contact) {
  //  data.description.contact = {};
  //}
  //$("#contactName").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.contact.name = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#contactEmail").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.contact.email = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#contactTelephone").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.contact.telephone = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#datasetId").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.datasetId = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#keywordsTag").tagit({
  //  availableTags: data.description.keywords,
  //  singleField: true,
  //  allowSpaces: true,
  //  singleFieldNode: $('#keywords')
  //});
  //$('#keywords').on('change', function () {
  //  data.description.keywords = $('#keywords').val().split(', ');
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //$("#metaDescription").on('input', function () {
  //  $(this).textareaAutoSize();
  //  data.description.metaDescription = $(this).val();
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});
  //
  ///* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
  // is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  //var checkBoxStatus = function () {
  //  if (data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
  //    return false;
  //  } else {
  //    return true;
  //  }
  //};
  //$("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
  //  data.description.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
  //  clearTimeout(timeoutId);
  //  timeoutId = setTimeout(function () {
  //    autoSaveMetadata(collectionId, data);
  //  }, 3000);
  //});

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    save();
    updateContent(collectionId, data.uri, JSON.stringify(data));
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
    var orderFile = $("#sortable-supplementary-files").sortable('toArray');
    $(orderFile).each(function (indexF, nameF) {
      var title = $('#supplementary-files-title_' + nameF).val();
      var file = data.supplementaryFiles[parseInt(nameF)].file;
      newFiles[indexF] = {title: title, file: file};
    });
    data.supplementaryFiles = newFiles;
    // Notes
    data.section = {markdown: $('#one-markdown').val()};
  }
}

function resolveVersionCorrectionTitleT8(collectionId, data, field) {
  var ajaxRequest = [];
  var templateData = $.extend(true, {}, data);
  $(templateData[field]).each(function (index, path) {
    var dfd = $.Deferred();
    templateData[field][index].label = '';
    var eachUri = versionPlusOne(path.uri);
    getPageData(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].label = response.description.versionLabel;
        dfd.resolve();
      },
      error = function () {
        alert(field + ' address: ' + eachUri + ' is not found.');
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    var dataTemplate = templateData[field];
    var versionsTemplate = [], correctionsTemplate = [];
    _.each(dataTemplate, function (version) {
      if (version.correctionNotice) {
        correctionsTemplate.push(version);
      } else {
        versionsTemplate.push(version);
      }
    });
    initialiseDatasetVersion(collectionId, data, versionsTemplate, 'versions', 'version');
    initialiseDatasetVersion(collectionId, data, correctionsTemplate, 'versions', 'correction');

    // Version/Correction section
    // New version
    $("#add-version").one('click', function () {
      editDatasetVersion(collectionId, data, versionsTemplate, 'versions', 'version');
    });
    // New correction
    $("#add-correction").one('click', function () {
      editDatasetVersion(collectionId, data, correctionsTemplate, 'versions', 'correction');
    });

  });
}

