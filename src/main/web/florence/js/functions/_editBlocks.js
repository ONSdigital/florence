/**
 * Manages related data
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editBlocks(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorT1Blocks(dataTemplate);
  $('#' + idField).replaceWith(html);
  resolveStatsTitle(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshBlocks(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorT1Blocks(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseBlocks(collectionId, data, templateData, field, idField);
}

function initialiseBlocks(collectionId, data, templateData, field, idField) {
  // Load
  $(data[field]).each(function (index) {
    // Delete
    $('#' + idField + '-delete_' + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this block?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
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
            function () {
              Florence.Editor.isDirty = false;
              refreshPreview(data.uri);
              refreshBlocks(collectionId, data, templateData, field, idField);
            },
            function (response) {
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

  //Add
  $('#add-' + idField).off().click(function () {
    //add a modal to select an option for stats or news
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position;
    var modalStatsOrNews = templates.blockModal;
    $('.workspace-menu').append(modalStatsOrNews);
    //They choose timeseries
    $('#data-link').click(function () {
      if (!data[field]) {
        data[field] = [];
      }

      //Florence.globalVars.pagePos = position;
      var modal = templates.blockNewsModal;
      var pastedUrl, size;
      $('.modal').remove();
      $('.workspace-menu').append(modal);
      $('.modal-news').remove();
      menuselect("uri-size");

      //Modal click events
      $('.btn-uri-cancel').off().one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
      });

      $('#uri-size').change(function () {
        size = $('#uri-size').val();
      });

      $('.btn-uri-get').off().click(function () {
        pastedUrl = $('#uri-input').val();
        if (pastedUrl === "") {
          sweetAlert("This field cannot be empty. Please paste a valid url address");
        } else {
          var dataUrl = checkPathParsed(pastedUrl);
          if (dataUrl === "") {    //special case for home page
            dataUrl = "/";
          }
          checkValidStats(collectionId, data, templateData, field, idField, dataUrl, size);
          $('.modal').remove();
        }
      });
    });

    //They choose news
    $('#item-link').click(function () {
      if (!data[field]) {
        data[field] = [];
      }
      var modal = templates.blockNewsModal(data.images);
      var uri, title, text, image, size;
      $('.modal').remove();
      $('.workspace-menu').append(modal);
      menuselect("uri-size");

      $('#uri-input').change(function () {
        uri = $('#uri-input').val();
      });
      $('#uri-title').change(function () {
        title = $('#uri-title').val();
      });
      $('#uri-text').change(function () {
        text = $('#uri-text').val();
      });

      $("#uri-text").change(function () {
        $(this).textareaAutoSize();
        text = $('#uri-text').val();
      });
      $('#uri-image').change(function () {
        var index = parseInt($('#uri-image').val());
        image = data.images[index];
      });
      $('#uri-size').change(function () {
        size = $('#uri-size').val();
      });

      $('.btn-uri-get').off().click(function () {
        if (!title) {
          sweetAlert('You need to enter a title to continue');
        }
        else {
          data[field].push({uri: uri, title: title, text: text, image: image, size: size});
          saveBlocks(collectionId, data.uri, data, templateData, field, idField);
          $('.modal').remove();
        }
      });
      $('.btn-uri-cancel').off().click(function () {
        createWorkspace(data.uri, collectionId, 'edit');
      });
    });

    //They cancel
    $('.btn-uri-cancel').off().click(function () {
      createWorkspace(data.uri, collectionId, 'edit');
    });
  });

  // Make sections sortable
  function sortable() {
    $('#sortable-' + idField).sortable({
      stop: function () {
        $('#' + idField + ' .edit-section__sortable-item--counter').each(function (index) {
          $(this).empty().append(index + 1);
        });
      }
    });
  }

  sortable();
}

function resolveStatsTitle(collectionId, data, templateData, field, idField) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    var dfd = $.Deferred();
    if (!this.title) {
      getPageDataTitle(collectionId, path.uri,
        function (response) {
          //templateData[field][index] = {};
          templateData[field][index] = response;
          dfd.resolve();
        },
        function () {
          sweetAlert("Error", field + ' address: ' + path.uri + ' is not found.', "error");
          dfd.resolve();
        }
      );
      ajaxRequest.push(dfd);
    }
  });

  $.when.apply($, ajaxRequest).then(function () {
    refreshBlocks(collectionId, data, templateData, field, idField);
  });
}


function saveBlocks(collectionId, path, data, templateData, field, idField) {
  putContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      Florence.Editor.isDirty = false;
      refreshBlocks(collectionId, data, templateData, field, idField);
      createWorkspace(data.uri, collectionId, 'edit');
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

function checkValidStats(collectionId, data, templateData, field, idField, dataUrl, size) {
  var dataUrlData = dataUrl + "/data";
  $.ajax({
    url: dataUrlData,
    dataType: 'json',
    crossDomain: true,
    success: function (result) {
      if (result.type === 'timeseries') {
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

      data[field].push({uri: dataUrl, size: size});
      templateData[field].push({uri: dataUrl, size: size});
      saveBlocks(collectionId, data.uri, data, templateData, field, idField);

    },
    error: function () {
      console.log('No page data returned');
    }
  });
}
