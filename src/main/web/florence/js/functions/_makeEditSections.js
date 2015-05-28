function makeEditSections(collectionId, pageData) {

//  $('.btn-edit-cancel').click(function (collectionId) {
//    viewWorkspace('', collectionId, 'browse');
//  });

  if (pageData.type === 'home' && pageData.level === 't1') {
        var html = templates.workEditT1(pageData);
        $('.workspace-menu').html(html);
        accordion();
        t1Editor(collectionId, pageData);
      }

  else if (pageData.type === 'home' && pageData.level === 't2') {
      var html = templates.workEditT2(pageData);
      $('.workspace-menu').html(html);
      accordion();
      t2Editor(collectionId, pageData);
    }

  else if (pageData.type === 'home' && pageData.level === 't3') {
    var html = templates.workEditT3(pageData);
    $('.workspace-menu').html(html);
    accordion();
    t3Editor(collectionId, pageData);
  }

  else if (pageData.type === 'bulletin') {
    var html = templates.workEditT4(pageData);
    $('.workspace-menu').html(html);
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    var html = templates.workEditT4(pageData);
    $('.workspace-menu').html(html);
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'methodology') {
    var html = templates.workEditT4(pageData);
    $('.workspace-menu').html(html);
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    var html = templates.workEditT4(pageData);
    $('.workspace-menu').html(html);
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static') {
    var html = templates.workEditT7(pageData);
    $('.workspace-menu').html(html);
    accordion();
    staticEditor(collectionId, pageData);
  }

  else if (pageData.type === 'qmi') {
    var html = templates.workEditT7(pageData);
    $('.workspace-menu').html(html);
    accordion();
    qmiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'foi') {
    var html = templates.workEditT7(pageData);
    $('.workspace-menu').html(html);
    accordion();
    foiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'adHoc') {
    var html = templates.workEditT7(pageData);
    $('.workspace-menu').html(html);
    accordion();
    adHocEditor(collectionId, pageData);
  }

  else {

    var workspace_menu_sub_edit =
      '<section class="workspace-edit">' +
      '     <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 728px" cols="104"></textarea>' +
      '     <nav class="edit-nav">' +
      '     </nav>' +
      '  </section>';

    $('.workspace-menu').html(workspace_menu_sub_edit);
    $('.fl-editor__headline').val(JSON.stringify(pageData, null, 2));

    refreshEditNavigation();

    var editNav = $('.edit-nav');
    editNav.off(); // remove any existing event handlers.

    editNav.on('click', '.btn-edit-save', function () {
      pageData = $('.fl-editor__headline').val();
      updateContent(collectionId, getPathName(), pageData);
    });

    // complete
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      pageData = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionId, getPathName(), pageData);
    });

    // review
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      pageData = $('.fl-editor__headline').val();
      saveAndReviewContent(collectionId, getPathName(), pageData);
    });
  }

  // Listen on all input within the workspace edit panel for dirty checks.
  $('.workspace-edit :input').on('input', function () {
    Florence.Editor.isDirty = true;
    // remove the handler now we know content has changed.
    $(':input').unbind('input');
    console.log('Changes detected.');
  });
}

function refreshEditNavigation() {
  getCollection(Florence.collection.id,
    success = function (collection) {
      var pagePath = getPathName();
      var pageFile = pagePath + '/data.json';
      var lastCompletedEvent = getLastCompletedEvent(collection, pageFile);
      var isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === localStorage.getItem("loggedInAs"));

      var editNav = templates.editNav({isPageComplete: isPageComplete});
      $('.edit-nav').html(editNav);
    },
    error = function (response) {
      handleApiError(response);
    })
}

function loadChartsList(data, collectionId) {
  var html = templates.workEditCharts(data);
  $('#charts').html(html);

  $(data.charts).each(function (index, chart) {

    var basePath = getPathName();
    var chartPath = basePath + '/' + chart.filename + '.json';

    $("#chart-edit_" + chart.filename).click(function () {
      getPageData(collectionId, chartPath,
        onSuccess = function (chartData) {
          loadChartBuilder(chartData, function () {
            refreshPreview();
          }, chartData);
        },
        onError = function (response) {
          handleApiError(response);
        }
      )
    });

    $("#chart-delete_" + chart.filename).click(function () {
      $("#chart_" + index).remove();

      deleteContent(collectionId, chartPath,
        onSuccess = function () {
          data.charts = _(data.charts).filter(function (item) {
            return item.filename !== chart.filename
          });
          postContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              Florence.Editor.isDirty = false;
              refreshPreview();
              loadChartsList(data, collectionId);
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        },
        onError = function (response) {
          handleApiError(response)
        });
    });
  });
}