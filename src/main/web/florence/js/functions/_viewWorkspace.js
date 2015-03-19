function viewWorkspace(caller){

  var intIntervalTime = 100;

  var workspace_menu_main = 
  // '<section class="fl-panel fl-panel--menu">' +
      '<nav class="fl-panel fl-panel--menu">' +
        '<ul class="fl-main-menu">' +
            '<li class="fl-main-menu__item fl-main-menu__item--browse">' +
              '<a href="#" class="fl-main-menu__link">Browse</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--create">' +
              '<a href="#" class="fl-main-menu__link">Create</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--edit">' +
              '<a href="#" class="fl-main-menu__link">Edit</a>' +
            '</li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--review">' +
              '<a href="#" class="fl-main-menu__link">Review</a>' +
            '</li>' +
          '</ul>' +
      '</nav>' +
  // '</section>' +
  '<section class="fl-panel fl-panel--sub-menu">' +
  '</section>';

   //florence edit menu
  var workspace_menu_sub_edit =
  '<section class="fl-panel fl-panel--editor">' +
    '<section class="fl-editor">' +
      '<section class="fl-editor__metadata">Metadata collapsible section goes here</section>' +
      '<section class="fl-editor__correction">Correction collapsible section goes here</section>' +
      '<textarea class="fl-editor__headline" name="fl-editor__headline" cols="40" rows="5"></textarea>' +
      '<section class="fl-editor__sections">' +
      '</section>' +
    '</section>' +
    '<nav class="fl-panel--editor__nav">' +
      '<button class="fl-panel--editor__nav__cancel">Cancel</button>' +
      '<button class="fl-panel--editor__nav__save">Save</button>' +
      '<button class="fl-panel--editor__nav__complete">Save and submit for internal review</button>' +
    '</nav>' +
  '</section>';

  //
  var workspace_preview = 
  '<section class="fl-panel fl-panel--preview">' +
    '<div class="fl-panel--preview__inner">' +
      '<iframe src="http://localhost:8081/index.html" class="fl-panel fl-panel--preview__content"></iframe>' +
    '</div>' +
  '</section>';

  //build view
  $('.fl-view').prepend(workspace_menu_main + workspace_preview);

  //click handlers
  $('.fl-main-menu__link').click(function() {
    $('.fl-panel--sub-menu').empty();
    $('.fl-panel--preview__inner').removeClass('fl-panel--preview__inner--active');

    // setupFlorenceWorkspace($(this));
    if ($(this).parent().hasClass('fl-main-menu__item--browse')){
    //
    }

    else if ($(this).parent().hasClass('fl-main-menu__item--create')){
      //
    }

    else if ($(this).parent().hasClass('fl-main-menu__item--edit')){

      $('.fl-panel--sub-menu').html(workspace_menu_sub_edit);
      $('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');

      loadPageDataIntoEditor();
      setInterval(checkEditPageLocation, intIntervalTime);

        $('.fl-panel--editor__nav__approve').click(function () {
            approve(collectionName);
        });
        $('.fl-panel--editor__nav__publish').click(function () {
            publish(collectionName);
        });

    }

    else if ($(this).parent().hasClass('fl-main-menu__item--review')){
      //
    }

    else {
      //browse
      

      
    }

  });

  //removePreviewColClasses();
  //removeSubMenus();








  $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
  $(this).addClass('fl-main-menu__link--active');

  $('.fl-panel--preview__inner').removeClass('fl-panel--preview__inner--active');
  $('.fl-panel--preview').addClass('col--7');
  $('.fl-panel--sub-menu').show();


  

}