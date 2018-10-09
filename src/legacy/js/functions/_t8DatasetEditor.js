function datasetEditor(collectionId, data) {
  var newFiles = [];
  var setActiveTab, getActiveTab;
  var parentUrl = getParentPage(data.uri);

  //Add parent link onto page
  loadParentLink(collectionId, data, parentUrl);


  $(".edit-accordion").on('accordionactivate', function () {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      Florence.globalVars.activeTab = setActiveTab;
    }
  });

  getActiveTab = Florence.globalVars.activeTab;
  accordion(getActiveTab);
  getLastPosition();

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
    saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
  });

  // reviewed to approve
  editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
    save();
    saveAndReviewContent(collectionId, data.uri, JSON.stringify(data), false, parentUrl);
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