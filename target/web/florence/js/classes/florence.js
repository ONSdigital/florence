// The florence object is used for storing application state.
var Florence = Florence || {
        babbageBaseUrl: window.location.origin,
        refreshAdminMenu: function () {
            // Display a message to show users are on dev or sandpit
            Florence.environment = isDevOrSandpit();

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

Florence.CreateCollection = {
    selectedRelease: ""
};

Florence.collection = {};

Florence.collectionToPublish = {};

Florence.globalVars = {pagePath: '', activeTab: false, pagePos: '', welsh: false};

Florence.Authentication = {
    accessToken: function () {
        return CookieUtils.getCookieValue("access_token");
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


