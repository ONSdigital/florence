    /**
 * Handles the initial creation of the workspace screen.
 * @param path - path to iframe
 * @param collectionId
 * @param menu - opens a specific menu
 * @param collectionData - JSON of the currently active collection
 * @param stopEventListener - separates the link between editor and iframe
 * @returns {boolean}
 **/

function createWorkspace(path, collectionId, menu, collectionData, stopEventListener) {
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

        var workSpace = templates.workSpace(Florence.babbageBaseUrl + safePath);
        $('.section').html(workSpace);

        // Store nav objects
        var $nav = $('.js-workspace-nav'),
            $navItem = $nav.find('.js-workspace-nav__item');

        // Set browse panel to full height to show loading icon
        $('.loader').css('margin-top', '84px');
        $('.workspace-menu').height($('.workspace-nav').height());


        /* Setup preview */
        // Detect click on preview, stopping browsing around preview from getting rid of unsaved data accidentally
        detectPreviewClick();

        // Detect changes to preview and handle accordingly
        processPreviewLoad(collectionId, collectionData);

        // Update preview URL on initial load of workspace
        updateBrowserURL(path);

        if (Florence.globalVars.welsh !== true) {
            $('#nav--workspace__welsh').empty().append('<a href="#">Language: English</a>');
        } else {
            $('#nav--workspace__welsh').empty().append('<a href="#">Language: Welsh</a>');
        }

        /* Bind clicking */
        $navItem.click(function () {
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

            $navItem.removeClass('selected');
            menuItem.addClass('selected');

            if (menuItem.is('#browse')) {
                loadBrowseScreen(collectionId, 'click', collectionData);
            } else if (menuItem.is('#create')) {
                Florence.globalVars.pagePath = getPreviewUrl();
                var type = false;
                loadCreateScreen(Florence.globalVars.pagePath, collectionId, type, collectionData);
            } else if (menuItem.is('#edit')) {
                Florence.globalVars.pagePath = getPreviewUrl();
                loadPageDataIntoEditor(Florence.globalVars.pagePath, Florence.collection.id);
            } else if (menuItem.is('#import')) {
                loadImportScreen(Florence.collection.id);
            } else {
                loadBrowseScreen(collectionId, false, collectionData);
            }
        }

        $('#nav--workspace__welsh').on('click', function () {
            Florence.globalVars.welsh = Florence.globalVars.welsh === false ? true : false;
            createWorkspace(Florence.globalVars.pagePath, collectionId, 'browse');
        });

        $('.workspace-menu').on('click', '.btn-browse-create', function () {
            var dest = $('.tree-nav-holder ul').find('.js-browse__item.selected').attr('data-url');
            // var spanType = $(this).parent().prev('span');
            var spanType = $(this).closest('.js-browse__item').find('.js-browse__item-title:first');
            var typeClass = spanType[0].attributes[0].nodeValue;
            var typeGroup = typeClass.match(/--(\w*)$/);
            var type = typeGroup[1];
            Florence.globalVars.pagePath = dest;
            $navItem.removeClass('selected');
            $("#create").addClass('selected');
            loadCreateScreen(Florence.globalVars.pagePath, collectionId, type, collectionData);
        });

        $('.workspace-menu').on('click', '.btn-browse-delete', function () {
            var $parentItem = $('.tree-nav-holder ul').find('.js-browse__item.selected');
            var $parentContainer = $parentItem.find('.page__container.selected');
            var $button = $parentContainer.find('.btn-browse-delete');
            var dest = $parentItem.attr('data-url');
            var spanType = $(this).parent().prev('span');
            var title = spanType.html();
            addDeleteMarker(dest, title, function() {
                $parentContainer.addClass('animating').addClass('deleted');
                toggleDeleteRevertButton($parentContainer);
                toggleDeleteRevertChildren($parentItem);

                // Stops animation happening anytime other than when going between delete/undo delete
                $parentContainer.one("webkitTransitionEnd transitionEnd", function() {
                    $parentContainer.removeClass('animating');
                });
            });
        });

        $('.workspace-menu').on('click', '.btn-browse-delete-revert', function () {
            var $parentItem = $('.tree-nav-holder ul').find('.js-browse__item.selected');
            var $parentContainer = $parentItem.find('.page__container.selected');
            var $button = $parentContainer.find('.btn-browse-delete-revert');
            var dest = $parentItem.attr('data-url');
            removeDeleteMarker(dest, function() {
                $parentContainer.addClass('animating').removeClass('deleted');
                toggleDeleteRevertButton($parentContainer);
                toggleDeleteRevertChildren($parentItem);

                // Stops animation happening anytime other than when going between delete/undo delete
                $parentContainer.one("webkitTransitionEnd transitionEnd", function() {
                    $parentContainer.removeClass('animating');
                });
            });
        });

        $('.workspace-menu').on('click', '.btn-browse-move', function() {
            var $parentItem = $('.tree-nav-holder ul').find('.js-browse__item.selected'),
                fromUrl = $parentItem.attr('data-url');

            moveBrowseNode(fromUrl);
        });

        $('.workspace-menu').on('click', '.btn-browse-create-datavis', function () {
            var dest = '/visualisations';
            var type = 'visualisation';
            Florence.globalVars.pagePath = dest;
            $navItem.removeClass('selected');
            $("#create").addClass('selected');
            loadCreateScreen(Florence.globalVars.pagePath, collectionId, type, collectionData);
        });

        $('.workspace-menu').on('click', '.btn-browse-edit', function () {
            var dest = $('.tree-nav-holder ul').find('.js-browse__item.selected').attr('data-url');
            Florence.globalVars.pagePath = dest;
            $navItem.removeClass('selected');
            $("#edit").addClass('selected');
            var checkDest = dest;
            if(!dest.endsWith("/data.json")) {
                checkDest += "/data.json";
            }
            $.ajax({
                url: "/zebedee/checkcollectionsforuri?uri=" + checkDest,
                type: 'GET',
                contentType: 'application/json',
                cache: false,
                success: function (response, textStatus, xhr) {
                    if (xhr.status == 204 || response === collectionData.name) {
                        loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
                        return;
                    }
                    sweetAlert("Cannot edit this page", "This page is already in another collection: " + response, "error");
                },
                error: function (response) {
                    handleApiError(response);
                }
            });
        });

        $('.workspace-menu').on('click', '.js-browse__menu', function() {
            var $thisItem = $('.js-browse__item.selected .page__container.selected'),
                $thisBtn = $thisItem.find('.js-browse__menu'),
                $thisMenu = $thisBtn.next('.page__menu'),
                menuHidden;

            function toggleMenu() {
                $thisBtn.toggleClass('active').children('.hamburger-icon__span').toggleClass('active');
                $thisItem.find('.js-browse__buttons--primary').toggleClass('active');
                $thisMenu.toggleClass('active');
            }

            // Toggle menu on click
            toggleMenu();

            // Shut menu if another item or button is clicked
            $('.js-browse__item-title, .btn-browse-move, .btn-browse-delete').on('click', function() {
                if (!menuHidden) {
                    toggleMenu();
                    menuHidden = true;
                }
            });
        });

        if (menu === 'edit') {
            $navItem.removeClass('selected');
            $("#edit").addClass('selected');
            loadPageDataIntoEditor(Florence.globalVars.pagePath, collectionId);
        } else if (menu === 'browse') {
            $navItem.removeClass('selected');
            $("#browse").addClass('selected');
            loadBrowseScreen(collectionId, 'click', collectionData);
        }
        //};
    }
}

// SHOULD BE REPLACED BY 'onIframeLoad' -  Bind click event to iframe element and run global Florence.Handler
function detectPreviewClick() {
    var iframeEvent = document.getElementById('iframe').contentWindow;
    iframeEvent.addEventListener('click', Florence.Handler, true);
}

function processPreviewLoad(collectionId, collectionData) {
        // Collection of functions to run on iframe load
        onIframeLoad(function (event) {
            var $iframe = $('#iframe'), // iframe element in DOM, check length later to ensure it's on the page before continuing
                $browse = $('#browse'); // 'Browse' menu tab, check later if it's selected

            // Check it is a load event and that iframe is in the DOM still before processing the load
            if (event.data == "load" && $iframe.length) {
                // Check whether page URL is different and then load editor or update browse tree
                checkForPageChanged(function (newUrl) {
                    var safeUrl = checkPathSlashes(newUrl),
                        selectedItem = $('.workspace-browse li.selected').attr('data-url'); // Get active node in the browse tree


                    Florence.globalVars.pagePath = safeUrl;

                    if (safeUrl.split('/')[1] === "visualisations") {
                        return;
                    }
                    
                    if ($('.workspace-edit').length || $('.workspace-create').length) {

                        // Switch to browse screen if navigating around preview whilst on create or edit tab
                        loadBrowseScreen(collectionId, 'click', collectionData);
                    }
                    else if ($('.workspace-browse').length && selectedItem != Florence.globalVars.pagePath) {
                        // Only update browse tree of on 'browse' tab and preview and active node don't already match
                        treeNodeSelect(safeUrl);
                    }
                });
                updateBrowserURL(); // Update browser preview URL

                if ($browse.hasClass('selected')) {
                    browseScrollPos(); // Update browse tree scroll position
                }
            }
        });
    // }
}

// Reusable iframe startload event - uses message sent up form babbage on window.load
function onIframeLoad(runFunction) {
    window.addEventListener("message", function (event) {
        runFunction(event);
    });
}

// Update the scroll position of the browse tree if selected item off screen
function browseScrollPos() {
    var $selectedItem = $('.workspace-browse li.selected .page__container.selected'),
        $browseTree = $('.workspace-browse');

    if ($selectedItem.length) {
        var selectedTop = $selectedItem.offset().top,
            selectedBottom = selectedTop + $selectedItem.height(),
            browseTop = $browseTree.offset().top,
            browseBottom = browseTop + $browseTree.height(),
            navHeight = $('.nav').height();

        if (selectedTop < browseTop) {
            console.log('Item was outside of viewable browse tree');
            $browseTree.scrollTop($browseTree.scrollTop() + (selectedTop) - (navHeight / 2));
        } else if (selectedBottom > browseBottom) {
            console.log('Item was outside of viewable browse tree');
            $browseTree.scrollTop(selectedBottom - (navHeight / 2) - $selectedItem.height())
        }
    }
}

function updateBrowserURL(url) {
    if(!url) {
        url = Florence.globalVars.pagePath;
    }
    $('.browser-location').val(Florence.babbageBaseUrl + url);

    // Disable preview for visualisations
    var isVisualisation = url.split('/')[1] === "visualisations";
    if (isVisualisation && $('#browse.selected').length > 0) {
        $('.browser').addClass('disabled');
        return;
    }

    // Enable the preview if we're viewing a normal page and the preview is currently disabled
    if ($('.browser.disabled').length > 0) {
        $('.browser.disabled').removeClass('disabled');
    }
}

// toggle delete button from 'delete' to 'revert' for content marked as to be deleted and remove/show other buttons in item
function toggleDeleteRevertButton($container) {
    $container.find('.btn-browse-delete-revert, .js-browse__buttons--primary, .js-browse__buttons--secondary').toggle();
}

// Toggle displaying children as deleted or not deleted
function toggleDeleteRevertChildren($item) {
    var $childContainer = $item.find('.js-browse__item .page__container'),
        isDeleting = $item.children('.page__container').hasClass('deleted');

    if (isDeleting) {
        $childContainer.addClass('deleted');
    } else {
        $childContainer.removeClass('deleted');

        // If a child item has previously been deleted but is being shown by a parent then undo the toggle buttons
        if ($childContainer.find('.btn-browse-delete-revert').length) {
            // toggleDeleteRevertButton($childContainer.find('.btn-browse-delete-revert'));
            toggleDeleteRevertButton($childContainer);
        }
    }

    $childContainer.find('.page__buttons').toggleClass('deleted');
}

