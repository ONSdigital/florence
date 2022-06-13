// The florence object is used for storing application state.
var Florence = Florence || {
        babbageBaseUrl: window.location.origin,
        refreshAdminMenu: function () {
            // Display a message to show users are on dev or sandpit
            Florence.environment = isDevOrSandpit();
            Florence.showDatasetsTab = Florence.globalVars.config.enableDatasetImport;

            var mainNavHtml = templates.mainNav(Florence);
            $('.js-nav').html(mainNavHtml);
        },
        setActiveCollection: function (collection) {
            document.cookie = "collection=" + collection.id + ";path=/";
            if (!collection.publishDate) {
                var formattedDate = null;
            } else {
                var formattedDate = StringUtils.formatIsoDateString(collection.publishDate);
            }
            Florence.collection = {
                id: collection.id,
                name: collection.name,
                date: formattedDate,
                publishDate: collection.publishDate,
                type: collection.type
            };
        }
    };


Florence.Editor = {
    isDirty: false,
    data: {}
};

// Can't use randomId function in StringUtils because it is later in the main.js (because the concatenation is done alphabetically)
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
Florence.instanceID = (S4() + S4());

Florence.CreateCollection = {
    selectedRelease: ""
};

Florence.collection = {};

Florence.collectionToPublish = {};

Florence.globalVars = {pagePath: '', activeTab: false, pagePos: '', welsh: false};

Florence.Authentication = {
    accessToken: function () {
        var cookie = CookieUtils.getCookieValue("access_token");
        var token = localStorage.getItem("ons_auth_state");
        return cookie || token;
    },
    isAuthenticated: function () {
        return Florence.Authentication.accessToken() !== '';
    },
    loggedInEmail: function () {
        return localStorage.getItem("loggedInAs");
    },
    userType: function() {
        return localStorage.getItem("userType");
    }
};

Florence.ping = {
    get: function() {
        return this.entries[this.latestEntryIndex-1];
    },
    add: function(ping) {
        var timeStamp = new Date();
        this.entries[this.latestEntryIndex] = {timeStamp, ping};
        this.latestEntryIndex++;
        if (this.latestEntryIndex >= this.entries.length) this.latestEntryIndex=0;
    },
    latestEntryIndex: 0,
    entries: new Array(200)
}

Florence.Handler = function (e) {
    if (Florence.Editor.isDirty) {
        var result = confirm("You have unsaved changes. Are you sure you want to continue?");
        if (result === true) {
            Florence.Editor.isDirty = false;
            processPreviewLoad();
            return true;
        } else {
            e.preventDefault();
            return false;
        }
    }
};

// if running in a node environment export this as a module.
if (typeof module !== 'undefined') {
    module.exports = Florence;
}


