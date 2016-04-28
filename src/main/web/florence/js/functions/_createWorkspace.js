/**
 * Handles the initial creation of the workspace screen.
 * @param path - path to iframe
 * @param collectionId
 * @param menu - opens a specific menu
 * @param stopEventListener - separates the link between editor and iframe
 * @returns {boolean}
 */

function createWorkspace(path, collectionId, menu, stopEventListener) {
    var safePath = '';
    $("#working-on").on('click', function () {
    }); // add event listener to mainNav

    if (stopEventListener) {
        document.getElementById('iframe').onload = function () {
            var browserLocation = document.getElementById('iframe').contentWindow.location.href;
            $('.browser-location').val(browserLocation);
            var iframeEvent = document.getElementById('iframe').contentWindow;
            iframeEvent.removeEventListener('click', Florence.Handler, true);
        };
        return false;
    } else {
        var currentPath = '';
        if (path) {
            currentPath = path;
            safePath = checkPathSlashes(currentPath);
        }

        Florence.globalVars.pagePath = safePath;
        if (Florence.globalVars.welsh !== true) {
            document.cookie = "lang=" + "en;path=/";
        } else {
            document.cookie = "lang=" + "cy;path=/";
        }
        Florence.refreshAdminMenu();

        var workSpace = templates.workSpace(Florence.tredegarBaseUrl + safePath);
        $('.section').html(workSpace);

        document.getElementById('iframe').onload = function () {
            detectPreviewClick();
        };

        // Set browse panel to full height to show loading icon
        $('.loader').css('margin-top', '84px');
        $('.workspace-menu').height($('.workspace-nav').height());

        // Detect changes to preview and handle accordingly
        processPreviewLoad();

        // Update preview URL on initial load of workspace
        updateBrowserURL();

        if (Florence.globalVars.welsh !== true) {
            $('#nav--workspace__welsh').empty().append('<a href="#">Language: English</a>');
        } else {
            $('#nav--workspace__welsh').empty().append('<a href="#">Language: Welsh</a>');
        }

        //click handlers
        $('.nav--workspace > li').click(function () {
            menu = '';
            if (Florence.Editor.isDirty) {
                swal({
                    title: "Warning",
                    text: "You have unsaved changes. Are you sure you want to continue?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Continue",
                    cancelButtonText: "Cancel"
                }, function (result) {
                    if (result === true) {
                        Florence.Editor.isDirty = false;
                        processMenuClick(this);
                    } else {
                        return false;
                    }
                });
            } else {
                processMenuClick(this);
            }
        });


        function processMenuClick(clicked) {
            var menuItem = $(clicked);

            $('.nav--workspace li').removeClass('selected');
            menuItem.addClass('selected');

        if (menuItem.is('#browse')) {
          loadBrowseScreen(collectionId, 'click');
        } else if (menuItem.is('#create')) {
          Florence.globalVars.pagePath = getPathName();
          loadCreateScreen(Florence.globalVars.pagePath, collectionId);
        } else if (menuItem.is('#edit')) {
          Florence.globalVars.pagePath = getPathName();
          loadPageDataIntoEditor(Florence.globalVars.pagePath, Florence.collection.id);
        } else if (menuItem.is('#import')) {
          loadImportScreen(Florence.collection.id);
        } else {
          loadBrowseScreen(collectionId);
        }
      }

        $('#nav--workspace__welsh').on('click', function () {
            Florence.globalVars.welsh = Florence.globalVars.welsh === false ? true : false;
            createWorkspace(Florence.globalVars.pagePath, collectionId, 'browse');
        });

        $('.workspace-menu').on('click', '.btn-browse-create', function () {
            var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
            var spanType = $(this).parent().prev('span');
            var typeClass = spanType[0].attributes[0].nodeValue;
            var typeGroup = typeClass.match(/--(\w*)$/);
            var type = typeGroup[1];
            Florence.globalVars.pagePath = dest;
            $('.nav--workspace li').removeClass('selected');
            $("#create").addClass('selected');
            loadCreateScreen(Florence.globalVars.pagePath, collectionId, type);
        });

        $('.workspace-menu').on('click', '.btn-browse-edit', function () {
            var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
            Florence.globalVars.pagePath = dest;
            $('.nav--workspace li').removeClass('selected');
            $("#edit").addClass('selected');
            loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
        });

        if (menu === 'edit') {
            $('.nav--workspace li').removeClass('selected');
            $("#edit").addClass('selected');
            loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
        } else if (menu === 'browse') {
            $('.nav--workspace li').removeClass('selected');
            $("#browse").addClass('selected');
            loadBrowseScreen(collectionId, 'click');
        }
        //};
    }
}


function detectPreviewClick() {
    // Detect whenever there is a clickon the preview and then passes onto global Florence.Handler to deal with click
    var iframeEvent = document.getElementById('iframe').contentWindow;
    iframeEvent.addEventListener('click', Florence.Handler, true);
}

function processPreviewLoad() {
    onIframeLoad(function(event) {
        var iframe = $('#iframe'); //iframe element in DOM, check length later to ensure it's on the page before continuing
        if (event.data == "load" && iframe.length) {
            processPageChange(); // Update browse tree
            browseScrollPos(); // Update browse tree scroll position
            updateBrowserURL(); // Update browser preview URL
        }
    });
}

function onIframeLoad(runFunction) {
    window.addEventListener( "message", function(event){
        runFunction(event);
    });
}

function processPageChange() {
    checkForPageChanged(function (newUrl) {
        var safeUrl = checkPathSlashes(newUrl);
        Florence.globalVars.pagePath = safeUrl;
        if ($('.workspace-edit').length) {
            loadPageDataIntoEditor(safeUrl, Florence.collection.id, 'click');
            return false;
        }
        else if ($('.workspace-browse').length) {
            treeNodeSelect(safeUrl);
            return false;
        }
    });
}

function browseScrollPos() {
    // Update the scroll position of the browse tree if selected item off screen

    console.log('scroll');

    var $selectedItem = $('.workspace-browse li.selected'),
        $browseTree = $('.workspace-browse');

    var selectedTop = parseInt($selectedItem.offset().top),
        selectedBottom = selectedTop + parseInt($selectedItem.height()),
        browseTop = parseInt($browseTree.offset().top),
        browseBottom = browseTop + parseInt($browseTree.height());
    if (selectedTop < browseTop || selectedBottom > browseBottom ) {
        $browseTree.scrollTop(selectedTop);
    }
}

function updateBrowserURL() {
    $('.browser-location').val(Florence.tredegarBaseUrl + Florence.globalVars.pagePath);
}

