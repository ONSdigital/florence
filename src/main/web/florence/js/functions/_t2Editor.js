function t2Editor(collectionId, data) {

  var setActiveTab, getActiveTab;
  var timeoutId;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
    autoSaveMetadata(timeoutId, collectionId, data);
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
    autoSaveMetadata(timeoutId, collectionId, data);
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
                        singleField: true,
                        allowSpaces: true,
                        singleFieldNode: $('#keywords')
  });
  $('#keywords').on('change', function () {
    data.description.keywords = $('#keywords').val().split(', ');
    autoSaveMetadata(timeoutId, collectionId, data);
  });
  $("#metaDescription").on('input', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
    autoSaveMetadata(timeoutId, collectionId, data);
  });

  // Save
  var editNav = $('.edit-nav');
  editNav.off(); // remove any existing event handlers.

  editNav.on('click', '.btn-edit-save', function () {
    updateContent(collectionId, data.uri, JSON.stringify(data));
  });

  // completed to review
  editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
    //pageData = $('.fl-editor__headline').val();
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
  });
}

