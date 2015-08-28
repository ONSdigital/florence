function loadTablesList(data, collectionId) {
  var html = templates.workEditTables(data);
  $('#tables').replaceWith(html);
  initialiseTablesList(data, collectionId);
}

function refreshTablesList(data, collectionId) {
  var html = templates.workEditTables(data);
  $('#table-list').replaceWith($(html).find('#table-list'));
  initialiseTablesList(data, collectionId);
}

function initialiseTablesList(data, collectionId) {

  $(data.tables).each(function (index, table) {
    var basePath = data.uri;
    var tablePath = basePath + '/' + table.filename;
    var tableJson = tablePath;

    $("#table-edit_" + table.filename).click(function () {
      getPageData(collectionId, tableJson,
        onSuccess = function (tableData) {
          loadTableBuilder(data, function () {
            Florence.Editor.isDirty = false;
            refreshPreview();
            refreshTablesList(data, collectionId);
          }, tableData);
        })
    });

    $("#table-delete_" + table.filename).click(function () {
      var result = confirm("Are you sure you want to delete this table?");
      if (result === true) {
        $("#table_" + index).remove();
        // delete any files associated with the table.
        var extraFiles = [table.filename + '.html', table.filename + '.xls'];
        _(extraFiles).each(function (file) {
          var fileToDelete = basePath + '/' + file;
          deleteContent(collectionId, fileToDelete,
            onSuccess = function () {
            },
            onError = function (error) {
              console.log(error);
            });

          // delete the table json file
          deleteContent(collectionId, tableJson + '.json',
            onSuccess = function () {
              // remove the table from the page json when its deleted
              data.tables = _(data.tables).filter(function (item) {
                return item.filename !== table.filename
              });

              // save the updated page json
              postContent(collectionId, basePath, JSON.stringify(data),
                success = function () {
                  Florence.Editor.isDirty = false;
                  refreshTablesList(data, collectionId);
                }
              );
            }
          );
        });
      }
    });
  });
}