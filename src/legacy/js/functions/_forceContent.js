function forceContent(collectionId) {

    // check user is logged in. userType wont be set unless logged in
    if (!localStorage.userType) {
        return;
    }

    // open the modal
    var modal = templates.forceContentModal;
    $('.wrapper').append(modal);

    logForceContentAction();

    // on save
    $('#force-content-json-form').submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var json = this[0].value;

        if (!json) {
            sweetAlert("Please insert JSON");
            return;
        }

        // is it possible to parse the JSON to get the uri
        if (!tryParseJSON(json)) {
            return;
        }
        var content = JSON.parse(json);
        var uri = content.uri;

        // if no uri throw an alert
        if (!uri) {
            sweetAlert("It doesn't look like the JSON input contains a uri. Please check");
            return;
        }

        var safePath = checkPathSlashes(uri);

        $.ajax({
            url: `${API_PROXY.VERSIONED_PATH}/content/${collectionId}?uri=${safePath}/data.json`,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: json,
            success: function () {
                sweetAlert("Content created", "", "success");
                $('.overlay').remove();
                viewCollections(collectionId);

                console.log('-----------------------------');
                console.log('CONTENT CREATED \nuri: ', safePath + '\n', JSON.parse(json));
                console.log('-----------------------------');

            },
            error: function(e) {
                sweetAlert(e.responseJSON.message);
            }
        });
    });

    // cancel button
    $('.btn-modal-cancel').off().click(function () {
        $('.overlay').remove();
    });

}


function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) {
        sweetAlert("That doesn't look like valid JSON. Please check");
    }

    return false;
}

function forceJSONContent(code, collectionId) {
    var d = new Date(),
        e = new Date();
    var minsSinceMidnight = parseInt(((e - d.setHours(0,0,0,0)) / 1000) / 60);

    if (!code || !collectionId) {
        console.error('Missing arguments! You should pass two arguments - code, collectionID');
        return;
    }

    if (code != minsSinceMidnight) {
        console.error('Code error');
        return;
    }

    forceContent(collectionId)
}

function logForceContentAction() {

    var logData = {
        user: this.user = localStorage.getItem('loggedInAs'),
        trigger: {
            elementClasses: ["Force JSON Content function invoked"]
        }
    };

    $.ajax({
        url: `${API_PROXY.VERSIONED_PATH}/clickEventLog`,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(logData),
        async: true,
    });
}
