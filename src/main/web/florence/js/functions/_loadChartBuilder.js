function loadChartBuilder(onSave) {
  var pageUrl = localStorage.getItem('pageurl');
  var html = templates.chartBuilder();
  $('body').append(html);
  $('.chart-builder').css("display","block");

  renderChart();

  $('.chart-builder :input').on('input', function () {
    renderChart();
  });

  $('.btn-chart-builder-cancel').on('click', function() {
    $('.chart-builder').stop().fadeOut(200).remove();
  });

  $('.btn-chart-builder-create').on('click', function() {
     chart.title = $('#chart-title').val();
     var uriUploadSVG = pageUrl + "/" + chart.title + ".svg";
     var uriUploadJSON = pageUrl + "/" + chart.title + ".json";


    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + uriUploadSVG,
      type: "POST",
      data: exportToSVG (),
      processData: false,
      contentType: false,
      success: function (res) {
        console.log("SVG uploaded successfully");
      }
    });

    $.ajax({
      url: "/zebedee/content/" + Florence.collection.id + "?uri=" + uriUploadJSON,
      type: "POST",
      data: JSON.stringify(buildChartObject()),
      processData: false,
      contentType: false,
      success: function (res) {
        console.log("JSON uploaded successfully");
        if(onSave) {
          onSave('<ons-chart path="' + getPathName() + '/' + $('#chart-title').val() + '" />');
        }
        $('.chart-builder').stop().fadeOut(200).remove();
      }
    });
  });

  // Builds, parses, and renders our chart
  function renderChart() {
    var chart = buildChartObject();
    parseChartObject(chart);
    renderChartObject('#chart', chart)
  }


  function buildChartObject() {
      json = $('#chart-data').val();

      var chart = {};
      chart.type = $('#chart-type').val();
      if(chart.type == 'rotated') {
        chart.type = 'bar';
        chart.rotated = true;
      }
      chart.period = $('#chart-period').val();

      chart.title = $('#chart-title').val();
      chart.subtitle = $('#chart-subtitle').val();
      chart.unit = $('#chart-unit').val();

      chart.source = $('#chart-source').val();

      chart.legend = $('#chart-legend').val();
      chart.hideLegend = (chart.legend == 'false') ? true : false;

      console.log(chart.legend + " " + chart.hideLegend);

      if(chart.title == '') {
        chart.title = '[Title]'
      }

      chart.data = tsvJSON(json);
      chart.series = tsvJSONColNames(json);
      chart.categories = tsvJSONRowNames(json);

    return chart;
  }

  // Transformations to determine render options for this chart
  // example - is it a time chart - should we flip axes
  function parseChartObject(chart) {

    // Determine if we have a time series
    var timeSeries = axisAsTimeSeries(chart.categories);
    if(timeSeries && timeSeries.length > 0) {
      chart.isTimeSeries = true;
      chart.timeSeries = timeSeries;

      // Subseries
      var subseries = timeSubSeries(timeSeries, 'year');
      if(subseries.length > 0) { chart.hasYear = true;}

      subseries = timeSubSeries(timeSeries, 'quarter');
      if(subseries.length > 0) { chart.hasQuarter = true;}

      subseries = timeSubSeries(timeSeries, 'month');
      if(subseries.length > 0) { chart.hasMonth = true;}

      subseries = timeSubSeries(timeSeries, 'other');
      if(subseries.length > 0) { chart.hasOtherPeriod = true; }

    } else {
      chart.isTimeSeries = false;
    }
  }

  // Do the rendering
  function renderChartObject(bindTag, chart) {
    if( chart.isTimeSeries ) {
        renderTimeseriesChartObject(bindTag, chart, chart.period)
        return;
    }

    // Calculate padding at top of SVG
    var padding = 25;
    if(chart.subtitle != '') { padding += 16; }

    var rotate = (chart.rotated ? true : false);

    var yLabel = rotate == true ? chart.unit : '';
    if((chart.unit != '') && (rotate == false)) {padding += 24; }

    // Calculate padding at bottom of SVG
    var bottomPadding = 0;
    if((chart.source != '')) {bottomPadding += 16;}

    // work out position for chart legend
    var seriesCount = chart.series.length;
    var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;

    // Generate the chart
    c3.generate({
      bindto: bindTag,
      data: {
        json: chart.data,
        keys: {
          value: chart.series
        },
        type: chart.type
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
        bottom: bottomPadding
      }
    });


    var svg = d3.select(bindTag + " svg")
      .attr("viewBox", "0 0 880 320")
      .attr("preserveAspectRatio", "xMinYMin meet");

    // annotate
    renderAnnotations(bindTag, chart);
  }



  function renderAnnotations(bindTag, chart) {
    var rotate = (chart.rotated ? true : false);

    var unitTop = (chart.subtitles != '') ? 60 : 45; // Hard coded values for unitTop

      // annotate
      d3.select(bindTag + ' svg').append('text') // Title
        .attr('x', 20)
        .attr('y', 18)
        .attr('text-anchor', 'left')
        .style('font-size', '1.6em')
          .style('fill', '#000000')
        .text(chart.title);

      if(chart.subtitle != '') {
        d3.select(bindTag + ' svg').append('text') // Subtitle
          .attr('x', 20)
          .attr('y', 36)
          .attr('text-anchor', 'left')
          .style('font-size', '1.2em')
          .style('fill', '#999999')
          .text(chart.subtitle);
          }

      if((chart.unit != '') && (rotate == false)) {
        d3.select(bindTag + ' svg').append('text') // Unit (if non rotated)
          .attr('x', 20)
          .attr('y', unitTop)
          .attr('text-anchor', 'left')
          .style('font-size', '1.2em')
          .style('fill', '#000000')
          .text(chart.unit);
          }

      var viewBoxHeight = d3.select(bindTag + ' svg').attr('height');
      if(chart.source != '') {
        d3.select(bindTag + ' svg').append('text') // Source
          .attr('x', 20)
          .attr('y', 320)
          .attr('text-anchor', 'left')
          .style('font-size', '1.2em')
          .style('fill', '#999999')
          .text(chart.source);
          }

  }

  function renderTimeseriesChartObject(bindTag, timechart, period) {
    var padding = 25;
    var chart = timeSubchart(timechart, period);

    // Create a dictionary so we can reverse lookup a tooltip label
    var dates_to_label = {};
    _.each(chart.data, function(data_point) {
        dates_to_label[data_point.date] = data_point.label;
        });

    // make room for titles if necessary
    if(chart.subtitle != '') { padding += 16; }
    if(chart.unit != '') { padding += 24; }

    // should we show
    var showPoints = true;
    if(chart.data.length > 120) { showPoints = false; }

   // work out position for chart legend
    var seriesCount = chart.series.length;
    var yOffset = (chart.legend == 'bottom-left' || chart.legend == 'bottom-right') ? seriesCount * 20 + 10 : 5;


    c3.generate({
      bindto: bindTag,

      data: {
        json: chart.data,
        keys: {
          x: 'date',
          value: chart.series
        },
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
        x: {
          label: chart.xaxis,
          type: 'timeseries',
          tick: {
              format: function (x) {
                  return x.getFullYear();
              }
              }
        }
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

// Data load from text box functions
  function tsvJSON (input) {
    var lines=input.split("\n");
    var result = [];
    var headers=lines[0].split("\t");

    for(var i=1;i<lines.length;i++){
      var obj = {};
      var currentline=lines[i].split("\t");

      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    return result //JSON
  }
  function tsvJSONRowNames (input) {
      var lines=input.split("\n");
      var result = [];

      for(var i=1;i<lines.length;i++){
        var currentline=lines[i].split("\t");
        result.push(currentline[0]);
        }

        return result
  }
  function tsvJSONColNames (input) {
    var lines=input.split("\n");
    var headers=lines[0].split("\t");
    headers.shift();
    return headers;
  }

  function exportToSVG () {
    var tmp = document.getElementById('chart');
    var svg = tmp.getElementsByTagName('svg')[0];
    if ($('#chart-type').val() === 'line') {
      $('.c3 line').css("fill", "none");
      console.log($('.c3 line'))
    }
    var source = (new XMLSerializer).serializeToString(svg);
    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    return source;
  }

// Date conversion support functions

// Steps through time series points
function axisAsTimeSeries(axis) {
  var result = [];
  var rowNumber = 0;

  _.each(axis, function(tryTimeString) {
    var time = convertTimeString(tryTimeString);
    if(time) {
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

    // Format of year only
    var yearVal = tryYear(timeString);
    if(yearVal) { result.date = yearVal; result.period = 'year'; return result; }

    // Format with year and quarter
    var quarterVal = tryQuarter(timeString);
    if(quarterVal) { result.date = quarterVal; result.period = 'quarter'; return result; }

    // Format with year and month
    var monthVal = tryMonth(timeString);
    if(monthVal) { result.date = monthVal; result.period = 'month'; return result; }

    // Other format
    var date = new Date(timeString);
    if( !isNaN( date.getTime() ) ) {
        result.date = monthVal; result.period = 'other'; return result;
        }

    return(null);
}
function tryYear(tryString) {
    var base = tryString.trim();
    if(base.length != 4) { return null; }

    var date = new Date(tryString);

    return date;
}
function tryQuarter(tryString) {
    var indices = [0, 1, 2, 3];
    var quarters = ["Q1", "Q2", "Q3", "Q4"];
    var months = ["Jan", "Apr", "Jul", "Oct"];

    var quarter = _.find(indices, function(q) { return (tryString.indexOf(quarters[q]) > -1) });
    if(quarter != null) {
        var dateString = tryString.replace(quarters[quarter], months[quarter]);
        return new Date(dateString);
        }
    }
function tryMonth(tryString) {
    var date = new Date(tryString);
    if( !isNaN( date.getTime() ) ) {
        return date;
        }
}
function timeSubSeries(timeSeries, period) {
  // Period is one of ['year', 'quarter', 'month', 'other']
   result = [];
   _.each(timeSeries, function(time) {
      if(time['period'] == period) {
        result.push(time);
      }
   });
   return result;
}


// Filters data based on the time period (Year, Month, Quarter) selected by the user
// Returns a new chart
function timeSubchart(chart, period) {
        var subchart = {};

        subchart.type = chart['type'];
        if(subchart.type == 'rotated') {
          subchart.type = 'bar';
          subchart.rotated = true;
        }

        subchart.title = chart.title;
        subchart.subtitle = chart.subtitle;
        subchart.unit = chart.unit;
        subchart.source = chart.source;

        subchart.hideLegend = chart.hideLegend;
        subchart.legend = chart.legend;

        if(subchart.title == '') {
          subchart.title = '[Title]';
        }

        subchart.series = chart.series;

        // Use timeSubSeries to filter the data
        var subseries = timeSubSeries(chart.timeSeries, period);
        var subdata = [];
        var dates = [];
        var labels = [];

        _.each(subseries, function(time) {
          var item = chart.data[time['row']];
          item.date = time['date'];
          item.label = time['label'];
          subdata.push(item);
        })

        subchart.data = subdata;

      return subchart;
}
}