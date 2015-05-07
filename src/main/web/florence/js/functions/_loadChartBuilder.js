function loadChartBuilder() {
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
    $('.chart-builder').fadeOut(200).remove();
  });



  function renderChart() {
    var chart = buildChartObject();
    renderChartObject('#chart', chart);
  }


  function buildChartObject() {
      json = $('#chart-data').val();

      var chart = {};
      chart.type = $('#chart-type').val();
      chart.title = $('#chart-title').val();
      chart.subtitle = $('#chart-subtitle').val();
      chart.unit = $('#chart-unit').val();

      chart.xaxis = $('#chart-x-axis').val();
      chart.yaxis = $('#chart-y-axis').val();


      if(chart.title == '') {
        chart.title = '[Title]'
      }

      chart.data = tsvJSON(json);
      chart.series = tsvJSONColNames(json);
      chart.categories = tsvJSONRowNames(json);

    return chart;
  }


  function renderChartObject(bindTag, chart) {
    var padding = 25;
    if(chart.subtitle != '') { padding += 16; }
    if(chart.unit != '') {padding += 24; }

    c3.generate({
      bindto: bindTag,
      data: {
        json: chart.data,
        keys: {
          value: chart.series
        },
        type: chart.type
      },
      axis: {
        x: {
          label: chart.xaxis,
          type: 'category',
          categories: chart.categories
        },
        y: {
          label: chart.yaxis
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

    d3.select('#chart svg').append('text')
      .attr('x', 20)
      .attr('y', 18)
      .attr('text-anchor', 'left')
      .style('font-size', '1.6em')
        .style('fill', '#000000')
      .text(chart.title);

    if(chart.subtitle != '') {
      d3.select('#chart svg').append('text')
        .attr('x', 20)
        .attr('y', 36)
        .attr('text-anchor', 'left')
        .style('font-size', '1.2em')
        .style('fill', '#999999')
        .text(chart.subtitle);
        }

    if(chart.unit != '') {
      d3.select('#chart svg').append('text')
        .attr('x', 20)
        .attr('y', padding - 8)
        .attr('text-anchor', 'left')
        .style('font-size', '1.2em')
        .style('fill', '#000000')
        .text(chart.unit);
        }
  }


  function csvJSON (csv) {
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
    values=headers.shift();

    for(var i=1;i<lines.length;i++){
      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result; //JSON
  }

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
    console.log(headers);
    return headers;
  }
}