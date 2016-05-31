function treeNodeSelect(url) {
    var urlPart = url.replace(Florence.babbageBaseUrl, '');
    var $selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
    $('.page-list li').removeClass('selected');
    $selectedListItem.addClass('selected');

    //page-list-tree
    $('.tree-nav-holder ul').removeClass('active');
    $selectedListItem.parents('ul').addClass('active');
    $selectedListItem.closest('li').children('ul').addClass('active');
}
