function setupFlorence() {
    window.templates = Handlebars.templates;
    Handlebars.registerPartial("browseNode", templates.browseNode);
    Handlebars.registerPartial("browseNodeDataVis", templates.browseNodeDataVis);
    Handlebars.registerPartial("editNav", templates.editNav);
    Handlebars.registerPartial("editNavChild", templates.editNavChild);
    Handlebars.registerPartial("selectorHour", templates.selectorHour);
    Handlebars.registerPartial("selectorMinute", templates.selectorMinute);
    Handlebars.registerPartial("tickAnimation", templates.tickAnimation);
    Handlebars.registerPartial("loadingAnimation", templates.loadingAnimation);
    Handlebars.registerPartial("childDeletes", templates.childDeletes);
    Handlebars.registerHelper('select', function (value, options) {
        var $el = $('<select />').html(options.fn(this));
        $el.find('[value="' + value + '"]').attr({'selected': 'selected'});
        return $el.html();
    });
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
    //Check if array contains element
    Handlebars.registerHelper('ifContains', function (elem, list, options) {
        if (list.indexOf(elem) > -1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    // Add two values together. Primary usage was '@index + 1' to create numbered lists
    Handlebars.registerHelper('plus', function (value1, value2) {
        return value1 + value2;
    });
    // Add two values together. Primary usage was '@index + 1' to create numbered lists
    Handlebars.registerHelper('lastEditedBy', function (array) {
        if (array) {
            var event = array[array.length - 1];
            if (event) {
                return 'Last edited ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email;
            }
        }
        return '';
    });
    Handlebars.registerHelper('createdBy', function (array) {
        if (array) {
            var event = getCollectionCreatedEvent(array);
            if (event) {
                return 'Created ' + StringUtils.formatIsoDateString(new Date(event.date)) + " by " + event.email + '';
            } else {
                return "";
            }
        }
        return "";
    });
    // If two strings match
    Handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
    // If two strings don't match
    Handlebars.registerHelper('if_ne', function (a, b, opts) {
        if (a != b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    });

    Handlebars.registerHelper('comma_separated_list', function (array) {
        var asString = "";

        if (array) {
            array.forEach(function (item) {
                asString = asString + item + ", ";
            });
            return asString.substring(0, asString.lastIndexOf(","));
        }
        return asString;
    });

    Handlebars.registerHelper('parent_dir', function (uri) {
        var pathSections = uri.split("/");
        if (pathSections.length > 0) {
            return "/" + pathSections[pathSections.length -1];
        }
        return "";
    });

    Handlebars.registerHelper('debug', function (message, object) {
        console.log("DEBUG: " + message + " " + JSON.stringify(object));
        return "";
    });


    Florence.globalVars.activeTab = false;

    // load main florence template
    var florence = templates.florence;

    $('body').append(florence);
    Florence.refreshAdminMenu();

    var adminMenu = $('.js-nav');
    // dirty checks on admin menu
    adminMenu.on('click', '.js-nav-item', function () {
        if (Florence.Editor.isDirty) {
            swal({
                title: "Warning",
                text: "If you do not come back to this page, you will lose any unsaved changes",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel"
            }, function (result) {
                if (result === true) {
                    Florence.Editor.isDirty = false;
                    processMenuClick(this);
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            processMenuClick(this);
        }
    });


    window.onbeforeunload = function () {
        if (Florence.Editor.isDirty) {
            return 'You have unsaved changes.';
        }
    };
    viewController();


    function processMenuClick(clicked) {
        Florence.collection = {};

        $('.js-nav-item--collection').hide();
        $('.js-nav-item').removeClass('selected');
        var menuItem = $(clicked);

        menuItem.addClass('selected');


        if (menuItem.hasClass("js-nav-item--collections")) {
            viewController('collections');
        } else if (menuItem.hasClass("js-nav-item--collection")) {
            var thisCollection = CookieUtils.getCookieValue("collection");
            viewCollections(thisCollection);
            $(".js-nav-item--collections").addClass('selected');
        } else if (menuItem.hasClass("js-nav-item--users")) {
            viewController('users');
        } else if (menuItem.hasClass("js-nav-item--teams")) {
            viewController('teams');
        } else if (menuItem.hasClass("js-nav-item--publish")) {
            viewController('publish');
        } else if (menuItem.hasClass("js-nav-item--reports")) {
            viewController('reports');
        } else if (menuItem.hasClass("js-nav-item--login")) {
            viewController('login');
        } else if (menuItem.hasClass("js-nav-item--logout")) {
            logout();
            viewController();
        }
    }

    // Get ping times to zebedee and surface for user
    var lastPingTime;
    var pingTimes = [];

    function doPing() {
        var start = new Date().getTime();
        $.ajax({
            url: "/zebedee/ping",
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify({
                lastPingTime: lastPingTime
            }),
            success: function (response) {

                // Handle session information
                checkSessionTimeout(response);

                var end = new Date().getTime();
                var time = end - start;

                lastPingTime = time;
                pingTimes.push(time);
                if (pingTimes.length > 5)
                    pingTimes.shift();

                var sum = 0;
                for (var i = 0; i < pingTimes.length; ++i) {
                    sum += pingTimes[i];
                }

                var averagePingTime = sum / pingTimes.length;

                networkStatus(lastPingTime);

                if (averagePingTime < 100) {
                    console.log("ping time: pretty good! " + time + " average: " + averagePingTime + " " + pingTimes);
                } else if (averagePingTime < 300) {
                    console.log("ping time: not so good! " + time + " average: " + averagePingTime + " " + pingTimes);
                } else {
                    console.log("ping time: really bad! " + time);
                }

                pingTimer = setTimeout(function () {
                    doPing();
                }, 10000);
            }
        });
    }

    var pingTimer = setTimeout(function () {
        doPing();
    }, 10000);

    // Alert user if ping states that their session is going to log out (log out if it's run out too)
    var countdownIsShown = false,
        secondCounter = 0;

    function checkSessionTimeout(sessionData) {
        var currentDateTime = new Date(),
            sessionExpiry = new Date(sessionData.sessionExpiryDate),
            timeLeftInSession = parseInt((sessionExpiry - currentDateTime)/1000);

        if (timeLeftInSession <= 31 && !countdownIsShown) {
            // Session is going to expire soon, warn user and give them option to reset session timer
            countdownIsShown = true;
            secondCounter = timeLeftInSession;
            console.log("Session to expire in " + timeLeftInSession + " seconds");
            sweetAlert({
                type: "warning",
                title: "Session expiring in <span id='session-expiry'>" + timeLeftInSession + "</span> seconds",
                text: "You've not been active for sometime now, are you still using Florence?",
                html: true,
                confirmButtonText: "I'm still using Florence!"
            }, function(response) {
                if (response) {
                    $.get("/zebedee/users?email=" + Florence.Authentication.loggedInEmail());
                    countdownIsShown = false;
                    console.log("Session timer reset");
                }
            });
            // Update alert with amount of time user has left until they're logged out
            var sessionCountdown = setInterval(function() {
                secondCounter -= 1;
                $('#session-expiry').html(secondCounter);

                // If session has timed out & the warning hasn't been closed yet, log out the user and inform them why they've been logged out
                if (secondCounter === 0 && countdownIsShown) {
                    sweetAlert({
                        type: "warning",
                        title: "Your session has expired",
                        text: "Florence was left inactive for too long so you have been logged out"
                    });
                    logout();
                    countdownIsShown = false;
                    clearInterval(sessionCountdown);
                } else if (!countdownIsShown) {
                    // User responded to warning so Florence is active now, clear the countdown
                    clearInterval(sessionCountdown);
                }
            }, 1000);
        }
    }

    // Reset default functions from certain elements - eg form submits
    resetPage();

    // Log every click that will be changing the state or data in Florence
    $(document).on('click', 'a, button, input[type="button"], iframe, .table--primary tr, .js-nav-item, .page__item', function(e) {
        var diagnosticJSON = JSON.stringify(new clickEventObject(e));
        $.ajax({
            url: "/zebedee/clickEventLog",
            type: 'POST',
            contentType: "application/json",
            data: diagnosticJSON,
            async: true,
        });
    });

    function clickEventObject(event) {
        this.user = localStorage.getItem('loggedInAs');
        triggerTemp = {};
        collectionTemp = {};

        if (event.target.id) {
            triggerTemp.elementId = event.target.id;
        }

        if ($(event.target).attr('class')) {
            classes = [];
            $.each($(event.target).attr('class').split(" "), function(index, value) {
                if (value) {
                    classes.push(value);
                }
            });
            if (classes.length > 0) {
                triggerTemp.elementClasses = classes;
            }
        }

        if (Florence.collection.id) {
            collectionTemp.id = Florence.collection.id;
        }

        if (Florence.collection.name) {
            collectionTemp.name = Florence.collection.name;
        }

        if (Florence.collection.type) {
            collectionTemp.type = Florence.collection.type;
        }

        if (triggerTemp.elementId || triggerTemp.elementClasses) {
            this.trigger = triggerTemp;
        }

        if (collectionTemp.id || collectionTemp.name || collectionTemp.type) {
            this.collection = collectionTemp
        }
    }

    // Check running version versus latest and notify user if they don't match
    var runningVersion,
        userWarned = false;
    function checkVersion() {
        return fetch('assets/version.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(responseJson) {
                return responseJson;
            })
            .catch(function(err) {
                console.log("Error getting latest Florence version: ", err);
                return err
            });
    }

    checkVersion().then(function(response) {
        runningVersion = response;
    });

    setInterval(function() {
        // Get the latest version and alert user if it differs from version stored on load (but only if the user hasn't been warned already, so they don't get spammed after being warned already)
        if (!userWarned) {
            checkVersion().then(function (response) {
                if (response.major !== runningVersion.major || response.minor !== runningVersion.minor || response.build !== runningVersion.build) {
                    console.log("New version of Florence available: ", response.major + "." + response.minor + "." + response.build);
                    swal({
                        title: "New version of Florence available",
                        type: "info",
                        showCancelButton: true,
                        closeOnCancel: false,
                        closeOnConfirm: false,
                        confirmButtonText: "Refresh Florence",
                        cancelButtonText: "Don't refresh"
                    }, function (isConfirm) {
                        userWarned = true;
                        if (isConfirm) {
                            location.reload();
                        } else {
                            swal("Warning", "Florence could be unstable without the latest version", "warning")
                        }
                    });
                    runningVersion = response;
                }
            });
        }
    }, 10000)
}

