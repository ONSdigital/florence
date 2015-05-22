// Do the rendering
function renderChartObject(bindTag, chart, chartHeight, chartWidth) {

  // Create our svg
  var svg = d3.select(bindTag + " svg")
    .attr("preserveAspectRatio", "xMinYMin meet");

  // If we are talking time series skip
  if( chart.isTimeSeries ) {
    renderTimeseriesChartObject(bindTag, chart, chart.period)
    return;
  }

  // Calculate padding at top (and left) of SVG
  var padding = 25;
  var paddingLeft = 100;
  if(chart.subtitle != '') { padding += 15; }

  var types = chart.type === 'barline' ? chart.types : {};
  var groups = chart.type === 'barline' ? chart.groups : [];
  var type = checkType(chart);
  var rotate = chart.type === 'rotated';
  var yLabel = rotate == true ? chart.unit : '';
  if((chart.unit != '') && (rotate == false)) {padding += 24; }
  if((chart.unit != '') && (rotate === true)) {paddingLeft += 100; }

  // Calculate padding at bottom of SVG
  var bottomPadding = 20;
  if((chart.source != '')) {bottomPadding += 5;}

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
      .attr('y', 18)
      .attr('text-anchor', 'left')
      .style('font-size', '20px')
      .style('fill', '#000000')
      .text(chart.title);

    if(chart.subtitle != '') {
      d3.select(bindTag + ' svg').append('text') // Subtitle
        .attr('x', 20)
        .attr('y', 100)
        .attr('text-anchor', 'left')
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
    var viewBoxWidth = d3.select(bindTag + ' svg').attr('width');

    if(chart.source != '') {
      d3.select(bindTag + ' svg').append('text') // Source
//        .attr('x', 20)
//        .attr('y', 320)
        .attr("transform", "translate(" + (viewBoxWidth) + "," + (viewBoxHeight) + ")")
        .attr()
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
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

  //
  // Time series
  //
  // Filters data based on the time period (Year, Month, Quarter) selected by the user
  // Returns a new chart
//  function timeChart(chart) {
//    var subchart = {};
//
//    subchart.type = chart['type'];
//    if(subchart.type == 'rotated') {
//      subchart.type = 'bar';
//      subchart.rotated = true;
//    }
//
//    subchart.title = chart.title;
//    subchart.subtitle = chart.subtitle;
//    subchart.unit = chart.unit;
//    subchart.source = chart.source;
//
//    subchart.hideLegend = chart.hideLegend;
//    subchart.legend = chart.legend;
//
//    if(subchart.title == '') {
//      subchart.title = '[Title]';
//    }
//
//    subchart.series = chart.series;
//
//    var subdata = [];
//    var dates = [];
//    var labels = [];
//
//    _.each(subseries, function(time) {
//      var item = chart.data[time['row']];
//      item.date = time['date'];
//      item.label = time['label'];
//      subdata.push(item);
//    })
//
//    subchart.data = subdata;
//
//    return subchart;
//  }

//  function timeSubSeries(timeSeries, period) {
//    // Period is one of ['year', 'quarter', 'month', 'other']
//    result = [];
//    _.each(timeSeries, function(time) {
//      if(time['period'] == period) {
//        result.push(time);
//      }
//    });
//    return result;
//  }

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
    if(chart.type == 'line'){
      axisType = {
                label: chart.xaxis,
                type: 'timeseries',
                tick: {
                    format: function (x) {
                        return x.getFullYear();
                    }
                    }
              }
      keys = {
        x: 'date',
        value: chart.series
      }
    } else {
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
}