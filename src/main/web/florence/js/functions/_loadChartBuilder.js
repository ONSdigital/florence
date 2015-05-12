function loadChartBuilder() {
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
        $('.chart-builder').stop().fadeOut(200).remove();
      }
    });
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
      }
    });

    var svg = d3.select("#chart svg")
      .attr("viewBox", "0 0 880 320")
      .attr("preserveAspectRatio", "xMinYMin meet");

    d3.select('#chart svg').append('text')
      .attr('x', d3.select('#chart svg').node().getBoundingClientRect().width / 2)
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.4em')
      .text(chart.title);
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
}