// Do the rendering
function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

  // Create our svg
  var svg = d3.select(bindTag + " svg")
    .attr("viewBox", "0 0 " + chartWidth * 2 + " " + chartHeight * 2)
    .attr("preserveAspectRatio", "xMinYMin meet");

  // If we are talking time series skip
  if (chart.isTimeSeries && (chart.type == 'line')) {
    renderTimeseriesChartObject(bindTag, chart, chartWidth, chartHeight)
    return;
  }

  // Calculate padding at top (and left) of SVG
  var types = chart.chartType === 'barline' ? chart.chartTypes : {};
  var groups = chart.chartType === 'barline' ? chart.groups : [];
  var type = checkType(chart);
  var rotate = chart.chartType === 'rotated';
  var yLabel = chart.unit;// rotate === true ? chart.unit : '';
  var chartYOffset = 0;

  // work out position for chart legend
  var seriesCount = chart.series.length;
  var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;

  // Generate the chart

  var c3Config = {
    bindto: bindTag,
    size: {
      height: chartHeight,
      width: chartWidth
    },
    data: {
      json: chart.data,
      keys: {
        value: chart.series
      },
      type: type,
      types: types,
      groups: groups
    },
    legend: {
      hide: chart.hideLegend,
      position: 'inset',
      inset: {
        anchor: chart.legend,
        x: 10,
        y: yOffset
      },
      title: chart.title,
      subTitle: chart.subtitle
    },
    axis: {
      x: {
        label: chart.xaxis,
        type: 'category',
        categories: chart.categories
      },
      y: {
        label: yLabel,
        position: 'outer-top'
      },
      rotated: rotate
    },
    grid: {
      y: {
        show: true
      }
    }
  };

  c3.generate(c3Config);

  function renderSvgAnnotations(bindTag, chart, chartHeight, chartWidth) {

    var svg = d3.select(bindTag + ' svg');

    var svgGroups = $(bindTag + ' svg > g').get();
    var headerGroup = svg.append('g');
    var chartGroup = d3.select('g');
    var splitParts = chartGroup.attr("transform").split(",");
    var chartXOffset = ~~splitParts [0].split("(")[1];

    //var chartHeight = chartGroup.node().getBBox().height
    // annotate
    var title = headerGroup.append('text') // Title
      .style('font-size', '20px')
      .style('font-family', '"DaxlinePro", sans-serif')
      .style('fill', '#000000')
      .text(chart.title);

    var currentYOffset = 8 + applyLineWrap(title, chartWidth);

    if (chart.subtitle != '') {
      var subtitle = headerGroup.append('text') // Subtitle
        .attr("transform", "translate(0," + currentYOffset + ")")
        .style('font-size', '15px')
        .style('font-family', '"Open Sans", sans-serif')
        .style('fill', '#999999')
        .text(chart.subtitle);

      currentYOffset += 8 + applyLineWrap(subtitle, chartWidth);
    }


    if (chart.unit && !rotate) {
      var unit = headerGroup.append('text') // Unit (if non rotated)
        .attr("transform", "translate(" + (chartXOffset - 20) + "," + currentYOffset + ")")
        .attr('text-anchor', 'left')
        .style('font-size', '12px')
        .style('font-family', '"Open Sans", sans-serif')
        .style('fill', '#000000')
        .text(chart.unit);

      currentYOffset += 5 + applyLineWrap(unit, chartWidth);
    }

    currentYOffset += 2;

    chartYOffset = currentYOffset;

    // offset all the existing top level groups. This includes the chart and the legend
    var arrayLength = svgGroups.length;
    for (var i = 0; i < arrayLength; i++) { // ignore the last group as we just added it
      var group = svgGroups[i];
      var splitParts = $(group).attr("transform").split(",");
      var xOffset = ~~splitParts [0].split("(")[1];
      var yOffset = ~~splitParts [1].split("(")[1];
      $(group).attr("transform", "translate(" + (xOffset) + "," + (currentYOffset + yOffset) + ")");
    }

    currentYOffset += chartHeight;

    if (chart.source != '') {
      var source = d3.select(bindTag + ' svg').append('text') // Source
        .attr("transform", "translate(" + chartWidth + "," + currentYOffset + ")")
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-family', '"Open Sans", sans-serif')
        .style('fill', '#999999')
        .text(chart.source);

      currentYOffset += 5 + applyLineWrap(source, chartWidth);
    }

    // reset the max height property of the container div.
    // C3 seems to set this and it becomes a stale value after rendering annotations.
    $(bindTag + ' svg').attr('height', currentYOffset);
    $(bindTag).css('max-height', currentYOffset +'px');

    if (chart.notes) {
      if (typeof Markdown !== 'undefined') {
        var converter = new Markdown.getSanitizingConverter();
        Markdown.Extra.init(converter, {
          extensions: "all"
        });
        var notes = converter.makeHtml(chart.notes);
        $(bindTag).append(notes);
      }
    }

    return currentYOffset;
  }

  // apply word wrap if required on text we have inserted
  function applyLineWrap(text, width) {

    var wrappedHeight = 0;

    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2,
        y = text.attr("y"),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", lineHeight + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("y", ((++lineNumber + 1) * lineHeight) + "em").text(word);
        }
      }

      wrappedHeight = tspan.node().getBBox().height;
    });

    return wrappedHeight;
  }

  function checkType(chart) {
    if (chart.chartType === 'rotated') {
      type = 'bar';
      return type;
    } else if (chart.chartType === 'barline') {
      type = 'bar';
      return type;
    } else {
      return type = chart.chartType;
    }
  }


  function renderTimeseriesChartObject(bindTag, timechart, chartWidth, chartHeight) {
    var padding = 25;
    var chart = timechart //timeSubchart(timechart, period);

    // Create a dictionary so we can reverse lookup a tooltip label
    var dates_to_label = {};
    _.each(chart.timeSeries, function (data_point) {
      data_point.date = new Date(data_point.date);
      dates_to_label[data_point.date] = data_point.label;
    });

    // make room for titles if necessary
    if (chart.subtitle != '') {
      padding += 16;
    }
    if (chart.unit != '') {
      padding += 24;
    }

    // should we show
    var showPoints = true;
    if (chart.data.length > 100) {
      showPoints = false;
    }

    // work out position for chart legend
    var seriesCount = chart.series.length;
    var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;


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
        format: function (x) {
          return x.getFullYear();
        }
      }
      if (monthsOnTimeline <= 24.5) {
        tick = {
          format: function (x) {
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

      data: {
        json: chart.timeSeries,
        keys: keys,
        type: chart.chartType,
        xFormat: '%Y-%m-%d %H:%M:%S'
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
          title: function (x) {
            return dates_to_label[x];
          }
        }
      },
      grid: {
        y: {
          show: true
        }
      },
      padding: {
        top: padding
      }
    });
  }

  function formattedMonthYear(date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"];

    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + " " + year;
  }
}