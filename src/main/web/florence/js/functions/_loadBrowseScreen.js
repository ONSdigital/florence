function loadBrowseScreen(collectionId, click, collectionData) {

    return $.ajax({
        url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
        dataType: 'json',
        type: 'GET',
        success: function (response) {

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
                    $('.page-container.selected').removeClass('selected');
                    $thisItem.find('.page-container:first').addClass('selected');

                    // Hide previous displayed page buttons and show selected one
                    if ($thisItem.find('.page-options:first')) {
                        $('.page-options.selected').removeClass('selected');
                        $thisItem.find('.page-options:first').addClass('selected');
                    }

                    //change iframe location
                    document.getElementById('iframe').contentWindow.location.href = newURL;
                    $('.browser-location').val(newURL);
                }

                //page-list-tree
                $('.tree-nav-holder ul').removeClass('active');
                $this.parents('ul').addClass('active');
                $this.closest('li').children('ul').addClass('active');

                $this.closest('li').find('.page-item--directory').removeClass('page-item--directory--selected');
                if ($this.hasClass('page-item--directory')) {
                    $('.page-item--directory').removeClass('page-item--directory--selected');
                    $this.addClass('page-item--directory--selected');
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
        $this.addClass('page-item--directory--selected');
    }
}

