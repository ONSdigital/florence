function setupFlorenceWorkspace(caller){

   //florence edit menu
  var florence_menu_edit =
  '<section class="fl-panel fl-panel--editor">' +
    '<nav class="fl-panel--editor__breadcrumb">' +
      '<input type="text" value="" placeholder="Publish owner" class="fl-panel--editor__publish-owner" />' +
      '<input type="text" value="" placeholder="Publish id (release name)" class="fl-panel--editor__publish-id" />' +
    '</nav>' +
    '<textarea class="fl-editor" name="fl-editor" cols="40" rows="5"></textarea>' +
    '<nav class="fl-panel--editor__nav">' +
      '<button class="fl-panel--editor__nav__save">Save</button>' +
      '<button class="fl-panel--editor__nav__approve">Approve</button>' +
      '<button class="fl-panel--editor__nav__publish">Publish</button>' +
    '</nav>' +
  '</section>';

  removePreviewColClasses();
  removeSubMenus();

  $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
  caller.addClass('fl-main-menu__link--active');

  $('.fl-panel--preview__inner').removeClass('fl-panel--preview__inner--active');
  $('.fl-panel--preview').addClass('col--7');
  $('.fl-panel--sub-menu').show();


  if (caller.parent().hasClass('fl-main-menu__item--browse')){
    //
  }

  else if (caller.parent().hasClass('fl-main-menu__item--create')){
    //
  }

  else if (caller.parent().hasClass('fl-main-menu__item--edit')){
    // $('.fl-panel--editor').show();
    // florence_menu_edit
    // fl-panel--sub-menu
    $('.fl-panel--sub-menu').html(florence_menu_edit);
    // console.log(florence_menu_edit);

    loadPageDataIntoEditor();
    setInterval(checkEditPageLocation, intIntervalTime);
    $('.fl-panel--editor__nav__save').click(function() {
      if($('.fl-panel--editor__publish-owner').val().length != 0 && $('.fl-panel--editor__publish-id').val().length != 0){
        pageData = $('.fl-editor').val();
        save("testCollection", pageData);
        //console.log(parser.pathname);
      } else {
        alert('Publish owner and Publish id cannot be blank!');
      }

    });

      $('.fl-panel--editor__nav__approve').click(function () {
          approve(collectionName);
      });
      $('.fl-panel--editor__nav__publish').click(function () {
          publish(collectionName);
      });

  }

  if (caller.parent().hasClass('fl-main-menu__item--approve')){
    //
  }



  // else if (caller.parent().hasClass('fl-main-menu__item--publish')){
  //   //
  // }

  else {
    //
  }

}