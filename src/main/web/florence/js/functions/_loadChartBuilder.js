function loadChartBuilder(pageData, onSave, chart) {

    var chart;
    var pageUrl;
    var html;

    const ALPHA = 0.6;
    const SM  = 360;
    const MD  = 520;
    const LG  = 700;

    const sizes = {sm:SM, md:MD, lg:LG}; // - phone, tablet, desktop


    initialise(pageData, chart);


    function initialise(pageData, _chart){
        chart = _chart;
        pageUrl = pageData.uri;
        html = templates.chartBuilder(chart);
        $('body').append(html);

        loadTemplates();

        $('.js-chart-builder').css("display", "block");

        if (chart) {
            $('#chart-data').val(toTsv(chart));
            refreshExtraOptions();
        }

        initAccordian();

        setPageListeners();
        setFormListeners();
        setShortcutGroup();

        renderText();
        renderNotes();
        renderChart();

        showTab( 'Chart' );

    }

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
            case 'bar':
            case 'rotated':
                return templates.chartEditBarChartExtras;
            case 'scatter':
                return templates.chartEditScatterExtras;
            default:
                return;
        }
    }


    function showTab(tabName) {
        $('.js-chart-builder-panel').hide();
        switch (tabName) {
            case 'Chart':
                $('#chart-panel').show();
                break;
            case 'Metadata':
                $('#metadata-panel').show();
                break;
            case 'Series':
                var template = templates.chartBuilderSeries;
                var html = template(chart);
                $('#series-panel').html(html);
                $('#series-panel').show();
                break;
            case 'Advanced':
                $('#advanced-panel').show();
                break;
            case 'Annotation':
                $('#annotation-panel').show();

                $( "#annotation-chart" ).accordion({
                  active: 0
                });

                break;
            default:
                return;
        }
    }


    function setPageListeners() {
        $('.tab__link').on('click', function () {
            $('.tab__link').removeClass('tab__link--active');
            $(this).addClass('tab__link--active');
            showTab( $(this).text() );
        });

        $('.btn-chart-builder-cancel').on('click', function () {
            $('.js-chart-builder').stop().fadeOut(200).remove();
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
                        pageData.charts = [];
                    }

                    existingChart = _.find(pageData.charts, function (existingChart) {
                        return existingChart.filename === chart.filename;
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
                        onSave(chart.filename, '<ons-chart path="' + chart.filename + '" />');
                    }
                    $('.js-chart-builder').stop().fadeOut(200).remove();
                }
            });
        });
    }


    
    function setShortcutGroup() {
        setShortcuts('#chart-title', renderText);
        setShortcuts('#chart-subtitle', renderText);
        setShortcuts('#chart-data', renderChart);
        setShortcuts('#chart-x-axis-label', renderChart);
        setShortcuts('#chart-notes', renderText);
    }


    function loadExisting(uri) {
        // check uri for existing page url
        // eg '/economy/grossdomesticproductgdp/articles/chartdemo/2017-01-05'
        var slash = uri.indexOf("/");
        var targetUri;
        
        if (slash >-1){
            targetUri =  uri + "/data";
        }else{
            targetUri = pageUrl + "/" + uri + "/data";
        }

        $.ajax({
            url: targetUri,
            type: 'POST',
            data: null,
            contentType: "image/png",
            processData: false,
            success: function (res) {
                updateForm(res);
            },
            error: function(err){
                console.log(err);
            }
        });
    }


    function loadTemplates(){
        // loop and recreate panels
        var panels = [
            templates.chartBuilderChart,
            templates.chartBuilderMetadata,
            templates.chartBuilderSeries,
            templates.chartBuilderAdvanced,
            templates.chartBuilderAnnotation
        ];

        var targets= [
            '#chart-panel',
            '#metadata-panel',
            '#series-panel',
            '#advanced-panel',
            '#annotation-chart',
        ];

        $.each(panels, function(index, val){
            var template = val;
            var html = template(chart);

            $(targets[index]).empty();
            $(targets[index]).append(html);
        })
    }


    function updateForm(newData) {
        // there some fields we don't want to update
        // so store and restore
        var original = {};
        original.filename = chart.filename;
        original.data = chart.data;
        original.headers = chart.headers;
        original.categories = chart.categories;
        original.title = chart.title;
        original.subtitle = chart.subtitle;
        original.notes = chart.notes;
        original.altText = chart.altText;

        chart = newData;
        chart.filename = original.filename;
        chart.data = original.data;
        chart.headers = original.headers;
        chart.categories = original.categories;
        chart.title = original.title;
        chart.subtitle = original.subtitle;
        chart.notes = original.notes;
        chart.altText = original.altText;

        clearFormListeners();

        loadTemplates();

        // add the chart dimensions back in
        $('#chart-label-interval').val(chart.labelInterval);
        if(chart.devices && chart.device){       
            $('#device').val(chart.devices[chart.device].type);
            $('#aspect-ratio').val(chart.devices[chart.device].aspectRatio);
            $('#is-hidden').prop('checked',chart.devices[chart.device].isHidden);
        }

        $('#chart-data').val(toTsv(chart));
        refreshExtraOptions();

        setFormListeners();
        renderText();
        renderChart();    
    }


    function initAccordian() {
        try {
            $('#annotation-chart').accordion({
                header: '.chart-accordian-header',
                active: 0,
                collapsible: true
            });
        }
        catch(err){
            console.warn('Issue initialising ACCORDIAN');
        }
    }


    function setFormListeners() {
        $('.refresh-chart').on('change', refreshChart);   
        // for TEXTFIELDS only update the chart when the text field lose focus
        $('.refresh-chart-text').on('blur', refreshChart);
        $('.refresh-text').on('input', renderText);
        $('#add-annotation').on('click', addNotation);
        //device type
        $('.refresh-aspect').on('change', refreshChartDimensions );
    }


    function clearFormListeners() {
        $('.refresh-chart').off('change', refreshChart);
        $('.refresh-chart-text').off('blur', refreshChart);
        $('.refresh-text').off('input', renderText);
        $('#add-annotation').off('click', addNotation);
        $('.refresh-aspect').off('change', refreshChartDimensions );
    }



    // event listeners /////////////////////////////////
    function refreshChart(){
        var existing = $('#chart-config-URL').val();
        if (existing) {
            console.warn("OVERWRITE ALL CONFIG!");
            loadExisting(existing);
        }else{
            // NOTE need to refresh the chart object before refreshing the Extra options
            chart = buildChartObject();
            refreshExtraOptions();
            renderChart();
        }
    }


    function refreshChartDimensions(){
        var device = $('#device').val();

        chart.devices[device].aspectRatio = $('#aspect-ratio').val();
        chart.devices[device].labelInterval = $('#chart-label-interval').val();
        chart.devices[device].isHidden = $('#is-hidden').is(':checked');;
        chart.isHidden = $('#is-hidden').is(':checked');;

        chart = buildChartObject();
        renderChart();   
    }

    function addNotation(){
        var obj = {   
                title: 'Annotation ' + (chart.annotations.length+1) + ': Automagic', 
                devices:[
                    {type:'Mobile', x:200, y:150, isHidden:false},
                    {type:'Tablet', x:50, y:50, isHidden:false},
                    {type:'Desktop', x:50, y:50, isHidden:false}
                ]
                , x:250, y:70
                , isHidden:false
                , isPlotline:false

            }
        chart.annotations.push(obj);
        renderNotes();
        renderChart();
    }


    function onDelete(e) {
        var target = parseInt(e.target.id.substring(18));
        chart.annotations.splice(target,1);
        renderNotes();
        renderChart();
    }

    ////////////////////////////////////////////////////



    //Renders annotation panel fields
    function renderNotes() {

        //remove existing events
        $('.btn-delete-annotation').off('click', onDelete);
        $('chart-accordian.refresh-chart').off('change', refreshChart); 

        var template = templates.chartBuilderAnnotation;
        var html = template(chart);
        $('#annotation-chart').empty();
        $('#annotation-chart').html(html);
        $('#annotation-chart').show();

        //update the delete button listeners
        $('.btn-delete-annotation').on('click', onDelete);

        $( "#annotation-chart" ).accordion( "refresh" );
        if(chart){
            $( "#annotation-chart" ).accordion( "option", "active", (chart.annotations.length-1) );  
        }
        $('.chart-accordian.refresh-chart').on('change', refreshChart);
    }   


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
        //TODO check we need to refresh this AGAIN!
        chart = buildChartObject();
        // get device and its corresponding dims
        var device = $('#device').val();
        var chartHeight = parseInt(chart.devices[device].aspectRatio * chart.size);
        var chartWidth = chart.size;

        $("#chart-size").html('Size:' + chartWidth + ' x ' + chartHeight);
        renderChartObject('chart', chart, chartHeight, chartWidth);
    }

    function buildChartObject() {
        var json = $('#chart-data').val();
        // catch any double quotes and replace with single for now...
        // this stops them breaking the TSV transformation
        json = json.replace(/["]/g,'\'');

        if (!chart) {
            chart = {};
        }

        chart.type = "chart";
        chart.alpha = ALPHA;
        chart.title = $('#chart-title').val();
        chart.filename = chart.filename ? chart.filename : StringUtils.randomId(); //  chart.title.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
        chart.uri = pageUrl + "/" + chart.filename;
        chart.subtitle = $('#chart-subtitle').val();
        chart.unit = $('#chart-unit').val();
        chart.source = $('#chart-source').val();

        chart.isStacked = $('#isStacked').prop('checked');
        chart.decimalPlaces = $('#chart-decimal-places').val();
        chart.decimalPlacesYaxis = $('#chart-decimal-places-yaxis').val();
        chart.labelInterval = $('#chart-label-interval').val();

        chart.notes = $('#chart-notes').val();
        chart.altText = $('#chart-alt-text').val();
        chart.xAxisLabel = $('#chart-x-axis-label').val();
        chart.startFromZero = $('#start-from-zero').prop('checked');
        chart.finishAtHundred = $('#finish-at-hundred').prop('checked');

        // handle negative min values without a break...
        chart.hasLineBreak = false;
        chart.yMin = $('#chart-min').val();
        chart.yMax = $('#chart-max').val();

        if(chart.yMin>0){
            chart.hasLineBreak = true;
        }
        
        // store the device and the respective aspect ratio
        if(!chart.devices){
            chart.devices = {
                'sm':{aspectRatio:'0.56', labelInterval:'', isHidden:false},
                'md':{aspectRatio:'0.56', labelInterval:'', isHidden:false},
                'lg':{aspectRatio:'0.56', labelInterval:'', isHidden:false},
                            };
        }
        chart.device = $('#device').val();
        chart.size = sizes[chart.device];
        chart.aspectRatio = $('#aspect-ratio').val();

        // set ratio is done when the aspect ratio changes so recall existing aspect ratio
        $('#aspect-ratio').val(chart.devices[chart.device].aspectRatio);
        $('#chart-label-interval').val(chart.devices[chart.device].labelInterval);
        $('#is-hidden').prop('checked',chart.devices[chart.device].isHidden);
        $('#is-plotline').prop('checked',chart.devices[chart.device].isPlotline);
        chart.isHidden = chart.devices[chart.device].isHidden;
        

        if (chart.title === '') {
            chart.title = '[Title]'
        }

        chart.data = tsvJSON(json);
        chart.headers = tsvJSONHeaders(json);
        chart.series = tsvJSONColNames(json);
        chart.categories = tsvJSONRowNames(json);

        chart.yAxisMax = getMax(json);

        chart.xAxisPos = $('#position-x-axis').val();
        chart.yAxisPos = $('#position-y-axis').val();
        chart.highlight = $('#chart-highlight option:selected').text();

        chart.palette = $('input[name=palette]:checked').val();
        chart.showTooltip = $('#show-tooltip').prop('checked');
        chart.showMarker = $('#show-marker').prop('checked');

        if(!chart.annotations){
            chart.annotations = [];
        }

        //loop though annotations and populate array from form
        $.each(chart.annotations, function(idx, itm){
            var text = $('#chart-notes-'+idx).val();
                var maxLength = 0;
            if(text){
                var lines = text.split('\n');
                $.each(lines, function(idx, line){
                    if (line.length>maxLength){
                        maxLength = line.length;
                    }
                });

                itm.id = idx;
                
                itm.x = parseInt( $('#note-x-'+idx).val() );
                itm.y = parseInt( $('#note-y-'+idx).val() );
                itm.title = lines.join('<br/>');
                itm.isHidden = $('#is-hidden-'+idx).prop('checked');
                itm.isPlotline = $('#is-plotline-'+idx).prop('checked');
                itm.width = parseInt( maxLength * 6.5) + 6 ;
                itm.height = (lines.length+1)*12 + 10;
                itm.orientation = $('#orientation-axis-'+idx).val();
                itm.bandWidth = parseInt( $('#band-width-'+idx).val() );
            }
        });

        if (isShowBarLineSelection(chart.chartType) || chart.series.length>1) {
            var types = {};
            var groups = [];
            var group = [];
            var seriesData = chart.series;
            //bar line panel settings
            $.each(seriesData, function (index) {
                //custom series panel takes precendence
                if( $('#series-types_' + index).val() ){
                    types[seriesData[index]] = $('#series-types_' + index).val();

                }else{
                    types[seriesData[index]] = $('#types_' + index).val() || 'bar';
                    
                }
            });
            
            (function () {
                $('#extras input:checkbox:checked').each(function () {
                    group.push($(this).val());
                });
                groups.push(group);
                return groups;
            })();

            (function () {
                $('#series-panel input:checkbox:checked').each(function () {
                    group.push($(this).val());
                });
                groups.push(group);
                return groups;
            })();
            
            chart.chartTypes = types;
            chart.groups = groups;
        }

        chart.chartType = $('#chart-type').val();
        // if we change the chart type need to reload
        // and update select menu under the Advanced tab
        var html = templates.chartBuilderAdvancedSelect(chart);
        $('#chart-highlight').empty();
        $('#chart-highlight').append(html);

        parseChartObject(chart);

        chart.files = [];

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

    // Converts chart to highcharts configuration by posting Babbage /chartconfig endpoint and to the rendering with fetched configuration
    function renderChartObject(bindTag, chart, chartHeight, chartWidth) {
        var jqxhr = $.post("/chartconfig", {
                data: JSON.stringify(chart),
                width: chartWidth
            },
            function () {
                var chartConfig = window["chart-" + chart.filename];
                
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
        var lines = input.split("\n"); //%0A - "\n"
        var headers = lines[0].split("\t"); //%09 - "\t"
        if(headers[0]===''){
            headers[0]=' ';
        }
        if(headers.length>3){
            console.warn('That\'s a lot of series. Do you want to use small multiples?');
        }
        return headers;
    }

    function tsvToSeries(input) {
        var series = [];
        var lines = input.split("\n");
        var headers = lines[0].split("\t");

        for (var i = 1; i < headers.length; i++) {
            var obj = {index:i, title: headers[i] + ': series'+(i+1), chartType:'line', isStacked:false, isHighlight:false};
            series.push(obj);
        }

        return series;
    }

    function getMax(input){
        var max = 0;
        var lines = input.split("\n");

        for (var i = 1; i < lines.length; i++) {
            var currentline = lines[i].split("\t");
            for (var j = 1; j < currentline.length; j++) {
                seriesMax = parseFloat(currentline[j]) 
                if(seriesMax>max){
                    max = seriesMax;
                }
            }
        }
        return max;
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

        svg.prepend("\n<style type='text/css'></style>");
        svg.find("style").textContent += "\n<![CDATA[" + styleContent + "]]>\n";

        var source = (new XMLSerializer).serializeToString(svg[0]);

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
                console.log('png uploaded!');
            }
        });
    }

     
}