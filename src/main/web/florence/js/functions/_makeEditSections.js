function makeEditSections(collectionId, pageData, templateData) {           //pageData (plain), templateData (resolved)

  if (pageData.type === 'home_page') {
    var html = templates.workEditT1(templateData);
    $('.workspace-menu').html(html);
    accordion();
    t1Editor(collectionId, pageData);
  }

  else if (pageData.type === 'taxonomy_landing_page') {
    var html = templates.workEditT2(templateData);
    $('.workspace-menu').html(html);
    accordion();
    t2Editor(collectionId, pageData);
  }

  else if (pageData.type === 'product_page') {
    var html = templates.workEditT3(templateData);
    $('.workspace-menu').html(html);
    accordion();
    t3Editor(collectionId, pageData);
  }

  else if (pageData.type === 'bulletin') {
    var html = templates.workEditT4(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(pageData, collectionId);
    }
    if (pageData.tables) {
      loadTablesList(pageData, collectionId);
    }
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    var html = templates.workEditT4(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(pageData, collectionId);
    }
    if (pageData.tables) {
      loadTablesList(pageData, collectionId);
    }
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries') {
    var html = templates.workEditT5(templateData);
    $('.workspace-menu').html(html);
    accordion();
    timeseriesEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium') {
    var html = templates.workEditT6(templateData);
    $('.workspace-menu').html(html);
    accordion();
    compendiumEditor(collectionId, pageData);
  }

  else if (pageData.type === 'methodology') {
    var html = templates.workEditT4(templateData);
    $('.workspace-menu').html(html);
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'about_us') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    accordion();
    staticEditor(collectionId, pageData);
  }

  else if (pageData.type === 'qmi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    accordion();
    qmiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'foi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    accordion();
    foiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'adhoc') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    accordion();
    adHocEditor(collectionId, pageData);
  }


  else {

    var workspace_menu_sub_edit =
      '<section class="workspace-edit">' +
      '  <p style="font-size:20px; color:red;">Page: ' + pageData.type + ' is not supported.</p>' +
      '  <textarea class="fl-editor__headline" name="fl-editor__headline" style="height: 728px" cols="104"></textarea>' +
      '  <nav class="edit-nav">' +
      '  </nav>' +
      '</section>';

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
    //$(':input').unbind('input');
    //console.log('Changes detected.');
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