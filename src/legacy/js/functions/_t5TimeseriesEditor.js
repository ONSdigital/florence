function timeseriesEditor(collectionId, data) {

  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function (event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

  // Metadata edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
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
  $("#keywordsTag").tagit({
    availableTags: data.description.keywords,
    singleField: true,
    allowSpaces: true,
    singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(',');
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
    } else {
      return true;
    }
  };

  $("#metadata-list #natStat input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.description.nationalStatistic = $("#metadata-list #natStat input[type='checkbox']").prop('checked') ? true : false;
  });

  var isIndexStatus = function () {
    if (data.description.isIndex === true) {
      return true;
    } else {
      return false;
    }
  };

  $("#metadata-list #isIndex input[type='checkbox']").prop('checked', isIndexStatus).click(function () {
    data.description.isIndex = $("#metadata-list #isIndex input[type='checkbox']").prop('checked') ? true : false;
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    if (Florence.globalVars.welsh) {
      sweetAlert('You cannot perform this operation in Welsh.');
    } else {
      Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();
      updateContent(collectionId, data.uri, JSON.stringify(data));
    }
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    if (Florence.globalVars.welsh) {
      sweetAlert('You cannot perform this operation in Welsh.');
    } else {
      Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();
      saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
    }
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    Florence.globalVars.pagePos = $(".workspace-edit").scrollTop();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });

}

