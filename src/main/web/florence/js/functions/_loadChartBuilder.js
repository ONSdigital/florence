function loadChartBuilder(pageData, onSave, chart) {
  var chart = chart;
  var pageUrl = pageData.uri;
  var html = templates.chartBuilder(chart);
  $('body').append(html);
  $('.chart-builder').css("display", "block");

  if (chart) {
    $('#chart-data').val(toTsv(chart));
    refreshExtraOptions();
  }

  renderText();
  renderChart();

  function refreshExtraOptions() {
    var template = getExtraOptionsTemplate(chart.chartType);
    if (template) {
      var html = template(chart);
      $('#extras').html(html);
    } else {
      $('#extras').empty();
    }
  }

  function getExtraOptionsTemplate(chartType) {
    switch (chartType) {
      case 'barline':
      case 'rotated-barline':
        return templates.chartEditBarlineExtras;
      case 'dual-axis':
        return templates.chartEditDualAxisExtras;
      case 'line':
        return templates.chartEditLineChartExtras;
      default:
        return;
    }
  }

  $('.refresh-chart').on('input', function () {
    chart = buildChartObject();
    refreshExtraOptions();
    renderChart();
  });

  $('.refresh-chart').on('change', ':checkbox', function () {
    chart = buildChartObject();
    refreshExtraOptions();
    renderChart();
  });


  $('.refresh-text').on('input', function () {
    renderText();
  });

  $('.btn-chart-builder-cancel').on('click', function () {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-builder-create').on('click', function () {

    chart = buildChartObject();

    var jsonPath = chart.uri + ".json";
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + jsonPath,
      type: 'POST',
      data: JSON.stringify(chart),
      processData: false,
      contentType: 'application/json',
      success: function (res) {

        if (!pageData.charts) {
          pageData.charts = []
        }

        existingChart = _.find(pageData.charts, function (existingChart) {
          return existingChart.filename === chart.filename
        });

        if (existingChart) {
          existingChart.title = chart.title;
        } else {
          pageData.charts.push({
            title: chart.title,
            filename: chart.filename,
            uri: chart.uri
          });
        }

        if (onSave) {
          onSave(chart.filename, '<ons-chart path="' + chart.uri + '" />');
        }
        $('.chart-builder').stop().fadeOut(200).remove();
      }
    });
  });

  setShortcuts('#chart-title');
  setShortcuts('#chart-subtitle');
  setShortcuts('#chart-data');
  setShortcuts('#chart-x-axis-label');
  setShortcuts('#chart-notes');

  //Renders html outside actual chart area (title, subtitle, source, notes etc.)
  function renderText() {
    var title = doSuperscriptAndSubscript($('#chart-title').val());
    var subtitle = doSuperscriptAndSubscript($('#chart-subtitle').val());
    $('#chart-source-preview').html($('#chart-source').val());
    $('#chart-title-preview').html(title);
    $('#chart-subtitle-preview').html(subtitle);
    $('#chart-notes-preview').html(toMarkdown($('#chart-notes').val()));
  }

  function toMarkdown(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.getSanitizingConverter();
      Markdown.Extra.init(converter, {
        extensions: "all"
      });
      return converter.makeHtml(text)
    }
    return '';
  }

  function isMarkdownAvailable() {
    return typeof Markdown !== 'undefined'
  }

  function doSuperscriptAndSubscript(text) {
    if (text && isMarkdownAvailable) {
      var converter = new Markdown.Converter();
      return converter._DoSubscript(converter._DoSuperscript(text));
    }
    return text;

  }

  // Builds, parses, and renders our chart in the chart editor
  function renderChart() {
    chart = buildChartObject();
    var preview = $('#chart');
    var chartHeight = preview.width() * chart.aspectRatio;
    var chartWidth = preview.width();
    renderChartObject('chart', chart, chartHeight, chartWidth);
  }

  function buildChartObject() {
    var json = $('#chart-data').val();
    if (!chart) {
      chart = {};
    }

    chart.type = "chart";
    chart.title = $('#chart-title').val();
    chart.filename = chart.filename ? chart.filename : StringUtils.randomId(); //  chart.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

    if (Florence.globalVars.welsh) {
      if (pageUrl.match(/\/cy\/?$/)) {
        chart.uri = pageUrl + "/" + chart.filename;
      } else {
        chart.uri = pageUrl + "/cy/" + chart.filename;
      }
    } else {
      chart.uri = pageUrl + "/" + chart.filename;
    }
    chart.subtitle = $('#chart-subtitle').val();
    chart.unit = $('#chart-unit').val();
    chart.source = $('#chart-source').val();

    chart.decimalPlaces = $('#chart-decimal-places').val();
    chart.labelInterval = $('#chart-label-interval').val();

    chart.notes = $('#chart-notes').val();
    chart.altText = $('#chart-alt-text').val();
    chart.xAxisLabel = $('#chart-x-axis-label').val();
    chart.startFromZero = $('#start-from-zero').prop('checked');

    if (chart.title === '') {
      chart.title = '[Title]'
    }

    chart.data = tsvJSON(json);
    chart.headers = tsvJSONHeaders(json);
    chart.series = tsvJSONColNames(json);
    chart.categories = tsvJSONRowNames(json);

    chart.aspectRatio = $('#aspect-ratio').val();

    if (isShowBarLineSelection(chart.chartType)) {
      var types = {};
      var groups = [];
      var group = [];
      var seriesData = chart.series;
      $.each(seriesData, function (index) {
        types[seriesData[index]] = $('#types_' + index).val() || 'bar';
      });
      (function () {
        $('#extras input:checkbox:checked').each(function () {
          group.push($(this).val());
        });
        groups.push(group);
        return groups;
      })();
      chart.chartTypes = types;
      chart.groups = groups;
    }

    chart.chartType = $('#chart-type').val();

    //console.log(chart);
    parseChartObject(chart);

    chart.files = [];
    //chart.files.push({ type:'download-png', filename:chart.filename + '-download.png' });
    //chart.files.push({ type:'png', filename:chart.filename + '.png' });

    return chart;
  }

  //Determines if selected chart type is barline or rotated bar line
  function isShowBarLineSelection(chartType) {
    return (chartType === 'barline' || chartType === "rotated-barline" || chartType === "dual-axis");
  }

  function parseChartObject(chart) {

    // Determine if we have a time series
    var timeSeries = axisAsTimeSeries(chart.categories);
    if (timeSeries && timeSeries.length > 0) {
      chart.isTimeSeries = true;

      // We create data specific to time
      timeData = [];
      _.each(timeSeries, function (time) {
        var item = chart.data[time['row']];
        item.date = time['date'];
        item.label = time['label'];
        timeData.push(item);
      });

      chart.timeSeries = timeData;
    }
  }

  //// Converts chart to highcharts configuration by posting Babbage /chartconfig endpoint and to the rendering with fetched configuration
  function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

    var jqxhr = $.post("/chartconfig", {
        data: JSON.stringify(chart),
        width: chartWidth
      },
      function () {
        var chartConfig = window["chart-" + chart.filename];
        console.debug("Refreshing the chart, config:", chartConfig);
        if (chartConfig) {
          chartConfig.chart.renderTo = "chart";
          new Highcharts.Chart(chartConfig);
          delete window["chart-" + chart.filename]; //clear data from window object after rendering
        }
      }, "script")
      .fail(function (data, err) {
        console.error(err);
        console.log("Failed reading chart configuration from server", chart);
        $("#chart").empty();
      });
  }

  // Data load from text box functions
  function tsvJSON(input) {
    var lines = input.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",").join("").split("\t");

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
        output += data.headers[i];
      } else {
        output += data.headers[i] + "\t";
      }
    }

    for (var i = 0; i < data.categories.length; i++) {
      output += "\n" + toTsvLine(data.data[i], data.headers);
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

  function exportToSVG(sourceSelector) {
    var svgContainer = $(sourceSelector);
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
    //console.log(source);

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

  function convertTimeString(timeString) {
    // First time around parse the time string according to rules from regular timeseries
    var result = {};
    result.label = timeString;

    // Format time string
    // Check for strings that will turn themselves into a strange format
    twoDigitYearEnd = timeString.match(/\W\d\d$/);
    if (twoDigitYearEnd !== null) {
      year = parseInt(timeString.substr(timeString.length - 2, timeString.length));
      prefix = timeString.substr(0, timeString.length - 2).trim();

      if (year >= 40) {
        timeString = prefix + " 19" + year;
      } else {
        timeString = prefix + " 20" + year;
      }
    }

    // Check for quarters
    quarter = timeString.match(/Q\d/);
    year = timeString.match(/\d\d\d\d/);
    if ((quarter !== null) && (year !== null)) {
      months = ["February ", "May ", "August ", "November "];
      quarterMid = parseInt(quarter[0][1]);
      timeString = months[quarterMid - 1] + year[0];
    }

    // We are going with all times in a common format
    var date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      result.date = date;
      result.period = 'other';
      return result;
    }

    return (null);
  }

  function generatePng(sourceSelector, canvasSelector, fileSuffix) {

    var preview = $(sourceSelector);
    var chartHeight = preview.height();
    var chartWidth = preview.width();

    var content = exportToSVG(sourceSelector).trim();

    var $canvas = $(canvasSelector);
    $canvas.width(chartWidth);
    $canvas.height(chartHeight);

    var canvas = $canvas.get(0);

    // Draw svg on canvas
    canvg(canvas, content);

    // get data url from canvas.
    var dataUrl = canvas.toDataURL('image/png');
    var pngData = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
    //console.log(dataUrl);

    var raw = window.atob(pngData);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }

    var suffix = "";

    if (fileSuffix) {
      suffix = fileSuffix
    }

    var pngUri = pageUrl + "/" + chart.filename + suffix + ".png";
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + pngUri,
      type: 'POST',
      data: new Blob([array], {
        type: 'image/png'
      }),
      contentType: "image/png",
      processData: false,
      success: function (res) {
        //console.log('png uploaded!');
      }
    });
  }
}