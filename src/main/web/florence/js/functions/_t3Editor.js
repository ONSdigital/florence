function t3Editor(collectionId, data) {

  var newTimeseries = [], newBulletins = [], newArticles = [], newDatasets = [];
  var lastIndexTimeseries, lastIndexBulletins, lastIndexArticles, lastIndexDatasets;
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
  $("#keywords").on('change', function () {
    $(this).textareaAutoSize();
    data.description.keywords.push($(this).val());
  });
  $("#metaDescription").on('click keyup', function () {
    $(this).textareaAutoSize();
    data.description.metaDescription = $(this).val();
  });

  $(data.items).each(function(index, section) {
    lastIndexTimeseries = index + 1;
    // Delete
    $("#timeseries-delete_"+index).click(function() {
      $("#"+index).remove();
      data.items.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new related timeseries
  $("#addTimeseries").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-timeseries').append(
        '<div id="' + lastIndexTimeseries + '" class="edit-section__sortable-item">' +
        '  <textarea id="timeseries-uri_' + lastIndexTimeseries + '" placeholder="Go to the related timeseries and click Get"></textarea>' +
        '  <button class="btn-page-get" id="timeseries-get_' + lastIndexTimeseries + '">Get</button>' +
        '  <button class="btn-page-cancel" id="timeseries-cancel_' + lastIndexTimeseries + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#timeseries-get_" + lastIndexTimeseries).one('click', function () {
      var pastedUrl = $('#timeseries-uri_'+lastIndexTimeseries).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var timeseriesUrlData = myUrl.pathname + "/data";
      } else {
        var timeseriesUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var timeseriesUrlData = timeseriesUrl + "/data";
      }

      $.ajax({
        url: timeseriesUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'timeseries') {
            if (!data.items) {
              data.items = [];
            }
            data.items.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a timeseries");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#timeseries-cancel_" + lastIndexTimeseries).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableTimeseries() {
    $("#sortable-timeseries").sortable();
  }
  sortableTimeseries();



  $(data.statsBulletins).each(function(index, section) {
    lastIndexBulletins = index + 1;
    // Delete
    $("#bulletins-delete_"+index).click(function() {
      $("#"+index).remove();
      data.statsBulletins.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new related bulletins
  $("#addBulletins").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-bulletins').append(
        '<div id="' + lastIndexBulletins + '" class="edit-section__sortable-item">' +
        '  <textarea id="bulletins-uri_' + lastIndexBulletins + '" placeholder="Go to the related bulletins and click Get"></textarea>' +
        '  <button class="btn-page-get" id="bulletins-get_' + lastIndexBulletins + '">Get</button>' +
        '  <button class="btn-page-cancel" id="bulletins-cancel_' + lastIndexBulletins + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#bulletins-get_" + lastIndexBulletins).one('click', function () {
      var pastedUrl = $('#bulletins-uri_'+lastIndexBulletins).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var bulletinsUrlData = myUrl.pathname + "/data";
      } else {
        var bulletinsUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var bulletinsUrlData = bulletinsUrl + "/data";
      }

      $.ajax({
        url: bulletinsUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'bulletin') {
            if (!data.statsBulletins) {
              data.statsBulletins = [];
            }
            data.statsBulletins.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#bulletins-cancel_" + lastIndexBulletins).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableBulletins() {
      $("#sortable-bulletins").sortable();
  }
  sortableBulletins();


  $(data.relatedArticles).each(function(index, section) {
    lastIndexArticles = index + 1;
    // Delete
    $("#articles-delete_"+index).click(function() {
      $("#"+index).remove();
      data.relatedArticles.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new related articles
  $("#addArticles").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-articles').append(
        '<div id="' + lastIndexArticles + '" class="edit-section__sortable-item">' +
        '  <textarea id="articles-uri_' + lastIndexArticles + '" placeholder="Go to the related articles and click Get"></textarea>' +
        '  <button class="btn-page-get" id="articles-get_' + lastIndexArticles + '">Get</button>' +
        '  <button class="btn-page-cancel" id="articles-cancel_' + lastIndexArticles + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#articles-get_" + lastIndexArticles).one('click', function () {
      var pastedUrl = $('#articles-uri_'+lastIndexArticles).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var articlesUrlData = myUrl.pathname + "/data";
      } else {
        var articlesUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var articlesUrlData = articlesUrl + "/data";
      }

      $.ajax({
        url: articlesUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'article') {
            if (!data.relatedArticles) {
              data.relatedArticles = [];
            }
            data.relatedArticles.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a article");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#articles-cancel_" + lastIndexArticles).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortableArticles() {
    $("#sortable-articles").sortable();
  }
  sortableArticles();


  $(data.datasets).each(function(index, section) {
    lastIndexDatasets = index + 1;
    // Delete
    $("#datasets-delete_"+index).click(function() {
      $("#"+index).remove();
      data.datasets.splice(index, 1);
      updateContent(collectionId, getPathName(), JSON.stringify(data));
    });
  });

  //Add new related datasets
  $("#addDatasets").one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-datasets').append(
        '<div id="' + lastIndexDatasets + '" class="edit-section__sortable-item">' +
        '  <textarea id="datasets-uri_' + lastIndexDatasets + '" placeholder="Go to the related datasets and click Get"></textarea>' +
        '  <button class="btn-page-get" id="datasets-get_' + lastIndexDatasets + '">Get</button>' +
        '  <button class="btn-page-cancel" id="datasets-cancel_' + lastIndexDatasets + '">Cancel</button>' +
        '</div>').trigger('create');

    $("#datasets-get_" + lastIndexDatasets).one('click', function () {
      var pastedUrl = $('#datasets-uri_'+lastIndexDatasets).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var datasetsUrlData = myUrl.pathname + "/data";
      } else {
        var datasetsUrl = $('#iframe')[0].contentWindow.document.location.pathname;
        var datasetsUrlData = datasetsUrl + "/data";
      }

      $.ajax({
        url: datasetsUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'dataset') {
            if (!data.datasets) {
              data.datasets = [];
            }
            data.datasets.push({uri: relatedData.uri});
            saveRelated(collectionId, pageUrl, data);
          } else {
            alert("This is not a dataset");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $("#datasets-cancel_" + lastIndexDatasets).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

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
      var uri = data.items[parseInt(titleT)].uri;
      newTimeseries[indexT] = {uri: uri};
    });
    data.items = newTimeseries;
    // Bulletins
    var orderBulletins = $("#sortable-bulletins").sortable('toArray');
    $(orderBulletins).each(function (indexB, titleB) {
      var uri = data.statsBulletins[parseInt(titleB)].uri;
      newBulletins[indexB] = {uri: uri};
    });
    data.statsBulletins = newBulletins;
    // Articles
    var orderArticles = $("#sortable-articles").sortable('toArray');
    $(orderArticles).each(function (indexA, titleA) {
      var uri = data.relatedArticles[parseInt(titleA)].uri;
      newArticles[indexA] = {uri: uri};
    });
    data.articles = newArticles;
    // Datasets
    var orderDatasets = $("#sortable-datasets").sortable('toArray');
    $(orderDatasets).each(function (indexD, titleD) {
      var uri = data.datasets[parseInt(titleD)].uri;
      newDatasets[indexD] = {uri: uri};
    });
    data.datasets = newDatasets;
  }
}

