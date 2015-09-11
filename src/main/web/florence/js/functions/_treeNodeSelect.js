function treeNodeSelect(url){

  var urlPart = url.replace(Florence.tredegarBaseUrl, '');
  var selectedListItem = $('[data-url="' + urlPart + '"]'); //get first li with data-url with url
  $('.page-list li').removeClass('selected');
  $('.page-options').hide();

  $(selectedListItem).addClass('selected');
  $(selectedListItem).children('.page-options').show();

  //page-list-tree
  $('.tree-nav-holder ul').removeClass('active');
  $(selectedListItem).parents('ul').addClass('active');
  $(selectedListItem).closest('li').children('ul').addClass('active');
}
