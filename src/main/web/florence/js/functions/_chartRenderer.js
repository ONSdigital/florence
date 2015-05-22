// Do the rendering
function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

  // Create our svg
  var svg = d3.select(bindTag + " svg")
    .attr("viewBox", "0 0 " + chartWidth + " " + chartHeight)
    .attr("preserveAspectRatio", "xMinYMin meet");

  // If we are talking time series skip
  if( chart.isTimeSeries && (chart.type == 'line')) {
    renderTimeseriesChartObject(bindTag, chart)
    return;
  }

  // Calculate padding at top (and left) of SVG
  var padding = 25;
  var paddingLeft = 100;
  if(chart.subtitle != '') { padding += 16; }

  var types = chart.type === 'barline' ? chart.types : {};
  var groups = chart.type === 'barline' ? chart.groups : [];
  var type = checkType(chart);
  var rotate = chart.type === 'rotated';
  var yLabel = rotate == true ? chart.unit : '';
  if((chart.unit != '') && (rotate == false)) {padding += 24; }
  if((chart.unit != '') && (rotate === true)) {paddingLeft += 50; }

  // Calculate padding at bottom of SVG
  var bottomPadding = 30;
  if((chart.source != '')) {bottomPadding += 16;}

  // work out position for chart legend
  var seriesCount = chart.series.length;
  var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;

  // Generate the chart
  c3.generate({
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
      }
     },
    axis: {
      x: {
        label: chart.xaxis,
        type: 'category',
        categories: chart.categories
      },
      y: {
        label: yLabel
      },
      rotated: rotate
    },
    grid: {
      y: {
        show: true
      }
    },
    padding: {
      top: padding,
      bottom: bottomPadding,
      left : paddingLeft
    }
  });

  // annotate
  renderAnnotations(bindTag, chart);

  function renderAnnotations(bindTag, chart) {
    var rotate = (chart.rotated ? true : false);

    var unitTop = (chart.subtitles != '') ? 60 : 45; // Hard coded values for unitTop

    // annotate
    d3.select(bindTag + ' svg').append('text') // Title
      .attr('x', 20)
      .attr('y', 25)
      .style('font-size', '20px')
      .style('fill', '#000000')
      .text(chart.title);

    if(chart.subtitle != '') {
      d3.select(bindTag + ' svg').append('text') // Subtitle
        .attr('x', 20)
        .attr('y', 45)
        .style('font-size', '15px')
        .style('fill', '#999999')
        .text(chart.subtitle);
    }

    if((chart.unit != '') && (rotate == false)) {
      d3.select(bindTag + ' svg').append('text') // Unit (if non rotated)
        .attr('x', 20)
        .attr('y', unitTop)
        .attr('text-anchor', 'left')
        .style('font-size', '15px')
        .style('fill', '#000000')
        .text(chart.unit);
    }

    var viewBoxHeight = d3.select(bindTag + ' svg').attr('height');
    if(chart.source != '') {
      d3.select(bindTag + ' svg').append('text') // Source
        .attr('x', 20)
        .attr('y', 320)
        .attr('text-anchor', 'left')
        .style('font-size', '15px')
        .style('fill', '#999999')
        .text(chart.source);
    }
  }

  function checkType (chart) {
    if (chart.type === 'rotated') {
      type = 'bar';
      return type;
    } else if (chart.type === 'barline') {
      type = 'bar';
      return type;
    } else {
      return type = chart.type;
    }
  }


  function renderTimeseriesChartObject(bindTag, timechart) {
    var padding = 25;
    var chart = timechart //timeSubchart(timechart, period);

    // Create a dictionary so we can reverse lookup a tooltip label
    var dates_to_label = {};
    _.each(chart.timeSeries, function(data_point) {
        dates_to_label[data_point.date] = data_point.label;
        });

    // make room for titles if necessary
    if(chart.subtitle != '') { padding += 16; }
    if(chart.unit != '') { padding += 24; }

    // should we show
    var showPoints = true;
    if(chart.data.length > 100) { showPoints = false; }

   // work out position for chart legend
    var seriesCount = chart.series.length;
    var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;


    // refers to the issue of time axes not being applicable to non continuous charts
    var axisType;
    var keys;

    if(chart.type == 'line'){ // continuous line charts
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
      if( monthsOnTimeline <= 24.5) {
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
        type: chart.type,
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
          title: function(x) { return dates_to_label[x] ;}
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

    renderAnnotations(bindTag, chart);
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