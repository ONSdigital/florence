function editRelated (collectionId, data, templateData, field, idField) {
  var list = templateData[field];
  if (idField === 'article') {
    var dataTemplate = {list: list, idField: idField, idPlural: 'articles'};
  } else if (idField === 'bulletin') {
    var dataTemplate = {list: list, idField: idField, idPlural: 'bulletins'};
  } else if (idField === 'dataset') {
    var dataTemplate = {list: list, idField: idField, idPlural: 'datasets'};
  } else if (idField === 'document') {
    var dataTemplate = {list: list, idField: idField, idPlural: 'documents'};
  } else if (idField === 'methodology') {
    var dataTemplate = {list: list, idField: idField, idPlural: 'methodologies'};
  } else {
    var dataTemplate = {list: list, idField: idField};
  }
  var html = templates.editorRelated(dataTemplate);
  $('#'+ idField).replaceWith(html);
  // Load
  if (!data[field] || data[field].length === 0) {
    editRelated['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index, value) {
      editRelated['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        var result = confirm("Are you sure you want to delete this link?");
        if (result === true) {
          var position = $(".workspace-edit").scrollTop();
          localStorage.setItem("pagePos", position);
          $(this).parent().remove();
          data[field].splice(index, 1);
          postContent(collectionId, data.uri, JSON.stringify(data),
            success = function (response) {
              Florence.Editor.isDirty = false;
              refreshPreview(data.uri);
              editRelated (collectionId, data, field, idField);
            },
            error = function (response) {
              if (response.status === 400) {
                alert("Cannot edit this file. It is already part of another collection.");
              }
              else if (response.status === 401) {
                alert("You are not authorised to update content.");
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
  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    localStorage.setItem("pagePos", position);
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(data.uri, collectionId, '', true);

    $('#sortable-' + idField).append(
        '<div id="' + editRelated['lastIndex' + field] + '" class="edit-section__sortable-item">' +
        '  <textarea id="' + idField + '-uri_' + editRelated['lastIndex' + field] + '" placeholder="Go to the related data and click Get"></textarea>' +
        '  <button class="btn-page-get" id="' + idField + '-get_' + editRelated['lastIndex' + field] + '">Get</button>' +
        '  <button class="btn-page-cancel" id="' + idField + '-cancel_' + editRelated['lastIndex' + field] + '">Cancel</button>' +
        '</div>').trigger('create');

    $('#' + idField + '-cancel_' + editRelated['lastIndex' + field]).one('click', function () {
      createWorkspace(data.uri, collectionId, 'edit');
    });

    $('#' + idField + '-get_' + editRelated['lastIndex' + field]).one('click', function () {
      var pastedUrl = $('#' + idField + '-uri_'+editRelated['lastIndex' + field]).val();
      if (pastedUrl) {
        checkPathParsed(pastedUrl);
        var dataUrlData = pastedUrl + "/data";
      } else {
        var dataUrl = getPathNameTrimLast();
        checkPathParsed(dataUrl);
        var dataUrlData = dataUrl + "/data";
      }

      $.ajax({
        url: dataUrlData,
        dataType: 'json',
        crossDomain: true,
        success: function (result) {
          if ((field === 'relatedBulletins' || field === 'statsBulletins') && result.type === 'bulletin') {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if (field === 'relatedArticles' && result.type === 'article') {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if ((field === 'relatedDocuments') && (result.type === 'article' || result.type === 'bulletin')) {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset' || result.type === 'reference_tables')) {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if ((field === 'items') && (result.type === 'timeseries')) {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if ((field === 'relatedData') && (result.type === 'timeseries' || result.type === 'dataset' || result.type === 'reference_tables')) {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else if (field === 'relatedMethodology' && result.type === 'static_methodology') {
            if (!data[field]) {
              data[field] = [];
            }
          }

          else {
            alert("This is not a valid document");
            return;
          }

          data[field].push({uri: result.uri});
          saveRelated(collectionId, data.uri, data, field, idField);

        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

