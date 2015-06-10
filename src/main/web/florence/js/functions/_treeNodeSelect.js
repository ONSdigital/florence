function treeNodeSelect(url){
  //var baseURL = 'http://localhost:8081/index.html#!';
 // var baseURL = 'http://' + window.location.host + '/index.html#!';
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

//  $('.btn-browse-delete').click(function () {
//    var dest = $('.tree-nav-holder ul').find('.selected').attr('data-url');
//
//  });
}
