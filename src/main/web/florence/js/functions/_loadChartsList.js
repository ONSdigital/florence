function loadChartsList(data, collectionId) {
  var html = templates.workEditCharts(data);
  $('#charts').replaceWith(html);

  $(data.charts).each(function (index, chart) {

    var basePath = data.uri;
    var chartPath = basePath + '/' + chart.filename;
    var chartJson = chartPath + '.json';

    $("#chart-edit_" + chart.filename).click(function () {
      getPageData(collectionId, chartJson,
        onSuccess = function (chartData) {

          loadChartBuilder(data, function () {
            refreshPreview();

            postContent(collectionId, basePath, JSON.stringify(data),
              success = function () {
                Florence.Editor.isDirty = false;
                refreshPreview();
                loadChartsList(data, collectionId);
              });
          }, chartData);
        })
    });

    $("#chart-delete_" + chart.filename).click(function () {
      $("#chart_" + index).remove();

      getPageData(collectionId, chartJson,
        onSuccess = function (chartData) {

          // delete any files associated with the table.
          _(chartData.files).each(function (file) {
            var fileToDelete = basePath + '/' + file.filename;
            deleteContent(collectionId, fileToDelete);
          });

          deleteContent(collectionId, chartJson,
            onSuccess = function () {
              data.charts = _(data.charts).filter(function (item) {
                return item.filename !== chart.filename
              });
              postContent(collectionId, basePath, JSON.stringify(data),
                success = function () {
                  Florence.Editor.isDirty = false;
                  refreshPreview();
                  loadChartsList(data, collectionId);
                });
            });
        });
    });
  });
}