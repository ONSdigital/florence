function loadTablesList(data, collectionId) {
  var html = templates.workEditTables(data);
  $('#tables').html(html);

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
        },
        onError = function (response) {
          handleApiError(response);
        }
      )
    });

    $("#table-delete_" + table.filename).click(function () {
      $("#table_" + index).remove();

      deleteContent(collectionId, tableJson,
        onSuccess = function () {
          data.tables = _(data.tables).filter(function (item) {
            return item.filename !== table.filename
          });
          postContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              Florence.Editor.isDirty = false;
              refreshPreview();
              loadTablesList(data, collectionId);
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        },
        onError = function (response) {
          handleApiError(response)
        });
    });
  });
}