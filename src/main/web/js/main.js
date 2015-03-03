(function($) {

  setupFlorence();


  function setupFlorence(){
    $('head').prepend('<link href="http://localhost:8081/css/main.min.css" rel="stylesheet" type="text/css">');
    var bodycontent = $('body').html();
    var florence_menu = 
      '<section class="fl-panel fl-panel--menu">' +
        '<nav>' +
            '<h1 class="fl-brand">Florence Dashboard v0.1</h1>' +
            '<ul class="fl-main-menu">' +
                '<li class="fl-main-menu__item fl-main-menu__item--approve">' +
                    '<a href="#" class="fl-main-menu__link">Approve</a></li>' +
                '<li class="fl-main-menu__item fl-main-menu__item--create">' +
                    '<a href="#" class="fl-main-menu__link">Create</a></li>' +
                '<li class="fl-main-menu__item fl-main-menu__item--edit">' +
                    '<a href="#" class="fl-main-menu__link">Edit</a></li>' +
                '<li class="fl-main-menu__item fl-main-menu__item--users">' +
                    '<a href="#" class="fl-main-menu__link">Users</a></li>' +
                '<li class="fl-main-menu__item fl-main-menu__item--publish">' +
                    '<a href="#" class="fl-main-menu__link">Publish</a></li>' +
            '</ul>' +
        '</nav>' +
    '</section>' +
    '<section class="fl-panel fl-panel--sub-menu">' +
    '</section>' +
    '<section class="fl-panel fl-panel--editor">' +
        '<textarea class="fl-editor" name="fl-editor" cols="40" rows="5"></textarea>' +
    '</section>';

    $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
    // $('body').wrapInner('<section class="fl-container"></section>');
    $('body').prepend(florence_menu);

    $('.fl-main-menu__link').click(function() {
      setupFlorenceScene($(this));
    });

  }

  function getPageJSON(){}
  function convertPageJSONtoMarkdown(){}
  function saveUpdatedMarkdown(){}
  function watchForEditorChanges(){}

  function setupFlorenceScene(caller){
    
    //console.log(caller.parent().attr('class'));
    // console.log($('.fl-panel--preview__inner').height())

    // setPreviewOverlayHeight();

    removePreviewColClasses();
    removeSubMenus();

    $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
    caller.addClass('fl-main-menu__link--active');


    if (caller.parent().hasClass('fl-main-menu__item--approve')){
      // removePreviewColClasses();
      $('.fl-panel--preview').addClass('col--8');
      $('.fl-panel--sub-menu').show();
    }

    else if (caller.parent().hasClass('fl-main-menu__item--create')){
      // removePreviewColClasses();
      $('.fl-panel--preview').addClass('col--8');
      $('.fl-panel--sub-menu').show();
    }

    else if (caller.parent().hasClass('fl-main-menu__item--edit')){
      // removePreviewColClasses();
      $('.fl-panel--preview').addClass('col--4');
      $('.fl-panel--sub-menu').show();
      $('.fl-panel--editor').show();
    }

    else if (caller.parent().hasClass('fl-main-menu__item--users')){
      // removePreviewColClasses();
      $('.fl-panel--preview').addClass('col--8');
      $('.fl-panel--sub-menu').show();
    }

    else if (caller.parent().hasClass('fl-main-menu__item--publish')){
      // removePreviewColClasses();
      $('.fl-panel--preview').addClass('col--8');
      $('.fl-panel--sub-menu').show();
    }

    else {
      //
    }

  }


function removeSubMenus(){
  $('.fl-panel--sub-menu').hide();
  $('.fl-panel--editor').hide();
}

function removePreviewColClasses(){
  $('.fl-panel--preview').removeClass('col--4');
  $('.fl-panel--preview').removeClass('col--8');
}


})(jQuery);
