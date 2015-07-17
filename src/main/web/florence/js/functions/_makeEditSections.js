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
    editRelated (collectionId, pageData, templateData, 'items', 'timeseries');
    editRelated (collectionId, pageData, templateData, 'statsBulletins', 'bulletins');
    editRelated (collectionId, pageData, templateData, 'relatedArticles', 'articles');
    editRelated (collectionId, pageData, templateData, 'datasets', 'datasets');
    accordion();
    t3Editor(collectionId, pageData);
  }

  else if (pageData.type === 'bulletin') {
    var html = templates.workEditT4Bulletin(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(pageData, collectionId);
    }
    if (pageData.tables) {
      loadTablesList(pageData, collectionId);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedBulletins', 'bulletin');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    var html = templates.workEditT4Article(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(pageData, collectionId);
    }
    if (pageData.tables) {
      loadTablesList(pageData, collectionId);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedArticles', 'article');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries') {
    var html = templates.workEditT5(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section', 'section');
    editMarkdownWithNoTitle (collectionId, pageData, 'notes', 'note');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'timeseries');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'methodology');
    accordion();
    timeseriesEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_landing_page') {
    var html = templates.workEditT6(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'methodology');
    accordion();
    compendiumEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_chapter') {
    var html = templates.workEditT4Compendium(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(pageData, collectionId);
    }
    if (pageData.tables) {
      loadTablesList(pageData, collectionId);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    compendiumChapterEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_data') {
    var html = templates.workEditT8Compendium(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'methodology');
    addFileWithDetails (collectionId, pageData, 'downloads', 'file');
    accordion();
    compendiumDataEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_landing_page') {
    var html = templates.workEditT7Landing(templateData);
    $('.workspace-menu').html(html);
    accordion();
    staticLandingPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_article') {
    var html = templates.workEditT4Methodology(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_page') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    editLink (collectionId, pageData, 'links', 'link');
    accordion();
    staticPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_qmi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    qmiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_foi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    foiEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_adhoc') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    adHocEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_methodology') {
    var html = templates.workEditT4Methodology(templateData);
    $('.workspace-menu').html(html);
    editMarkdown (collectionId, pageData, 'sections', 'section');
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'methodology');
    addFile (collectionId, pageData, 'downloads', 'file');
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'reference_tables') {
    var html = templates.workEditT8ReferenceTable(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'methodology');
    addFileWithDetails (collectionId, pageData, 'downloads', 'file');
    accordion();
    referenceTableEditor(collectionId, pageData);
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