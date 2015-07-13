function editRelated (collectionId, data, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    editRelated['lastIndex' + field] = 0;
  } else {
    $(data[field]).each(function (index, value) {
      editRelated['lastIndex' + field] = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        var position = $(".workspace-edit").scrollTop();
        localStorage.setItem("pagePos", position);
        $("#" + index).remove();
        data[field].splice(index, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add
  $('#add-' + idField).one('click', function () {
    var position = $(".workspace-edit").scrollTop();
    localStorage.setItem("pagePos", position);
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-' + idField).append(
        '<div id="' + editRelated['lastIndex' + field] + '" class="edit-section__sortable-item">' +
        '  <textarea id="' + idField + '-uri_' + editRelated['lastIndex' + field] + '" placeholder="Go to the related data and click Get"></textarea>' +
        '  <button class="btn-page-get" id="' + idField + '-get_' + editRelated['lastIndex' + field] + '">Get</button>' +
        '  <button class="btn-page-cancel" id="' + idField + '-cancel_' + editRelated['lastIndex' + field] + '">Cancel</button>' +
        '</div>').trigger('create');

    $('#' + idField + '-get_' + editRelated['lastIndex' + field]).one('click', function () {
      var pastedUrl = $('#' + idField + '-uri_'+editRelated['lastIndex' + field]).val();
      if (pastedUrl) {
        var myUrl = parseURL(pastedUrl);
        var dataUrlData = myUrl.pathname + "/data";
      } else {
        var dataUrl = getPathNameTrimLast();
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
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if (field === 'relatedArticles' && result.type === 'article') {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if ((field === 'relatedDocuments') && (result.type === 'article' || result.type === 'bulletin')) {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if ((field === 'relatedDatasets' || field === 'datasets') && (result.type === 'dataset' || result.type === 'reference_tables')) {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if ((field === 'items') && (result.type === 'timeseries')) {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if ((field === 'relatedData') && (result.type === 'timeseries' || result.type === 'dataset' || result.type === 'reference_tables')) {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else if (field === 'relatedMethodology' && result.type === 'static_methodology') {
            if (!data[field]) {
              data[field] = [];
            }
            data[field].push({uri: result.uri});
            saveRelated(collectionId, pageUrl, data);
          }

          else {
            alert("This is not a valid document");
          }

        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });

    $('#' + idField + '-cancel_' + editRelated['lastIndex' + field]).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

