function treeNodeSelect(url) {
    var urlPart = url.replace(Florence.babbageBaseUrl, '');

    var $selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
    $('.js-browse__item.selected').removeClass('selected');
    $selectedListItem.addClass('selected');

    // Check to see if the user has selected a visualisation. If so, start the process of fetching visualisation data 
    // and rendering the select element so users can preview the visualisation without having to go to the Edit screen
    var selectWrapper = $('#select-vis-wrapper');
    if (isVisualisation($selectedListItem)) {
        loadVisualisationPreviewer($selectedListItem.attr('data-url'), Florence.collection.id)
    } else if (selectWrapper) {
        selectWrapper.hide();
        $('#browser-location').show();
    }

    // Hide container for item and buttons for previous and show selected one
    $('.page__container.selected').removeClass('selected');
    $selectedListItem.find('.page__container:first').addClass('selected');

    // Hide previous displayed page buttons and show selected one
    if ($selectedListItem.find('.page__buttons:first')) {
        $('.page__buttons.selected').removeClass('selected');
        $selectedListItem.find('.page__buttons:first').addClass('selected');
    }

    //page-list-tree
    $('.tree-nav-holder ul').removeClass('active');
    $selectedListItem.parents('ul').addClass('active');
    $selectedListItem.closest('li').children('ul').addClass('active');

    // Update browse tree scroll position
    browseScrollPos();

    // Open active directories
    selectParentDirectories($selectedListItem);
}

function isVisualisation(node) {
    return node.attr("data-url").split("/").includes("visualisations")
}