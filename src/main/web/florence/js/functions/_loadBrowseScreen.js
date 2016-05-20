function loadBrowseScreen(collectionId, click, collectionData) {

    return $.ajax({
        url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
        dataType: 'json',
        type: 'GET',
        success: function (response) {

            var collectionOwner = collectionData.collectionOwner;
            response['collectionOwner'] = collectionOwner;

            var browserContent = $('#iframe')[0].contentWindow;
            var baseURL = Florence.tredegarBaseUrl;
            var html = templates.workBrowse(response);
            var browseTree = document.getElementById('browse-tree');
            browseTree.innerHTML = html;

            $('.workspace-browse').css("overflow", "scroll");

            //page-list
            $('.page-item').click(function () {
                var $this = $(this),
                    uri = $this.closest('li').attr('data-url');

                if (uri) {
                    var newURL = baseURL + uri;

                    $('.page-list li').removeClass('selected');
                    $this.parent('li').addClass('selected');

                    //change iframe location
                    browserContent.location.href = newURL;
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
                var url = getPathName();
                if (url === "/blank") {
                    treeNodeSelect('/');
                } else {
                    treeNodeSelect(url);
                }
            } else {
                treeNodeSelect('/');
            }

        },
        error: function (response) {
            handleApiError(response);
        }
    });
}

