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


  //console.log(data.sections);


  // Metadata load, edition and saving
  $("#title").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.title = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.summary = $(this).val();
  });
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.keywords = $(this).val();
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });

  function sortableTimeseries() {
    $("#sortable-timeseries").sortable();
  }
  sortableTimeseries();

  function sortableBulletins() {
      $("#sortable-bulletins").sortable();
  }
  sortableBulletins();

  function sortableArticles() {
    $("#sortable-articles").sortable();
  }
  sortableArticles();

  function sortableDatasets() {
    $("#sortable-datasets").sortable();
  }
  sortableDatasets();


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
    // Timeseries
    var orderTimeseries = $("#sortable-timeseries").sortable('toArray');
    $(orderTimeseries).each(function (indexT, titleT) {
      var uri = data.items[parseInt(titleT)].data.uri;
      newTimeseries[indexT] = {uri: uri};
    });
    data.items = newTimeseries;
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, titleB) {
      var uri = data.statsBulletins[parseInt(titleB)].uri;
//      var summary = data.statsBulletins[parseInt(titleB)].description.summary;
//      var title = data.statsBulletins[parseInt(titleB)].description.title;
//      var headline1 = data.statsBulletins[parseInt(titleB)].description.headline1;
//      var headline2 = data.statsBulletins[parseInt(titleB)].description.headline2;
//      var headline3 = data.statsBulletins[parseInt(titleB)].description.headline3;
      newBulletins[indexB] = {uri: uri};        // , title: title, summary: summary, headline1: headline1, headline2: headline2, headline3: headline3};
    });
    data.statsBulletins = newBulletins;
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, titleA) {
      var uri = data.articles[parseInt(titleA)].uri;
//      var abstract = data.articles[parseInt(titleA)].description._abstract;
//      var title = data.articles[parseInt(titleA)].description.title;
      newArticles[indexA] = {uri: uri};      //, title: title, abstract: _abstract};
    });
    data.articles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, titleD) {
      var uri = data.datasets[parseInt(titleD)].uri;
//      var summary = data.datasets[parseInt(titleD)].description.summary;
//      var title = data.datasets[parseInt(titleD)].description.title;
      newDatasets[indexD] = {uri: uri}        //, title: title, summary: summary};
    });
    data.datasets = newDatasets;
  }
}

