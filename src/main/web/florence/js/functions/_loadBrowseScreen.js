function loadBrowseScreen(collectionId, click) {

    // Check if browse tree data already in local storage
    // if (localStorage.getItem("browseTree") === null) {
    //     // Request browse tree from zebedee
    //     var request = $.ajax({
    //         url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
    //         dataType: 'json',
    //         type: 'GET',
    //         success: function (response) {
    //             console.log(request);
    //             bindBrowseEvents(response, click);
    //         },
    //         error: function (response) {
    //             handleApiError(response);
    //         }
    //     });
    //     localStorage.setItem('browseTree', request);
    //     return request;
    // } else {
    //     console.log('In local storage');
    //     // Browse tree is available in local storage, return that instead
    //     var browseTree = localStorage.getItem('browseTree');
    //     return bindBrowseEvents(browseTree, click);
    // }

    console.log(collectionId);

    // Request browse tree from zebedee
    console.time('Get tree');
    return $.ajax({
        url: "/zebedee/collectionBrowseTree/" + collectionId, // url: "/navigation",
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            console.timeEnd(response);
            bindBrowseEvents(response, click);
        },
        error: function (response) {
            handleApiError(response);
        }
    });
}

function bindBrowseEvents(data, click) {
    console.time('Build browse');
    var browserContent = $('#iframe')[0].contentWindow;
    var baseURL = Florence.tredegarBaseUrl;
    console.time('Handlebars');
    var html = templates.workBrowse(data);
    console.timeEnd('Handlebars');
    console.time('Append html');
    $('.workspace-menu').html(html);
    console.timeEnd('Append html');
    $('.workspace-browse').css("overflow", "scroll");

    console.time('Item binding');
    //page-list
    $('.page-item').click(function () {
        var $this = $(this),
            uri = $this.closest('li').attr('data-url');


        if (uri) {
            var newURL = baseURL + uri;

            $('.page-list li').removeClass('selected');
            $this.parent('li').addClass('selected');

            $('.page-options').hide();
            $this.next('.page-options').show();

            //change iframe location
            browserContent.location.href = newURL;
            Florence.globalVars.pagePath = uri;
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
    });
    console.timeEnd('Item binding');

    if (click) {
        // var url = getPathName();
        // if (url === "/blank") {
        //     setTimeout(treeNodeSelect('/'), 500);
        // } else {
        //     treeNodeSelect(url);
        // }
        var url = getPathName();
        treeNodeSelect(url);
    } else {
        treeNodeSelect('/');
    }

    console.timeEnd('Build browse');
}

