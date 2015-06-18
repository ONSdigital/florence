function loadChartsList(data, collectionId) {
  var html = templates.workEditCharts(data);
  $('#charts').replaceWith(html);

  $(data.charts).each(function (index, chart) {

    var basePath = getPathName();
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
              },
              error = function (response) {
                handleApiError(response);
              }
            );
          }, chartData);
        },
        onError = function (response) {
          handleApiError(response);
        }
      )
    });

    $("#chart-delete_" + chart.filename).click(function () {
      $("#chart_" + index).remove();

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
            },
            error = function (response) {
              handleApiError(response);
            }
          );
          deleteContent(collectionId, chartPath + '.png');
        },
        onError = function (response) {
          handleApiError(response)
        });
    });
  });
}