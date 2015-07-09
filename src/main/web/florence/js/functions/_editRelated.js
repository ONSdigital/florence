function editRelated (collectionId, data, field, idField) {
  // Load
  if (!data[field] || data[field].length === 0) {
    var lastIndex = 0;
  } else {
    $(data[field]).each(function (index, value) {
      var lastIndex = index + 1;

      // Delete
      $('#' + idField + '-delete_' + index).click(function () {
        $("#" + index).remove();
        data[field].splice(index, 1);
        updateContent(collectionId, getPathName(), JSON.stringify(data));
      });
    });
  }

  //Add
  $('#add-' + idField).one('click', function () {
    var pageUrl = localStorage.getItem('pageurl');
    var iframeEvent = document.getElementById('iframe').contentWindow;
        iframeEvent.removeEventListener('click', Florence.Handler, true);
    createWorkspace(pageUrl, collectionId, '', true);

    $('#sortable-' + idField).append(
        '<div id="' + lastIndex + '" class="edit-section__sortable-item">' +
        '  <textarea id="' + idField + '-uri_' + lastIndex + '" placeholder="Go to the related data and click Get"></textarea>' +
        '  <button class="btn-page-get" id="' + idField + '-get_' + lastIndex + '">Get</button>' +
        '  <button class="btn-page-cancel" id="' + idField + '-cancel_' + lastIndex + '">Cancel</button>' +
        '</div>').trigger('create');

    $('#' + idField + '-get_' + lastIndex).one('click', function () {
      var pastedUrl = $('#' + idField + '-uri_'+lastIndex).val();
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
          if (field === 'relatedBulletins' && result.type === 'bulletin') {
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

          else if ((field === 'relatedDatasets') && (result.type === 'dataset' || result.type === 'reference_tables')) {
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

    $('#' + idField + '-cancel_' + lastIndex).one('click', function () {
      createWorkspace(pageUrl, collectionId, 'edit');
    });
  });

  function sortable() {
    $('#sortable-' + idField).sortable();
  }
  sortable();
}

