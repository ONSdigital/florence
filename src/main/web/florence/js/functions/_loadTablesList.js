function loadTablesList(data, collectionId) {
  var html = templates.workEditTables(data);
  $('#tables').replaceWith(html);

  $(data.tables).each(function (index, table) {

    var basePath = getPathName();
    var tablePath = basePath + '/' + table.filename;
    var tableJson = tablePath + '.json';

    $("#table-edit_" + table.filename).click(function () {
      getPageData(collectionId, tableJson,
        onSuccess = function (tableData) {
          loadTableBuilder(tableData, function () {
            refreshPreview();
          }, tableData);
        })
    });

    $("#table-delete_" + table.filename).click(function () {
      $("#table_" + index).remove();

      getPageData(collectionId, tableJson,
        onSuccess = function (tableData) {

          // delete any files associated with the table.
          _(tableData.files).each(function (file) {
            var fileToDelete = basePath + '/' + file.filename;
            deleteContent(collectionId, fileToDelete,
              onSuccess = function () {
                console.log("deleted table file: " + fileToDelete)
              });
          });

          // delete the table json file
          deleteContent(collectionId, tableJson,
            onSuccess = function () {

              // remove the table from the page json when its deleted
              data.tables = _(data.tables).filter(function (item) {
                return item.filename !== table.filename
              });

              // save the updated page json
              postContent(collectionId, basePath, JSON.stringify(data),
                success = function () {
                  Florence.Editor.isDirty = false;
                  refreshPreview();
                  loadTablesList(data, collectionId);
                });
            });
        });
    });
  });
}