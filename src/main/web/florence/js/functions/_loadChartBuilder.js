function loadChartBuilder(pageData, onSave, chart) {

  var pageUrl = localStorage.getItem('pageurl');
  var table = false;
  var html = templates.chartBuilder();
  $('body').append(html);
  $('.chart-builder').css("display", "block");

  if(chart) {
    populateForm(chart);
  }

  renderChart();

  $('.chart-builder :input').on('input', function () {
    renderChart();
  });

  $('.btn-chart-builder-cancel').on('click', function () {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-builder-create').on('click', function () {

    if(!pageData.charts) {
      pageData.charts = []
    } else {
      if (_.find(pageData.charts, function(existingChart) {
          return existingChart.filename === chart.filename })) {
        alert("A chart with this name already exists.");
        return;
      }
    }

    var uriUploadJSON = pageUrl + "/" + chart.filename + ".json";
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + uriUploadJSON,
      type: "POST",
      data: JSON.stringify(buildChartObject()),
      processData: false,
      contentType: false,
      success: function (res) {
        console.log("JSON uploaded successfully");
        console.log(res)
        if (!table) {
          var uriUploadSVG = pageUrl + "/" + chart.filename + ".svg";
            $.ajax({
              url: "/zebedee/content/" + Florence.collection.id + "?uri=" + uriUploadSVG,
              type: "POST",
              data: exportToSVG(),
              processData: false,
              contentType: false,
              success: function (res) {
                console.log("SVG uploaded successfully");
//              pageData.charts.push({title:chart.title, filename:chart.filename});
//              if (onSave) {
//                onSave(chart.filename, '<ons-chart path="' + getPathName() + '/' + chart.filename + '" />');
//              }
//              $('.chart-builder').stop().fadeOut(200).remove();
            }
          });
        }
        pageData.charts.push({title:chart.title, filename:chart.filename});
        if (onSave) {
          onSave(chart.filename, '<ons-chart path="' + getPathName() + '/' + chart.filename + '" />');
        }
        $('.chart-builder').stop().fadeOut(200).remove();
      }
    });
  });

  // Builds, parses, and renders our chart in the chart editor
  function renderChart() {
    chart = buildChartObject();
    if (table) {
      $('#preview-chart').empty();
      $('#preview-chart').html('<div id="dataTable"></div>');
      drawTable(chart);
    } else {
      parseChartObject(chart);

      var preview = $('#preview-chart');

      preview.empty();
      preview.html('<div id="chart"></div>');

      var chartHeight = preview.width() * chart.aspectRatio;
      var chartWidth = preview.width();

      if (chartHeight > preview.height()) {
        chartHeight = preview.height();
        chartWidth = preview.height() / chart.aspectRatio;
      }
      renderChartObject('#chart', chart, chartHeight, chartWidth);
    }
  }

  function populateForm(chart) {
    $('#chart-title').val(chart.title);
  }

  function buildChartObject() {
    json = $('#chart-data').val();

    var chart = {};
    chart.type = $('#chart-type').val();
    if (chart.type === 'table') {
      table = true;
    } else {
      table = false;
    }
    if (chart.type === 'rotated') {
      chart.type = 'bar';
      chart.rotated = true;
    }
    chart.period = $('#chart-period').val();

    chart.title = $('#chart-title').val();
    chart.filename = chart.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    chart.subtitle = $('#chart-subtitle').val();
    chart.unit = $('#chart-unit').val();

    chart.source = $('#chart-source').val();

    chart.legend = $('#chart-legend').val();
    chart.hideLegend = (chart.legend === 'false') ? true : false;

//      console.log(chart.legend + " " + chart.hideLegend);

    if (chart.title === '') {
      chart.title = '[Title]'
    }

    chart.filename = chart.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

      chart.data = tsvJSON(json);
      chart.headers = tsvJSONHeaders(json);
      chart.series = tsvJSONColNames(json);
      chart.categories = tsvJSONRowNames(json);

    chart.aspectRatio = $('#aspect-ratio').val();

    return chart;
  }

  // Transformations to determine render options for this chart
  // example - is it a time chart - should we flip axes
  function parseChartObject(chart) {

    // Determine if we have a time series
    var timeSeries = axisAsTimeSeries(chart.categories);
    if (timeSeries && timeSeries.length > 0) {
      chart.isTimeSeries = true;
      chart.timeSeries = timeSeries;

      // Subseries
      chart.hasYear = timeSeriesHasPeriod(timeSeries, 'year');
      chart.hasQuarter = timeSeriesHasPeriod(timeSeries, 'quarter');
      chart.hasMonth = timeSeriesHasPeriod(timeSeries, 'month');
      chart.hasOtherPeriod = timeSeriesHasPeriod(timeSeries, 'other');

    } else {
      chart.isTimeSeries = false;
    }
  }


// Data load from text box functions
  function tsvJSON(input) {
    var lines = input.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      if (!table) {
        var currentline = lines[i].split(",").join("").split("\t");
      } else {
        var currentline = lines[i].split("\t");
      }
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result; //JSON
  }

  function tsvJSONRowNames(input) {
    var lines = input.split("\n");
    var result = [];

    for (var i = 1; i < lines.length; i++) {
      var currentline = lines[i].split("\t");
      result.push(currentline[0]);
    }
    return result
  }

  function tsvJSONColNames(input) {
    var lines = input.split("\n");
    var headers = lines[0].split("\t");
    headers.shift();
    return headers;
  }
  
  function tsvJSONHeaders (input) {
    var lines=input.split("\n");
    var headers=lines[0].split("\t");
    return headers;
  }

  function exportToSVG() {
    var tmp = document.getElementById('chart');
    var svg = tmp.getElementsByTagName('svg')[0];

    var source = (new XMLSerializer).serializeToString(svg);

//    $(source).find('class="c3-grid"')

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    return source;
  }


// Steps through time series points
  function axisAsTimeSeries(axis) {
    var result = [];
    var rowNumber = 0;

    _.each(axis, function (tryTimeString) {
      var time = convertTimeString(tryTimeString);
      if (time) {
        time.row = rowNumber;
        rowNumber = rowNumber + 1;

      result.push(time);
    } else {
      return null;
    }
  });
  return result;
}

  function timeSeriesHasPeriod(timeSeries, period) {
    // Period is one of ['year', 'quarter', 'month', 'other']
    _.each(timeSeries, function (time) {
      if (time['period'] == period) {
        return true;
      }
    });
    return false;
  }

  function convertTimeString(timeString) {
    // First time around parse the time string according to rules from regular timeseries
    var result = {};
    result.label = timeString;

    // Format of year only
    var yearVal = tryYear(timeString);
    if (yearVal) {
      result.date = yearVal;
      result.period = 'year';
      return result;
    }

    // Format with year and quarter
    var quarterVal = tryQuarter(timeString);
    if (quarterVal) {
      result.date = quarterVal;
      result.period = 'quarter';
      return result;
    }

    // Format with year and month
    var monthVal = tryMonth(timeString);
    if (monthVal) {
      result.date = monthVal;
      result.period = 'month';
      return result;
    }

    // Other format
    var date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      result.date = monthVal;
      result.period = 'other';
      return result;
    }

    return (null);
  }

  function tryYear(tryString) {
    var base = tryString.trim();
    if (base.length !== 4) {
      return null;
    }

    var date = new Date(tryString);

    return date;
  }

  function tryQuarter(tryString) {
    var indices = [0, 1, 2, 3];
    var quarters = ["Q1", "Q2", "Q3", "Q4"];
    var months = ["Jan", "Apr", "Jul", "Oct"];

    var quarter = _.find(indices, function (q) {
      return (tryString.indexOf(quarters[q]) > -1)
    });
    if (quarter !== undefined) {
      var dateString = tryString.replace(quarters[quarter], months[quarter]);
      return new Date(dateString);
    }
  }

  function tryMonth(tryString) {
    var date = new Date(tryString);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  function drawTable(data) {
    var title = data.headers;
    var rows = data.data;
    drawTitles(title);
    for (var i = 0; i < rows.length; i++) {
      drawRow(rows[i]);
    }

    function drawTitles(title) {
      var row = $("<tr />");
      $("#dataTable").append(row);
      for (var j = 0; j < title.length; j++) {
        row.append($("<th>" + title[j] + "</th>"));
      }
    }

    function drawRow(rowData) {
      var row = $("<tr />")
      $("#dataTable").append(row);
      for (var j = 0; j < title.length; j++) {
        row.append($("<td>" + rowData[title[j]] + "</td>"));
      }
    }
  }
}
