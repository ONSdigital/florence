function treeNodeSelect(url) {
    var urlPart = url.replace(Florence.babbageBaseUrl, '');
    var $selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
    $('.js-browse__item.selected').removeClass('selected');
    $selectedListItem.addClass('selected');

    // Hide container for item and buttons for previous and show selected one
    $('.page-container.selected').removeClass('selected');
    $selectedListItem.find('.page-container:first').addClass('selected');

    // Hide previous displayed page buttons and show selected one
    if ($selectedListItem.find('.page-options:first')) {
        $('.page-options.selected').removeClass('selected');
        $selectedListItem.find('.page-options:first').addClass('selected');
    }

    //page-list-tree
    $('.tree-nav-holder ul').removeClass('active');
    $selectedListItem.parents('ul').addClass('active');
    $selectedListItem.closest('li').children('ul').addClass('active');
}
