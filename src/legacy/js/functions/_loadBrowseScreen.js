function loadBrowseScreen(collectionId, click, collectionData) {

    // Get collection data if it's undefined and re-run the function once request has returned
    if (!collectionData) {
        getCollection(collectionId, success = function(getCollectionResponse) {
                loadBrowseScreen(collectionId, click, getCollectionResponse);
            }, error = function() {
                console.log('Error getting collection data for: ', collectionId);
            });

        return false;
    }

    return $.ajax({
        url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            
            var browseData = response;
            browseData.children = response.children.map(item => {
                if (!item.uri && item.contentPath === "/visualisations") {
                    item.isVisualisationsDirectory = true;
                }
                return item;
            });

            checkAndAddDeleteFlag(browseData, collectionData);

            var html = templates.workBrowse(browseData);
            var browseTree = document.getElementById('browse-tree');
            browseTree.innerHTML = html;

            $('.workspace-browse').css("overflow", "scroll");

            bindBrowseTreeClick();

            if (click) {
                var url = getPreviewUrl();
                var urlParts = url.split('/');

                if (urlParts[1] === "visualisations" && urlParts[urlParts.length-1].indexOf('.html') >= 0) {
                // It's attempting to find a page but this is a visualisation HTML file.
                // So, remove the HTML page from the end of the URL and just look at the JSON page.
                    url = "/" + urlParts[1] + "/" + urlParts[2];
                }
                treeNodeSelect(url === "/blank" ? "/" : url);
            } else {
                treeNodeSelect('/');
            }

            // Switch to browse tab (if not already)
            var $browseTab = $('#browse');
            if (!$browseTab.hasClass('selected')) {
                $('.js-workspace-nav .js-workspace-nav__item').removeClass('selected');
                $browseTab.addClass('selected');
            }

        },
        error: function (response) {
            handleApiError(response);
        }
    });

}

// Bind the actions for a click on a browse tree item
function bindBrowseTreeClick() {
    $('.js-browse__item-title').click(function () {
        var $this = $(this),
            $thisItem = $this.closest('.js-browse__item'),
            uri = $thisItem.attr('data-url'),
            baseURL = Florence.babbageBaseUrl;
            isVisualisationsDirectory = $thisItem[0].hasAttribute('data-is-visualisations');

        if (uri) {
            var newURL = baseURL + uri;

            treeNodeSelect(newURL);

            // Update iframe location which will send change event for iframe to update too
            document.getElementById('iframe').contentWindow.location.href = newURL;
            $('.browser-location').val(newURL);

        } else if (!uri && isVisualisationsDirectory) {
            // This is the data vis directory - handle differently
            openVisDirectory();
        } else {

            // Set all directories above it in the tree to be active when a directory clicked
            selectParentDirectories($this);
        }

        // Open active branches in browse tree
        openBrowseBranch($this);
    });
}

function openBrowseBranch($this) {
    $('.tree-nav-holder ul').removeClass('active');
    $this.parents('ul').addClass('active');
    $this.closest('li').children('ul').addClass('active');
}

function openVisDirectory() {
    $('.js-browse__item .page__container').removeClass('selected');
    $('.page__buttons--list.selected').removeClass('selected');
    var $this = $('.datavis-directory');
    $this.next('.page__buttons--list').addClass('selected')
        .closest('.page__container').addClass('selected')
        .next('.js-browse__children').addClass('active');
}

// recursively add isDeletable and deleteIsInCollection flags to all browse tree nodes
function checkAndAddDeleteFlag(browseTree, collectionData) {
    browseTree['isDeletable'] = isDeletable(browseTree.type);
    browseTree['deleteIsInCollection'] = deleteIsInCollection(browseTree.contentPath, collectionData);

    $.each(browseTree.children, function( key, browseTreeNode ) {
        if (browseTreeNode.children) {
            checkAndAddDeleteFlag(browseTreeNode, collectionData);
        }
    });
}

// set deletable flag to false for certain page types
function isDeletable(type) {
    if (type == 'home_page' || type == 'taxonomy_landing_page' || type == 'product_page') {
        return false;
    } else {
        return true;
    }
}

// check if given uri is marked for deletion in current collection
function deleteIsInCollection(uri, collectionData) {
    var bool;
    if (collectionData.pendingDeletes) {
        $.each(collectionData.pendingDeletes, function (key, deleteMarker) {
            if (uri == deleteMarker.root.uri) {
                bool = true;
                return false;
            } else {
                bool = false;
            }
        });
    }
    return bool;
}

// display open directory icon for parents directories
function selectParentDirectories($this) {
    $('.page__item--directory').removeClass('selected'); // remove previous selections
    $this.parents('.js-browse__item--directory').find('.page__item--directory:first').addClass('selected'); // select directories along parent path
}

