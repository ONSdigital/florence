/**
 * Manages the editor menus
 * @param collectionId
 * @param pageData
 * @param isPageComplete - if present page has been approved
 */

function makeEditSections(collectionId, pageData, isPageComplete) {

  var templateData = jQuery.extend(true, {}, pageData); // clone page data to add template related properties.
  templateData.isPageComplete = isPageComplete;

  if (pageData.type === 'home_page') {
    var email = localStorage.getItem('loggedInAs');   // get user permissions
    getUserPermission(
      function (permission) {
        if (permission.admin) {
          var html = templates.workEditT1(templateData);
          $('.workspace-menu').html(html);
          editServiceMessage(collectionId, pageData);
          accordion();
          t1Editor(collectionId, pageData, templateData);   //templateData used to resolve section titles
        } else {
          $('.workspace-menu').html("<section class='panel workspace-edit'><div class='edit-section'>" +
            "<div class='edit-section__head'><h1>You cannot edit this page. Please contact an administrator</h1></div></div></section>");
        }
      },
      function (error) {
        sweetAlert("There is a problem with permissions. Please contact an administrator");
      },
      email
    );
  }

  // Original code
  //if (pageData.type === 'home_page') {
  //  var html = templates.workEditT1(templateData);
  //  $('.workspace-menu').html(html);
  //  editServiceMessage(collectionId, pageData);
  //  accordion();
  //  t1Editor(collectionId, pageData, templateData);   //templateData used to resolve section titles
  //}

  else if (pageData.type === 'home_page_census') {
    var email = localStorage.getItem('loggedInAs');   // get user permissions
    getUserPermission(
      function (permission) {
        if (permission.admin) {
          var html = templates.workEditT1Census(templateData);
          $('.workspace-menu').html(html);
          if (pageData.images) {
            loadImagesList(collectionId, pageData);
          }
          editBlocks(collectionId, pageData, templateData, 'sections', 'block');
          accordion();
          t1EditorCensus(collectionId, pageData, templateData);   //templateData used to resolve section titles
        } else {
          $('.workspace-menu').html("<section class='panel workspace-edit'><div class='edit-section'>" +
            "<div class='edit-section__head'><h1>You cannot edit this page. Please contact an administrator</h1></div></div></section>");
        }
      },
      function (error) {
        sweetAlert("There is a problem with permissions. Please contact an administrator");
      },
      email
    );
  }

  // Original code
  //else if (pageData.type === 'home_page_census') {
  //  var html = templates.workEditT1Census(templateData);
  //  $('.workspace-menu').html(html);
  //  if (pageData.images) {
  //    loadImagesList(collectionId, pageData);
  //  }
  //  editBlocks(collectionId, pageData, templateData, 'sections', 'block');
  //  accordion();
  //  t1EditorCensus(collectionId, pageData, templateData);   //templateData used to resolve section titles
  //}

  else if (pageData.type === 'taxonomy_landing_page') {
    var html = templates.workEditT2(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'highlightedLinks', 'highlights');
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
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    accordion();
    t3Editor(collectionId, pageData);
  }

  else if (pageData.type === 'bulletin') {
    var html = templates.workEditT4Bulletin(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedBulletins', 'bulletin');   //2b deleted
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    addFile(collectionId, pageData, 'pdfTable', 'pdf');
    editExtLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    bulletinEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article') {
    var html = templates.workEditT4Article(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedArticles', 'article');   //2b deleted
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    addFile(collectionId, pageData, 'pdfTable', 'pdf');
    editExtLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    articleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'article_download') {
    var html = templates.workEditT4ArticleDownload(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    addFile(collectionId, pageData, 'downloads', 'file');
    editExtLink (collectionId, pageData, 'links', 'link');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    editDocWithFilesCorrection(collectionId, pageData, 'versions', 'correction');
    accordion();
    ArticleDownloadEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries') {
    var html = templates.workEditT5(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section');
    editMarkdownWithNoTitle (collectionId, pageData, 'notes', 'note');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'timeseries');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    timeseriesEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_landing_page') {
    var html = templates.workEditT6(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedData', 'data');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    compendiumEditor(collectionId, pageData, templateData);     //templateData used to resolve chapter titles
  }

  else if (pageData.type === 'compendium_chapter') {
    var html = templates.workEditT4Compendium(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editExtLink (collectionId, pageData, 'links', 'link');
    editDocumentCorrection(collectionId, pageData, templateData, 'versions', 'correction');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    compendiumChapterEditor(collectionId, pageData);
  }

  else if (pageData.type === 'compendium_data') {
    var html = templates.workEditT8Compendium(templateData);
    $('.workspace-menu').html(html);
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    addFileWithDetails (collectionId, pageData, 'downloads', 'file');
    editDocWithFilesCorrection(collectionId, pageData, 'versions', 'correction');
    accordion();
    compendiumDataEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_landing_page') {
    var html = templates.workEditT7Landing(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    accordion();
    staticLandingPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_page') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    //  VV--------------- uncomment these lines if you need charts ---------------VV
    //if (pageData.charts) {
    //  loadChartsList(collectionId, pageData);
    //}
    //  ^^--------------- uncomment these lines if you need charts ---------------^^
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    //  VV--------------- uncomment these lines if you need images ---------------VV
    //if (pageData.images) {
    //  loadImagesList(collectionId, pageData);
    //}
    //  ^^--------------- uncomment these lines if you need images ---------------^^
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    editIntAndExtLinks (collectionId, pageData, templateData, 'links', 'link');
    accordion();
    staticPageEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_article') {
    var html = templates.workEditT7StaticArticle(templateData);
    $('.workspace-menu').html(html);
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editIntAndExtLinks (collectionId, pageData, templateData, 'links', 'link');
    addFile(collectionId, pageData, 'downloads', 'file');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    staticArticleEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_qmi') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
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
    if (pageData.charts) {
      loadChartsList(collectionId, pageData);
    }
    if (pageData.tables) {
      loadTablesList(collectionId, pageData);
    }
    if (pageData.images) {
      loadImagesList(collectionId, pageData);
    }
    editMarkdown (collectionId, pageData, 'sections', 'section');
    editMarkdown (collectionId, pageData, 'accordion', 'tab');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    addFile(collectionId, pageData, 'downloads', 'file');
    editIntAndExtLinks (collectionId, pageData, templateData, 'links', 'link');
    //editTopics (collectionId, pageData, templateData, 'topics', 'topics');  //ready 2b used
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    methodologyEditor(collectionId, pageData);
  }

  else if (pageData.type === 'static_methodology_download') {
    var html = templates.workEditT7(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'content');
    addFile(collectionId, pageData, 'downloads', 'file');
    addFile(collectionId, pageData, 'pdfDownloads', 'pdfFile');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editIntAndExtLinks (collectionId, pageData, templateData, 'links', 'link');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    methodologyDownloadEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset_landing_page') {
    var html = templates.workEditT8LandingPage(templateData);
    $('.workspace-menu').html(html);
    editMarkdownOneObject (collectionId, pageData, 'section', 'Notes');
    addDataset (collectionId, pageData, 'datasets', 'edition');
    editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'dataset');
    editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    editRelated (collectionId, pageData, templateData, 'relatedMethodology', 'qmi');
    editRelated (collectionId, pageData, templateData, 'relatedMethodologyArticle', 'methodology');
    editTopics (collectionId, pageData, templateData, 'topics', 'topics');
    editAlert(collectionId, pageData, templateData, 'alerts', 'alert');
    accordion();
    datasetLandingEditor(collectionId, pageData);
  }

  else if (pageData.type === 'dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    editDatasetVersion(collectionId, pageData, 'versions', 'version');
    editDatasetVersion(collectionId, pageData, 'versions', 'correction');
    addFile (collectionId, pageData, 'supplementaryFiles', 'supplementary-files');
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'timeseries_dataset') {
    var html = templates.workEditT8(templateData);
    $('.workspace-menu').html(html);
    editDatasetVersion(collectionId, pageData, 'versions', 'version');
    addFile (collectionId, pageData, 'supplementaryFiles', 'supplementary-files');
    editDatasetVersion(collectionId, pageData, 'versions', 'correction');
    accordion();
    datasetEditor(collectionId, pageData);
  }

  else if (pageData.type === 'release') {
    var html = templates.workEditT16(templateData);
    $('.workspace-menu').html(html);
    editMarkdownWithNoTitle (collectionId, pageData, 'markdown', 'prerelease');
    editDate (collectionId, pageData, templateData, 'dateChanges', 'changeDate');
    //editRelated (collectionId, pageData, templateData, 'relatedDocuments', 'document');
    //editRelated (collectionId, pageData, templateData, 'relatedDatasets', 'data');
    accordion();
    releaseEditor(collectionId, pageData, templateData);
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
      var pageDataToSave = $('.fl-editor__headline').val();
      updateContent(collectionId, pageData.uri, pageDataToSave);
    });

    // complete
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      var pageDataToSave = $('.fl-editor__headline').val();
      saveAndCompleteContent(collectionId, pageData.uri, pageDataToSave);
    });

    // review
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      var pageDataToSave = $('.fl-editor__headline').val();
      saveAndReviewContent(collectionId, pageData.uri, pageDataToSave);
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
        var isPageComplete = !(!lastCompletedEvent || lastCompletedEvent.email === Florence.Authentication.loggedInEmail());

        var editNav = templates.editNav({isPageComplete: isPageComplete});
        $('.edit-nav').html(editNav);
      },
      error = function (response) {
        handleApiError(response);
      })
}