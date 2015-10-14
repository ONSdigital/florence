/**
 * Manages topics to appear in list pages
 * @param collectionId
 * @param data
 * @param templateData
 * @param field - JSON data key
 * @param idField - HTML id for the template
 */

function editTopics(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorTopics(dataTemplate);
  $('#' + idField).replaceWith(html);
  initialiseTopics(collectionId, data, templateData, field, idField);
  resolveTopicTitle(collectionId, data, templateData, field, idField);
  $(".workspace-edit").scrollTop(Florence.globalVars.pagePos);
}

function refreshTopics(collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  var dataTemplate = {list: list, idField: idField};
  var html = templates.editorRelated(dataTemplate);
  $('#sortable-' + idField).replaceWith($(html).find('#sortable-' + idField));
  initialiseTopics(collectionId, data, templateData, field, idField);
}

function initialiseTopics(collectionId, data, templateData, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    editTopics['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index) {
      editTopics['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        var result = confirm("Are you sure you want to delete this link?");
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          Florence.globalVars.pagePos = position;
          $(this).parent().remove();
          data[field].splice(index, 1);
          templateData[field].splice(index, 1);
          postContent(collectionId, data.uri, JSON.stringify(data),
            success = function () {
              Florence.Editor.isDirty = false;
              refreshPreview(data.uri);
              refreshTopics(collectionId, data, templateData, field, idField)
            },
            error = function (response) {
              if (response.status === 400) {
                alert("Cannot edit this page. It is already part of another collection.");
              }
              else {
                handleApiError(response);
              }
            }
          );
        }
      });
    });
  }

  //Add
  $('#add-' + idField).off().one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    Florence.globalVars.pagePos = position;
    var result = confirm('If you do not come back to this page, you will loose any unsaved changes');
    if (result === true) {
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.removeEventListener('click', Florence.Handler, true);
      createWorkspace(data.uri, collectionId, '', true);

      $('#sortable-' + idField).append(
        '<div id="' + editTopics['lastIndex' + field] + '" class="edit-section__sortable-item">' +
        '  <textarea id="' + idField + '-uri_' + editTopics['lastIndex' + field] + '" placeholder="Go to the related' +
        ' product page and click Get or paste the link and click Get"></textarea>' +
        '  <div id="latest-container"></div>' +
        '  <button class="btn-page-get" id="' + idField + '-get_' + editTopics['lastIndex' + field] + '">Get</button>' +
        '  <button class="btn-page-cancel" id="' + idField + '-cancel_' + editTopics['lastIndex' + field] + '">Cancel</button>' +
        '</div>').trigger('create');

      $(function () {
        $('#' + idField + '-uri_' + editTopics['lastIndex' + field]).tooltip({
          items: '#' + idField + '-uri_' + editTopics['lastIndex' + field],
          content: 'Go to the related product page and click Get or paste the link and click Get',
          show: "slideDown", // show immediately
          open: function (event, ui) {
            ui.tooltip.hover(
              function () {
                $(this).fadeTo("slow", 0.5);
              });
          }
        });
      });

      $('#' + idField + '-cancel_' + editTopics['lastIndex' + field]).one('click', function () {
        createWorkspace(data.uri, collectionId, 'edit');
      });

      $('#' + idField + '-get_' + editTopics['lastIndex' + field]).one('click', function () {
        var pastedUrl = $('#' + idField + '-uri_' + editTopics['lastIndex' + field]).val();
        if (!pastedUrl) {
          var baseUrl = getPathNameTrimLast();
        } else {
          var baseUrl = checkPathParsed(pastedUrl);
        }
        var dataUrlData = baseUrl + "/data";

        $.ajax({
          url: dataUrlData,
          dataType: 'json',
          crossDomain: true,
          success: function (result) {
            if (result.type === 'product_page') {
              if (!data[field]) {
                data[field] = [];
                templateData[field] = [];
              }
            }

            else {
              alert("This is not a valid document");
              createWorkspace(data.uri, collectionId, 'edit');
              return;
            }

            data[field].push({uri: result.uri});
            templateData[field].push({uri: result.uri});
            saveTopics(collectionId, data.uri, data, templateData, field, idField);

          },
          error: function () {
            console.log('No page data returned');
          }
        });
      });
    } else {
      initialiseTopics(collectionId, data, templateData, field, idField);
    }
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();

}

function resolveTopicTitle(collectionId, data, templateData, field, idField) {
  var ajaxRequest = [];
  $(templateData[field]).each(function (index, path) {
    templateData[field][index].description = {};
    var eachUri = path.uri;
    var dfd = $.Deferred();
    getPageDataTitle(collectionId, eachUri,
      success = function (response) {
        templateData[field][index].description.title = response.title;
        dfd.resolve();
      },
      error = function () {
        alert(field + ' address: ' + eachUri + ' is not found.');
        dfd.resolve();
      }
    );
    ajaxRequest.push(dfd);
  });

  $.when.apply($, ajaxRequest).then(function () {
    refreshTopics(collectionId, data, templateData, field, idField);
  });
}

function saveTopics (collectionId, path, data, templateData, field, idField) {
  postContent(collectionId, path, JSON.stringify(data),
    success = function (response) {
      console.log("Updating completed " + response);
      Florence.Editor.isDirty = false;
      resolveTopicTitle(collectionId, data, templateData, field, idField);
      refreshPreview(path);
      var iframeEvent = document.getElementById('iframe').contentWindow;
      iframeEvent.addEventListener('click', Florence.Handler, true);
    },
    error = function (response) {
      if (response.status === 400) {
        alert("Cannot edit this page. It is already part of another collection.");
      }
      else {
        handleApiError(response);
      }
    }
  );
}

