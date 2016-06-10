/**
 * Manages related data
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function renderRelatedItemAccordionSection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedItemAccordionSectionViewModel(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#' + idField).replaceWith(html);
  resolvePageTitlesThenRefresh(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshRelatedItemAccordionSection(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedItemAccordionSectionViewModel(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseRelatedItemAccordionSection(collectionId, data, templateData, field, idField);
}

function createRelatedItemAccordionSectionViewModel(idField, list) {
  var dataTemplate;
  if (idField === 'article') {
    dataTemplate = {list: list, idField: idField, idPlural: 'articles (DO NOT USE. TO BE DELETED)'};
  } else if (idField === 'bulletin') {
    dataTemplate = {list: list, idField: idField, idPlural: 'bulletins (DO NOT USE. TO BE DELETED)'};
  } else if (idField === 'dataset') {
    dataTemplate = {list: list, idField: idField, idPlural: 'datasets'};
  } else if (idField === 'document') {
    dataTemplate = {list: list, idField: idField, idPlural: 'bulletins | articles | compendia'};
  } else if (idField === 'qmi') {
    dataTemplate = {list: list, idField: idField, idPlural: 'QMIs'};
  } else if (idField === 'methodology') {
    dataTemplate = {list: list, idField: idField, idPlural: 'methodologies'};
  } else if (idField === 'link') {
    dataTemplate = {list: list, idField: idField, idPlural: 'links'};
  } else {
    dataTemplate = {list: list, idField: idField};
  }
  return dataTemplate;
}

function initialiseRelatedItemAccordionSection(collectionId, data, templateData, field, idField) {

  if (data[field]) {
    $(data[field]).each(function (index) {
      // Attach delete button handler.
      $('#' + idField + '-delete_' + index).click(function () {
        deleteItem(index);
      });
    });
  }

  // attach add button handler.
  $('#add-' + idField).click(function () {
    renderRelatedItemModal();
  });

  // Make sections sortable
  function sortable() {
    var sortableStartPosition;

    $('#sortable-' + idField).sortable({
      start: function(event, ui) {

        // remember the index of the item at the start of drag + drop
        sortableStartPosition = ui.item.index();
        console.log("sortable start: " + sortableStartPosition);
      },
      stop: function(event, ui){

        // determine the new index of the item after being dropped.
        var sortableEndPosition =  ui.item.index();
        console.log("sortable update: Start: " + sortableStartPosition + " now: " + sortableEndPosition) ;

        var sectionsArray = data[field];
        var item = data[field][sortableStartPosition];

        // Move the item from the start drag position to the end drop position in the data model.
        sectionsArray.splice(sortableStartPosition, 1);
        sectionsArray.splice(sortableEndPosition, 0, item);

        saveContentAndRefreshSection();
      }
    });
  }

  sortable();

  function deleteItem(index) {
    swal({
      title: "Warning",
      text: "Are you sure you want to delete this link?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function (result) {
      if (result === true) {

        showDeletedMessage();

        // delete the item from the data model.
        data[field].splice(index, 1);
        templateData[field].splice(index, 1);

        saveContentAndRefreshSection();
      }
    });
  }

  function saveContentAndRefreshSection() {
    putContent(collectionId, data.uri, JSON.stringify(data),
      success = function () {
        Florence.Editor.isDirty = false;
        refreshPreview(data.uri);
        refreshRelatedItemAccordionSection(collectionId, data, templateData, field, idField);
      },
      error = function (response) {
        if (response.status === 400) {
          sweetAlert("Cannot edit this page", "It is already part of another collection.");
        }
        else {
          handleApiError(response);
        }
      }
    );
  }

  function showDeletedMessage() {
    swal({
      title: "Deleted",
      text: "This " + idField + " has been deleted",
      type: "success",
      timer: 2000
    });
  }

  function renderRelatedItemModal() {

    var viewModel = {hasLatest: false}; //Set to true if 'latest' checkbox should show
    var latestCheck; //Populated with true/false later to check state of checkbox

    if (idField === 'article' || idField === 'bulletin' || idField === 'articles' || idField === 'bulletins' || idField === 'document' || idField === 'highlights') {
      viewModel = {hasLatest: true};
    }

    $('.modal').remove();
    var modal = templates.relatedModal(viewModel);
    $('.workspace-menu').append(modal);
    $('.modal-box input[type=text]').focus();

    //Modal click events
    $('.btn-uri-cancel').off().one('click', function () {
      $('.modal').remove();
      //createWorkspace(data.uri, collectionId, 'edit');
    });

    $('.btn-uri-get').click(function () {
      var pastedUrl = $('#uri-input').val();
      var dataUrl = checkPathParsed(pastedUrl);
      var latestCheck = $('input[id="latest"]').prop('checked');
      getPage(data, templateData, field, latestCheck, dataUrl);
      $('.modal').remove();
    });

    $('.btn-uri-browse').off().one('click', function () {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Florence.Handler, true);
      createWorkspace(data.uri, collectionId, '', null, true);
      $('.modal').remove();

      //Disable the editor
      $('body').append(
        "<div class='col col--5 panel disabled'></div>"
      );

      //Add buttons to iframe window
      var iframeNav = templates.iframeNav(viewModel);
      $(iframeNav).hide().appendTo('.browser').fadeIn(600);

      //Take iframe window to homepage/root
      $('#iframe').attr('src', '/');

      $('.btn-browse-cancel').off().one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      //Remove added markup if user navigates away from editor screen
      $('a:not(.btn-browse-get)').click(function () {
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      $('.btn-browse-get').off().one('click', function () {
        var dataUrl = getPathNameTrimLast();
        latestCheck = $('input[id="latest"]').prop('checked');
        $('.iframe-nav').remove();
        $('.disabled').remove();
        getPage(data, templateData, field, latestCheck, dataUrl);
      });
    });
  }

  function getPage(data, templateData, field, latestCheck, dataUrl) {

    var dataUrlData = dataUrl + "/data";
    var latestUrl;
    if (latestCheck) {
      var tempUrl = dataUrl.split('/');
      tempUrl.pop();
      tempUrl.push('latest');
      latestUrl = tempUrl.join('/');
    } else {
      latestUrl = dataUrl;
    }

    $.ajax({
      url: dataUrlData,
      dataType: 'json',
      crossDomain: true,
      success: function (page) {

        if ((field === 'relatedBulletins' || field === 'statsBulletins') && page.type === 'bulletin') {
          initialiseField();
        }
        else if ((field === 'relatedDatasets' || field === 'datasets') && (page.type === 'dataset' || page.type === 'timeseries_dataset')) {
          initialiseField();
        }
        else if (field === 'relatedArticles' && (page.type === 'article' || page.type === 'article_download' || page.type === 'compendium_landing_page')) {
          initialiseField();
        }
        else if ((field === 'relatedDocuments') && (page.type === 'article' || page.type === 'article_download' || page.type === 'bulletin' || page.type === 'compendium_landing_page')) {
          initialiseField();
        }
        else if ((field === 'relatedDatasets' || field === 'datasets') && (page.type === 'dataset_landing_page' || page.type === 'compendium_data')) {
          initialiseField();
        }
        else if ((field === 'items') && (page.type === 'timeseries')) {
          initialiseField();
        }
        else if ((field === 'relatedData') && (page.type === 'dataset_landing_page' || page.type === 'timeseries' || page.type === 'compendium_data')) {
          initialiseField();
        }
        else if (field === 'relatedMethodology' && (page.type === 'static_qmi')) {
          initialiseField();
        }
        else if (field === 'relatedMethodologyArticle' && (page.type === 'static_methodology' || page.type === 'static_methodology_download')) {
          initialiseField();
        }
        else if (field === 'highlightedLinks' && (page.type === 'article' || page.type === 'article_download' || page.type === 'bulletin' || page.type === 'compendium_landing_page')) {
          initialiseField();
        }
        else if (field === 'links') {
          initialiseField();
        }
        else {
          sweetAlert("This is not a valid document");
          //createWorkspace(data.uri, collectionId, 'edit');
          return;
        }

        function initialiseField() {
          if (!data[field]) {
            data[field] = [];
            templateData[field] = [];
          }
        }

        data[field].push({uri: latestUrl});

        var viewModelTitle = latestCheck ? '(Latest) ' + page.description.title : page.description.title;
        var viewModel = {uri: latestUrl, description: {title: viewModelTitle}};
        if (page.description.edition) {
          viewModel.description.edition = page.description.edition;
        }
        templateData[field].push(viewModel);

        saveContentAndRefreshSection();
        //saveRelated(collectionId, data.uri, data, templateData, field, idField);

      },
      error: function () {
        console.log('No page data returned');
      }
    });
  }
}

function resolvePageTitlesThenRefresh(collectionId, data, templateData, field, idField) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var latest = eachUri.match(/\/latest\/?$/) ? true : false;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].description.title = latest ? '(Latest) ' + response.title : response.title;
        if (response.edition) {
          templateData[field][index].description.edition = response.edition;
        }
        dfd.resolve();
      },
      error = function () {
        sweetAlert("Error", field + ' address: ' + eachUri + ' is not found.', "error");
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    refreshRelatedItemAccordionSection(collectionId, data, templateData, field, idField);
  });
}
