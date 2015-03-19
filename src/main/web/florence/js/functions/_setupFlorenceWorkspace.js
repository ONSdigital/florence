function setupFlorenceWorkspace(caller){

  var intIntervalTime = 100;
   //florence edit menu
  var florence_menu_edit =
  // '<section class="fl-panel fl-panel--editor">' +
  //   '<nav class="fl-panel--editor__breadcrumb">' +
  //     '<input type="text" value="" placeholder="Publish owner" class="fl-panel--editor__publish-owner" />' +
  //     '<input type="text" value="" placeholder="Publish id (release name)" class="fl-panel--editor__publish-id" />' +
  //   '</nav>' +
  //   '<textarea class="fl-editor" name="fl-editor" cols="40" rows="5"></textarea>' +
  //   '<nav class="fl-panel--editor__nav">' +
  //     '<button class="fl-panel--editor__nav__save">Save</button>' +
  //     '<button class="fl-panel--editor__nav__approve">Approve</button>' +
  //     '<button class="fl-panel--editor__nav__publish">Publish</button>' +
  //   '</nav>' +
  // '</section>';

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

  var florence_menu_create =
  '<section class="fl-panel fl-panel--creator">' +
    '<section class="fl-creator">' +

      '<section class="fl-creator__page_details">' +
        '<span class="fl-creator__title"> Select the Parent</span>' +
        '<input class="fl-creator__parent" name="fl-editor__headline" cols="40" rows="1"></input>' +
        '<br>' +
        '<span class="fl-creator__title"> enter the new page name </span>' +
        '<input class="fl-creator__new_name" name="fl-editor__headline" cols="40" rows="1"></input>' +
        '<br>' +
        '<section class="fl-creator__title"> Select a Page Type' +
        '<select class="fl-creator__page_type_list_select">'+
          '<option>bulletin</option>' +
        '</select></section>'+
      '</section>' +
    '</section>' +
    '<nav class="fl-panel--creator__nav">' +
      '<button class="fl-panel--creator__nav__create">Create Page</button>' +
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
    $('.fl-panel--sub-menu').html(florence_menu_create);
    loadPageCreator();
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

    // ******* Moved this to _loadPageDataintoEditor *******
    //$('.fl-panel--editor__nav__save').click(function() {
    //  if($('.fl-panel--editor__publish-owner').val().length != 0 && $('.fl-panel--editor__publish-id').val().length != 0){
    //    pageData = $('.fl-editor').val();
    //    save("testCollection", pageData);
    //    //console.log(parser.pathname);
    //  } else {
    //    alert('Publish owner and Publish id cannot be blank!');
    //  }
    //
    //});

      $('.fl-panel--editor__nav__approve').click(function () {
          approve(collectionName);
      });
      $('.fl-panel--editor__nav__publish').click(function () {
          publish(collectionName);
      });

  }

  if (caller.parent().hasClass('fl-main-menu__item--approve')){

    loadApprovalPage();
    //
  }



  // else if (caller.parent().hasClass('fl-main-menu__item--publish')){
  //   //
  // }

  else {
    //
  }

}

