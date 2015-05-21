function loadChartBuilder(pageData, onSave, chart) {
  var chart = chart;
  var pageUrl = localStorage.getItem('pageurl');
  var html = templates.chartBuilder(chart);
  var table = false;
  $('body').append(html);
  $('.chart-builder').css("display", "block");

  if (chart) {
    $('#chart-data').val(toTsv(chart));
  }

  if (chart.type === 'barline') {
  data = editBarline(chart);
  var html = templates.chartEditBarlines(data);
  $('#barline').html(html);
  }

  function editBarline (chart) {
    var data = [];
    var series = _.keys(chart.types);
    var type = _.values(chart.types);
    for (var i = 0; i < chart.series.length; i += 1) {
      data.push({series: series[i], type: type[i],
        isChecked: (function () {
          var checked = _.indexOf(chart.groups[0], series[i]);
          if (checked < 0) {
            return checked = false;
          } else {
            return checked = true;
          }
        })()
      });
    }
    return data;
  }

  checkSeries();
  renderChart();

  $('#edit-chart :input').on('input', function () {
    checkSeries(true);
    renderChart();
  });

  // create series selector
  function checkSeries (reload) {
    if (reload) {
      var valueSelected = $('#chart-type').val();
      if (valueSelected === 'barline') {
        chart = buildChartObject();
        data = editBarline(chart);
        var html = templates.chartEditBarlines(data);
        $('#barline').html(html);
        // add new listeners
        $('#barline').off();
        $('#barline').on('change', function (e) {
          renderChart();
        });
      } else {
        $('#barline').empty();
      }
    } else {
      $('#chart-type').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        if (valueSelected === 'barline') {
          chart = buildChartObject();
          if (!chart.types) {
            data = chart.series;
            var html = templates.chartBuilderBarlines(data);
            $('#barline').html(html);
          } else {
            data = editBarline(chart);
            var html = templates.chartEditBarlines(data);
            $('#barline').html(html);
          }
          // add new listeners
          $('#barline').off();
          $('#barline').on('change', function (e) {
            renderChart();
          });
        } else {
          $('#barline').empty();
        }
      });
    }
  }

  $('.btn-chart-builder-cancel').on('click', function () {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-png').on('click', function () {

    var preview = $('#chart');
    var chartHeight = preview.width() * chart.aspectRatio;
    var chartWidth = preview.width();

    if (chartHeight > preview.height()) {
      chartHeight = preview.height();
      chartWidth = preview.height() / chart.aspectRatio;
    }

    $('body').append('<canvas id="svg-canvas" width="' + chartWidth + '" height="' + chartHeight + '"></canvas><img id="svg-img">');

    var content = exportToSVG().trim();
    console.log(content);

    var canvas = $('#svg-canvas').get(0);
    // Draw svg on canvas
    canvg(canvas, content);
    // Change img be SVG representation
    var theImage = canvas.toDataURL('image/png');
    $('#svg-img').attr('src', theImage);
  });


  $('.btn-chart-builder-create').on('click', function () {

    if (!pageData.charts) {
      pageData.charts = []
    } else {
      if (_.find(pageData.charts, function (existingChart) {
          return existingChart.filename === chart.filename
        })) {
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
            }
          });
        }

        pageData.charts.push({title: chart.title, filename: chart.filename});
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

//      preview.empty();
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

  function buildChartObject() {
    var json = $('#chart-data').val();
    if (!chart) {
      chart = {};
    }
    chart.type = $('#chart-type').val();
    if (chart.type === 'table') {
      table = true;
    } else {
      table = false;
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

    if (chart.type === 'barline') {
      if (!chart.types) {
        var types = {};
        var groups = [];
        var group = [];
        var seriesData = chart.series;
        for(var i=0; i<seriesData.length; i++) {
          types[seriesData[i]] = $('#types_' + i).val() || 'bar';
        }
        (function () {
          $('#barline input:checkbox:checked').each(function(){
            group.push($(this).val());
          });
        groups.push(group);
        return groups;
        })();
        chart.types = types;
        chart.groups = groups;
      }
    }
    console.log(chart)
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

      if(chart.hasYear) {
        chart.period = 'year';
      } else if(chart.hasQuarter) {
        chart.period = 'quarter';
      } else if(chart.hasMonth) {
        chart.period = 'month';
      } else {
        chart.isTimeSeries = false;
      }
      chart.type = 'line';
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

  function toTsv(data) {
    var output = "";

    for (var i = 0; i < data.headers.length; i++) {
      if (i === data.headers.length - 1) {
        output+= data.headers[i];
      } else {
        output+= data.headers[i] + "\t";
      }
    }

    for (var i = 0; i < data.categories.length; i++) {
      output+= "\n" + toTsvLine(data.data[i], data.headers);
    }

    return output;
  }

  function toTsvLine(data, headers) {

    var output = "";

    for (var i = 0; i < headers.length; i++) {
      if (i === headers.length - 1) {
        output += data[headers[i]];
      } else {
        output += data[headers[i]] + "\t";
      }
    }
    return output;
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

  function tsvJSONHeaders(input) {
    var lines = input.split("\n");
    var headers = lines[0].split("\t");
    return headers;
  }

  function exportToSVG() {
    var svgContainer = $('#chart');
    var svg = svgContainer.find('svg');

    var styleContent = "\n";
    for (var i = 0; i < document.styleSheets.length; i++) {
      str = document.styleSheets[i].href.split("/");
      if (str[str.length - 1] == "c3.css") {
        var rules = document.styleSheets[i].rules;
        for (var j = 0; j < rules.length; j++) {
          styleContent += (rules[j].cssText + "\n");
        }
        break;
      }
    }

    //var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    //$(style).textContent += "\n<![CDATA[\n" + styleContent + "\n]]>\n";
    //
    //svg.prepend(style);
    //svg[0].getElementsByTagName("defs")[0].appendChild(style);


    svg.prepend("\n<style type='text/css'></style>");
    svg.find("style").textContent += "\n<![CDATA[" + styleContent + "]]>\n";


    //if ($('#chart-type').val() === 'line') {
    //  $('.c3 line').css("fill", "none");
    //  console.log($('.c3 line'))
    //}

    var source = (new XMLSerializer).serializeToString(svg[0]);
    console.log(source);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    //add padding
    source = source.replace(/style="overflow: hidden;"/, 'style="overflow: hidden; padding: 50px;"');

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
    for (i = 0; i < timeSeries.length; i++) {
      if (timeSeries[i]['period'] === period) {
        return true;
      }
    }
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

