function treeNodeSelect(url) {
    var urlPart = url.replace(Florence.babbageBaseUrl, '');

    var $selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
    $('.js-browse__item.selected').removeClass('selected');
    $selectedListItem.addClass('selected');

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
