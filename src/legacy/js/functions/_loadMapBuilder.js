
function loadMapBuilder(pageData, onSave, map) {
    const pageUrl = pageData.uri;
    const html = templates.mapBuilder(map);

    $('body').append(html);

    // onSave function - sends content to zebedee, adds the map to the parent page and closes the modal
    var saveMap = function (mapJson, dataCsv) {
        if (!mapJson) {
            sweetAlert("Empty Map", "The map is empty - please select cancel instead.");
            return;
        }
        if (!mapJson.filename) {
            mapJson.filename = StringUtils.randomId();
        }
        if (!mapJson.type) {
            mapJson.type = "map";
        }
        if (!mapJson.uri) {
            mapJson.uri = pageUrl + "/" + mapJson.filename;
        }

        $.ajax({
            url: "/zebedee/content/" + Florence.collection.id + "?uri=" + mapJson.uri + ".json&validateJson=false",
            type: 'POST',
            data: JSON.stringify(mapJson),
            processData: false,
            contentType: 'application/json'
        });
        if (dataCsv) {
            $.ajax({
                url: "/zebedee/content/" + Florence.collection.id + "?uri=" + mapJson.uri + ".csv&validateJson=false",
                type: 'POST',
                data: dataCsv,
                processData: false,
                contentType: 'text/csv'
            });
        } else {
            console.log("saveMap: No csv provided - not saving csv for map " + mapJson.filename);
        }
        addMapToPageJson(mapJson);
        if (onSave) {
            onSave(mapJson.filename, '<ons-map path="' + mapJson.uri + '" />');
        }
        closeModal();
    };

    // adds the map to the parent page
    function addMapToPageJson(mapJson) {
        if (!pageData.maps) {
            pageData.maps = [];
        } else {

            var existingMap = _.find(pageData.maps, function (existingMap) {
                return existingMap.filename === mapJson.filename;
            });

            if (existingMap) {
                existingMap.title = mapJson.title;
                return;
            }
        }

        pageData.maps.push({title: mapJson.title, filename: mapJson.filename, uri: mapJson.uri});
    }

    function onError(message) {
        sweetAlert(message);
    }

    function closeModal() {
        closeMapBuilder("map-builder-app", onError)
        $('.map-builder').stop().fadeOut(200).remove();
    }

    if (map && map.filename) {
        // we need to load both the json and the csv before we start the map builder
        var data = {}
        var counter = 2;
        function invokeMapBuilder(name, value) {
            data[name] = value;
            if (--counter == 0) {
                startMapBuilder("map-builder-app", data, saveMap, closeModal, onError, '/map');
            }
        }
        $.getJSON("/zebedee/content/" + Florence.collection.id + "?uri=" + pageUrl + "/" + map.filename + ".json")
            .done(function(jsonData) {
            invokeMapBuilder("requestJson", jsonData);
        });
        $.get("/zebedee/content/" + Florence.collection.id + "?uri=" + pageUrl + "/" + map.filename + ".csv")
            .done(function(csv) {
            invokeMapBuilder("csv", csv);
        }).fail(function() {
            invokeMapBuilder("csv", null);
        });
    } else {
        startMapBuilder("map-builder-app", {}, saveMap, closeModal, onError, '/map');
    }

}