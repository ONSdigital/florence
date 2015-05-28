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
  $("#name").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.name = $(this).val();
  });
  $("#summary").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.lede = $(this).val();
  });
  $("#keywords").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.keywords = $(this).val();
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.metaDescription = $(this).val();
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
    $(orderTimeseries).each(function (indexT, nameT) {
      var uri = data.items[parseInt(nameT)].uri;
      var name = data.items[parseInt(nameT)].name;
      newTimeseries[indexT] = {name: name, uri: uri};
    });
    data.items = newTimeseries;
    console.log(data.items)
    data.headline = newTimeseries[0];
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, nameB) {
      var uri = data.statsBulletins[parseInt(nameB)].uri;
      var summary = data.statsBulletins[parseInt(nameB)].summary;
      var name = data.statsBulletins[parseInt(nameB)].name;
      newBulletins[indexB] = {uri: uri, name: name, summary: summary};
    });
    data.statsBulletins = newBulletins;
    data.statsBulletinHeadline = newBulletins[0];
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, nameA) {
      var uri = data.articles[parseInt(nameA)].uri;
      var summary = data.articles[parseInt(nameA)].summary;
      var name = data.articles[parseInt(nameA)].name;
      newArticles[indexA] = {uri: uri, name: name, summary: summary};
    });
    data.articles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, nameD) {
      var uri = data.datasets[parseInt(nameD)].uri;
      var summary = data.datasets[parseInt(nameD)].summary;
      var name = data.datasets[parseInt(nameD)].name;
      newDatasets[indexD] = {uri: uri, name: name, summary: summary};
    });
    data.datasets = newDatasets;
  }
}

