// fully load the charts list from scratch
function loadChartsList(collectionId, data) {
  var html = templates.workEditCharts(data);
  $('#charts').replaceWith(html);
  initialiseChartList(collectionId, data);
}

// refresh only the list of charts - leaving the container div that accordion works from.
function refreshChartList(collectionId, data) {
  var html = templates.workEditCharts(data);
  $('#chart-list').replaceWith($(html).find('#chart-list'));
  initialiseChartList(collectionId, data);
}

// do all the wiring up of buttons etc once the template has been rendered.
function initialiseChartList(collectionId, data) {

  $(data.charts).each(function (index, chart) {

    var basePath = data.uri;
    var chartPath = basePath + '/' + chart.filename;
    var chartJson = chartPath;

    var client = new ZeroClipboard($("#chart-copy_" + index));
    client.on("copy", function (event) {
      var clipboard = event.clipboardData;
      clipboard.setData("text/plain", $('#chart-to-be-copied_' + index).text());
    });

    $("#chart-edit_" + index).click(function () {
      getPageData(collectionId, chartJson,
        onSuccess = function (chartData) {

          loadChartBuilder(data, function () {
            refreshPreview();

            putContent(collectionId, basePath, JSON.stringify(data),
              success = function () {
                Florence.Editor.isDirty = false;
                refreshPreview();
                refreshChartList(collectionId, data);
              },
              error = function (response) {
                handleApiError(response);
              }
            );
          }, chartData);
        })
    });

    $("#chart-delete_" + index).click(function () {
      swal({
        title: "Warning",
        text: "Are you sure you want to delete this chart?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        closeOnConfirm: false
      }, function (result) {
        if (result === true) {
          $(this).parent().remove();
          data.charts = _(data.charts).filter(function (item) {
            return item.filename !== chart.filename
          });
          putContent(collectionId, basePath, JSON.stringify(data),
            success = function () {
              deleteContent(collectionId, chartJson + '.json', onSuccess = function () {
              }, onError = function () {
              });
              Florence.Editor.isDirty = false;
              swal({
                title: "Deleted",
                text: "This chart has been deleted",
                type: "success",
                timer: 2000
              });
              refreshChartList(collectionId, data);
            },
            error = function (response) {
              handleApiError(response);
            }
          );
        }
      });
    });
  });
  // Make sections sortable
  function sortable() {
    $('#sortable-chart').sortable();
  }

  sortable();
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}


