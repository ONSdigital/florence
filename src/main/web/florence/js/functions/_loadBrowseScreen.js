function loadBrowseScreen(collectionId, click, collectionData) {

    return $.ajax({
        url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
        dataType: 'json',
        type: 'GET',
        success: function (response) {

            // run through all json and add isDeletable flag to all nodes
            checkAndAddDeleteFlag(response);

            var collectionOwner = localStorage.getItem('userType');
            response['collectionOwner'] = collectionOwner;

            // Send visualisations back to visualisations folder by default on browse tree load
            if (collectionOwner == "DATA_VISUALISATION") {
                var visDirectory = "/visualisations";
                treeNodeSelect(visDirectory);
            }
            

            var browserContent = $('#iframe')[0].contentWindow;
            var baseURL = Florence.babbageBaseUrl;
            var html = templates.workBrowse(response);
            var browseTree = document.getElementById('browse-tree');
            browseTree.innerHTML = html;

            $('.workspace-browse').css("overflow", "scroll");

            //page-list
            $('.js-browse__item-title').click(function () {
                var $this = $(this),
                    $thisItem = $this.closest('.js-browse__item'),
                    uri = $thisItem.attr('data-url');

                if (uri) {
                    var newURL = baseURL + uri;

                    if (collectionOwner == 'DATA_VISUALISATION') {
                        newURL += "/";
                    }

                    console.log(newURL);

                    // Hide children for previously selected and show for selected one
                    $('.js-browse__item.selected').removeClass('selected');
                    $thisItem.addClass('selected');

                    // Hide container for item and buttons for previous and show selected one
                    $('.page__container.selected').removeClass('selected');
                    $thisItem.find('.page__container:first').addClass('selected');

                    // Hide previous displayed page buttons and show selected one
                    if ($thisItem.find('.page__buttons:first')) {
                        $('.page__buttons.selected').removeClass('selected');
                        $thisItem.find('.page__buttons:first').addClass('selected');
                    }

                    //change iframe location
                    document.getElementById('iframe').contentWindow.location.href = newURL;
                    $('.browser-location').val(newURL);
                }

                //page-list-tree
                $('.tree-nav-holder ul').removeClass('active');
                $this.parents('ul').addClass('active');
                $this.closest('li').children('ul').addClass('active');

                $this.closest('li').find('.page__item--directory').removeClass('selected');
                if ($this.hasClass('page__item--directory')) {
                    $('.page__item--directory').removeClass('selected');
                    $this.addClass('selected');
                }

                // Update browse tree scroll position
                browseScrollPos();

            });


            if (click) {
                var url = getPreviewUrl();
                if (url === "/blank") {
                    treeNodeSelect('/');
                } else {
                    treeNodeSelect(url);
                }
            } else {
                treeNodeSelect('/');

            }

            browseScrollPos();

            openVisDirectoryOnLoad();

        },
        error: function (response) {
            handleApiError(response);
        }
    });

}

function openVisDirectoryOnLoad() {
    var userType = Florence.Authentication.userType();
    
    if (userType == 'DATA_VISUALISATION') {
        $('.page-list li').removeClass('selected');
        var $this = $('.datavis-directory');
        $this.parent('li').addClass('selected');
        $this.siblings('ul').addClass('active');
        $this.addClass('selected');
    }
}

// recursively add isDeletable flag to all browse tree nodes
function checkAndAddDeleteFlag(json) {
    json['isDeletable'] = isDeletable(json.type);

    $.each(json.children, function( key, jsonObj ) {
        jsonObj['isDeletable'] = isDeletable(jsonObj.type);
            if (jsonObj.children) {
                checkAndAddDeleteFlag(jsonObj);
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

