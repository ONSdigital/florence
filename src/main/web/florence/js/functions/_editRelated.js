/**
 * Manages related data
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editRelated(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedTemplate(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseRelated(collectionId, data, templateData, field, idField);
  resolveTitle(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshRelated(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = createRelatedTemplate(idField, list);
  var html = templates.editorRelated(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseRelated(collectionId, data, templateData, field, idField);
}

function createRelatedTemplate(idField, list) {
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
  } else {
    dataTemplate = {list: list, idField: idField};
  }
  return dataTemplate;
}

function initialiseRelated(collectionId, data, templateData, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    editRelated['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index) {
      editRelated['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        swal({
          title: "Warning",
          text: "Are you sure you want to delete this link?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          closeOnConfirm: false
        }, function(result) {
          if (result === true) {
            swal({
              title: "Deleted",
              text: "This " + idField + " has been deleted",
              type: "success",
              timer: 2000
            });
            var position = $(".workspace-edit").scrollTop();
            Florence.globalVars.pagePos = position;
            $(this).parent().remove();
            data[field].splice(index, 1);
            templateData[field].splice(index, 1);
            putContent(collectionId, data.uri, JSON.stringify(data),
              success = function () {
                Florence.Editor.isDirty = false;
                refreshPreview(data.uri);
                refreshRelated(collectionId, data, templateData, field, idField);
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
        });
      });
    });
  }

  //Add
  $('#add-' + idField).off().one('click', function () {
    var hasLatest = {hasLatest : false}; //Set to true if 'latest' checkbox should show
    var latestCheck; //Populated with true/false later to check state of checkbox
    var position = $(".workspace-edit").scrollTop();

    if (idField === 'article' || idField === 'bulletin' || idField === 'articles' || idField === 'bulletins' || idField === 'document' || idField === 'highlights') {
    hasLatest = {hasLatest : true};
  }

    Florence.globalVars.pagePos = position;
    var modal = templates.relatedModal(hasLatest);
    $('.workspace-menu').append(modal);

    //Modal click events
    $('.btn-uri-cancel').off().one('click', function () {
      createWorkspace(data.uri, collectionId, 'edit');
    });

    $('.btn-uri-get').off().one('click', function () {
      var pastedUrl = $('#uri-input').val();
      var dataUrl = checkPathParsed(pastedUrl);
      var latestCheck = $('input[id="latest"]').prop('checked');
      getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl);
      $('.modal').remove();
    });

    $('.btn-uri-browse').off().one('click', function () {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Florence.Handler, true);
      createWorkspace(data.uri, collectionId, '', true);
      $('.modal').remove();

      //Disable the editor
      $('body').append(
          "<div class='col col--5 panel disabled'></div>"
      );

      //Add buttons to iframe window
      var iframeNav = templates.iframeNav(hasLatest);
      $(iframeNav).hide().appendTo('.browser').fadeIn(600);

      //Take iframe window to homepage/root
       $('#iframe').attr('src', '/');

      $('.btn-browse-cancel').off().one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      //Remove added markup if user navigates away from editor screen
      $('a:not(.btn-browse-get)').click(function (){
        $('.iframe-nav').remove();
        $('.disabled').remove();
      });

      $('.btn-browse-get').off().one('click', function () {
        var dataUrl = getPathNameTrimLast();
        var latestCheck = $('input[id="latest"]').prop('checked');
        $('.iframe-nav').remove();
        $('.disabled').remove();
        getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl);
      });
    });
  });

  // Make sections sortable
  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function(){
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function(index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }
  sortable();
}

function getPage(collectionId, data, templateData, field, idField, latestCheck, dataUrl) {

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
    success: function (result) {
      if ((field === 'relatedBulletins' || field === 'statsBulletins') && result.type === 'bulletin') {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }
      else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset' || result.type === 'timeseries_dataset')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }
      else if (field === 'relatedArticles' && (result.type === 'article' || result.type === 'article_download' || result.type === 'compendium_landing_page')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedDocuments') && (result.type === 'article' || result.type === 'article_download' || result.type === 'bulletin' || result.type === 'compendium_landing_page')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset_landing_page' || result.type === 'compendium_data')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'items') && (result.type === 'timeseries')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if ((field === 'relatedData') && (result.type === 'dataset_landing_page' || result.type === 'timeseries' || result.type === 'compendium_data')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'relatedMethodology' && (result.type === 'static_qmi')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'relatedMethodologyArticle' && (result.type === 'static_methodology' || result.type === 'static_methodology_download')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else if (field === 'highlightedLinks' && (result.type === 'bulletin')) {
        if (!data[field]) {
          data[field] = [];
          templateData[field] = [];
        }
      }

      else {
        sweetAlert("This is not a valid document");
        createWorkspace(data.uri, collectionId, 'edit');
        return;
      }

      data[field].push({uri: latestUrl});
      templateData[field].push({uri: latestUrl});
      saveRelated(collectionId, data.uri, data, templateData, field, idField);

    },
    error: function () {
      console.log('No page data returned');
    }
  });
}

function resolveTitle(collectionId, data, templateData, field, idField) {
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
    refreshRelated(collectionId, data, templateData, field, idField);
  });
}
