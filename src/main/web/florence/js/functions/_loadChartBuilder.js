function loadChartBuilder(pageData, onSave, chart) {
  var chart = chart;
  var pageUrl = pageData.uri;
  var html = templates.chartBuilder(chart);
  $('body').append(html);
  $('.chart-builder').css("display", "block");

  if (chart) {
    $('#chart-data').val(toTsv(chart));
    refreshBarLineSection();
  }

  renderChart();

  function refreshBarLineSection() {
    var data = editBarline(chart);
    var html = templates.chartEditBarlines(data);
    $('#barline').html(html);
  }

  function editBarline(chart) {
    var data = [];
    var series = chart.series;

    if (chart.chartType === 'barline') { // if we have a bar line we want to populate the entries for each series
      if (chart.chartTypes) { // if we have existing types use them
        var type = _.values(chart.chartTypes);
        $.each(chart.series, function(index) {
          data.push({
            series: series[index],
            type: type[index],
            isChecked: (function() {
              var checked = _.indexOf(chart.groups[0], series[index]);
              return checked >= 0;
            })()
          });
        });
      } else { // if we have no existing types, default them
        $.each(chart.series, function(index) {
          data.push({
            series: series[index],
            type: '',
            isChecked: false
          });
        });
      }
    }
    return data;
  }


  $('#edit-chart').on('input change', ':input', function() {
    chart = buildChartObject();
    refreshBarLineSection();
    renderChart();
  });

  $('.btn-chart-builder-cancel').on('click', function() {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-builder-create').on('click', function() {

    chart = buildChartObject();

    var jsonPath = chart.uri + ".json";
    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + jsonPath,
      type: 'POST',
      data: JSON.stringify(chart),
      processData: false,
      contentType: 'application/json',
      success: function(res) {
        //generatePng('#chart', '#hiddenCanvas');
        //renderDownloadChart();
        //generatePng('#hiddenSvgForDownload', '#hiddenCanvasForDownload', '-download');

        if (!pageData.charts) {
          pageData.charts = []
        }

        existingChart = _.find(pageData.charts, function(existingChart) {
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

  // Builds, parses, and renders our chart in the chart editor
  function renderChart() {
    chart = buildChartObject();
    $('#preview-chart').empty();

    var preview = $('#preview-chart');
    var previewHtml = templates.chartBuilderPreview(chart);
    preview.html(previewHtml);

    var chartHeight = preview.width() * chart.aspectRatio;
    var chartWidth = preview.width();

    renderChartObject('chart', chart, chartHeight, chartWidth);

    if (chart.notes) {
      if (typeof Markdown !== 'undefined') {
        var converter = new Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, {
          extensions: "all"
        });
        var notes = converter.makeHtml(chart.notes);
        preview.append(notes);
      }
    }
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

    if (chart.title === '') {
      chart.title = '[Title]'
    }

    chart.data = tsvJSON(json);
    chart.headers = tsvJSONHeaders(json);
    chart.series = tsvJSONColNames(json);
    chart.categories = tsvJSONRowNames(json);

    chart.aspectRatio = $('#aspect-ratio').val();

    if (chart.chartType === 'barline') {
      var types = {};
      var groups = [];
      var group = [];
      var seriesData = chart.series;
      $.each(seriesData, function(index) {
        types[seriesData[index]] = $('#types_' + index).val() || 'bar';
      });
      (function() {
        $('#barline input:checkbox:checked').each(function() {
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

  function parseChartObject(chart) {

    // Determine if we have a time series
    var timeSeries = axisAsTimeSeries(chart.categories);
    if (timeSeries && timeSeries.length > 0) {
      chart.isTimeSeries = true;

      // We create data specific to time
      timeData = [];
      _.each(timeSeries, function(time) {
        var item = chart.data[time['row']];
        item.date = time['date'];
        item.label = time['label'];
        timeData.push(item);
      });

      chart.timeSeries = timeData;
    }
  }

  //// Do the rendering
  function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

    var chartType = checkType(chart.chartType);
    var stacked = false;

    var series = [];
    $.each(chart.series, function(i, seriesName) {

      var seriesType = chartType;
      if (chart.chartType === 'barline') {
        seriesType = checkType(chart.chartTypes[seriesName]);
      }

      var data = [];
      $.each(chart.data, function(j, seriesData) {
        var value = parseFloat(seriesData[seriesName]);
        if (isNaN(value)) {
          value = null;
        }

        //if(chart.isTimeSeries) { // type = line?
        //  var date = new Date(seriesData['date']);
        //  //data.push([Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDay()),value])
        //  data.push([Date.UTC(date.getFullYear(), date.getMonth()),value])
        //} else {
        data.push(value)
          //}
      });

      var seriesItem = {
        name: seriesName,
        data: data,
        type: seriesType
      };

      if (chart.chartType === 'barline') {
        if ($.inArray(seriesName, chart.groups[0]) > -1) {
          seriesItem.stack = 'group1'; // we only support one group.
          stacked = true;
        } else {
          seriesItem.stack = seriesName; // set a unique stack group to not stack
        }
      }

      series.push(seriesItem);
    });

    //var marginTop = 35; // todo: if type = bar set to 0
    var yAxis = {
      title: {
        text: chart.unit,
        align: "high"
      }
    };
    var labels = {};

    // typically do not use the chart label on y axis, just overlay a label with the unit inside the chart area.
    if (chart.chartType !== 'rotated') {
      yAxis = {
        title: {
          text: ''
        },
        lineWidth: 1
      };

      labels = {
        items: [{
          html: chart.unit,
          style: {
            left: '0px',
            top: '0px'
          }
        }]
      }
    }

    var xAxis = {
      categories: chart.categories,
      tickInterval: chart.labelInterval
    };

    if (chart.chartType === 'line') {
      xAxis.tickmarkPlacement = 'on';
      var interval = chart.labelInterval || 1;
      //start from last data when rendering ticks and labels, decrement interval to go backward
      if (interval > 1) {
        xAxis.tickPositioner = function() {
          console.debug("Positioning");
          var positions = [];
          var tick = Math.floor(this.dataMax);
          console.debug(this.dataMax);
          for (tick; tick >= this.dataMin; tick -= interval) {
            positions.push(tick);
          }
          return positions;
        };
      }
    }


    //if(chart.isTimeSeries) {
    //  xAxis = {
    //    type: 'datetime'
    //  }
    //}

    // render chart
    var options = {
      chart: {
        renderTo: bindTag,
        height: chartHeight,
        width: chartWidth,
        marginRight:35
      },
      colors: ['#274796', '#F5942F', '#E73F40', '#7BCAE2', '#979796', '#E9E117', '#74B630', '#674796', '#BD5B9E'],
      title: {
        text: ''
      },
      labels: labels,
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
      plotOptions: {
        series: {
          animation: false,
          pointPadding: 0,
          groupPadding: 0.1
        },
        line: {
          lineWidth: 1,
          marker: {
            radius: 2,
            symbol: 'circle'
          }
        }
      },
      legend: {
        verticalAlign: "top",
        enabled: (series.length > 1)
      },
      tooltip: {
        valueDecimals: chart.decimalPlaces,
        shared: true
      },
      credits: {
        enabled: false
      }
    };

    if (stacked) {
      options.plotOptions.column = {
        stacking: 'normal'
      }
    }

    var chart = new Highcharts.Chart(options);

    function checkType(chartType) {

      if (chartType === 'rotated') {
        type = 'bar';
        return type;
      } else if (chartType === 'barline') {
        type = 'column';
        return type;
      } else if (chartType === 'bar') {
        type = 'column';
        return type;
      } else {
        return type = chartType;
      }


      //"stackedArea">Stacked Area</option>
      //<option value="stackedPercent">Stacked Percent</option>
      //<option value="pyramid">Pyram
    }

    function renderTimeseriesChartObject(bindTag, timechart, chartWidth, chartHeight) {
      var chart = timechart; //timeSubchart(timechart, period);

      // Create a dictionary so we can reverse lookup a tooltip label
      //var dates_to_label = {};
      //_.each(chart.timeSeries, function (data_point) {
      //  data_point.date = new Date(data_point.date);
      //  dates_to_label[data_point.date] = data_point.label;
      //});

      // should we show
      var showPoints = true;
      if (chart.data.length > 100) {
        showPoints = false;
      }

      // refers to the issue of time axes not being applicable to non continuous charts
      var axisType;
      var keys;

      if (chart.chartType == 'line') { // continuous line charts
        axisType = {
          label: chart.xaxis,
          type: 'timeseries',
        }

        var monthsOnTimeline = (chart.timeSeries[chart.timeSeries.length - 1].date - chart.timeSeries[0].date) / (1000 * 60 * 60 * 24 * 30);
        var tick = {
          format: function(x) {
            return x.getFullYear();
          }
        }
        if (monthsOnTimeline <= 24.5) {
          tick = {
            format: function(x) {
              return formattedMonthYear(x);
            }
          }
        }


        axisType.tick = tick;
        keys = {
          x: 'date',
          value: chart.series
        }
      } else { // bar charts and other
        axisType = {
          label: chart.xaxis,
          type: 'category',
          categories: chart.categories
        }
        keys = {
          x: 'label',
          value: chart.series
        }
      }

      c3.generate({
        bindto: bindTag,
        size: {
          height: chartHeight,
          width: chartWidth
        },
        padding: {
          right: 15
        },
        data: {
          json: chart.timeSeries,
          keys: keys,
          type: chart.chartType,
          xFormat: '%Y-%m-%d %H:%M:%S',
          //colors: getColours(chart.series)
        },

        point: {
          show: showPoints
        },

        legend: {
          hide: chart.hideLegend,
          position: 'inset',
          inset: {
            anchor: chart.legend,
            x: 10,
            y: yOffset
          }
        },

        axis: {
          x: axisType
        },
        tooltip: {
          format: {
            title: function(x) {
              return dates_to_label[x];
            }
          }
        },
        grid: {
          y: {
            show: true
          }
        },
        tooltip: {
          format: {
            value: function(value, ratio, id, index) {
              if (chart.decimalPlaces == null) {
                return value;
              } else {
                return parseFloat(Math.round(value * Math.pow(10, chart.decimalPlaces)) / Math.pow(10, chart.decimalPlaces)).toFixed(chart.decimalPlaces);
              }
            }
          }
        }
      });
    }

    function formattedMonthYear(date) {
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];

      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return monthNames[monthIndex] + " " + year;
    }
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

    _.each(axis, function(tryTimeString) {
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
      success: function(res) {
        //console.log('png uploaded!');
      }
    });
  }
}