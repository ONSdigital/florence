function t3Editor(collectionId, data) {

  var newTimeseries = [], newBulletins = [], newArticles = [], newDatasets = [];
  var setActiveTab, getActiveTab;

  $(".edit-accordion").on('accordionactivate', function(event, ui) {
    setActiveTab = $(".edit-accordion").accordion("option", "active");
    if (setActiveTab !== false) {
      localStorage.setItem('activeTab', setActiveTab);
    }
  });

  getActiveTab = localStorage.getItem('activeTab');
  accordion(getActiveTab);
  getLastPosition ();

  // Metadata load, edition and saving
  $("#title").on('input', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('input', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#keywordsTag").tagit({availableTags: data.description.keywords,
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

  editRelated (collectionId, data, 'items', 'timeseries');

  editRelated (collectionId, data, 'statsBulletins', 'bulletins');

  editRelated (collectionId, data, 'relatedArticles', 'articles');

  editRelated (collectionId, data, 'datasets', 'datasets');


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
    // Timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, titleT) {
      var uri = data.items[parseInt(titleT)].uri;
      uriChecked = checkPathParsed(uri);
      newTimeseries[indexT] = {uri: uriChecked};
    });
    data.items = newTimeseries;
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, titleB) {
      var uri = data.statsBulletins[parseInt(titleB)].uri;
      uriChecked = checkPathParsed(uri);
      newBulletins[indexB] = {uri: uriChecked};
    });
    data.statsBulletins = newBulletins;
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, titleA) {
      var uri = data.relatedArticles[parseInt(titleA)].uri;
      uriChecked = checkPathParsed(uri);
      newArticles[indexA] = {uri: uriChecked};
    });
    data.relatedArticles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, titleD) {
      var uri = data.datasets[parseInt(titleD)].uri;
      uriChecked = checkPathParsed(uri);
      newDatasets[indexD] = {uri: uriChecked};
    });
    data.datasets = newDatasets;
  }
}

