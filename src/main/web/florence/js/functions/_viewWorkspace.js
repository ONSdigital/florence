function viewWorkspace(path) {

  window.intIntervalTime = 100;

  var workspace_menu_main =
    '<nav class="fl-panel fl-panel--menu">' +
    '  <ul class="fl-main-menu">' +
    '    <li class="fl-main-menu__item fl-main-menu__item--browse">' +
    '      <a href="#" class="fl-main-menu__link">Browse</a>' +
    '    </li>' +
    '    <li class="fl-main-menu__item fl-main-menu__item--create">' +
    '      <a href="#" class="fl-main-menu__link">Create</a>' +
    '    </li>' +
    '    <li class="fl-main-menu__item fl-main-menu__item--edit">' +
    '      <a href="#" class="fl-main-menu__link">Edit</a>' +
    '    </li>' +
    '    <li class="fl-main-menu__item fl-main-menu__item--review">' +
    '      <a href="#" class="fl-main-menu__link">Review</a>' +
    '    </li>' +
    '  </ul>' +
    '</nav>' +
    '<section class="fl-panel fl-panel--sub-menu">' +
    '</section>';

  var workspace_menu_review =
    '<section class="fl-panel">' +
    '  <div class="fl-review-list-holder"></div>' +
    '  <button class="fl-button fl-button--big fl-button--center fl-review-page-edit-button" style="display: none;">Edit this page</button>' +
    '  <button class="fl-button fl-button--big fl-button--center fl-review-page-review-button" style="display: none;">Happy with this send to content owner</button>' +
    '</section>';

  var currentPath = '';
  if (path) {
    currentPath = path;
  }

  var workspace_preview =
    '<section class="fl-panel fl-panel--preview">' +
    '  <div class="fl-panel--preview__inner">' +
    '    <iframe src="/index.html#!' + currentPath + '" class="fl-panel fl-panel--preview__content"></iframe>' +
    '  </div>' +
    '</section>';

  //build view
  $('.fl-view').html(workspace_menu_main + workspace_preview);
  enablePreview();

  clearInterval(window.intervalID);
  loadBrowseScreen();
  var collectionName = localStorage.getItem("collection");
  localStorage.removeItem("pageurl");
  //var pageurl = $('.fl-panel--preview__content').contents().get(0).location.href;
  //localStorage.setItem("pageurl", pageurl);
  //click handlers
  $('.fl-main-menu__link').click(function () {

    console.log('menu item clicked');

    if(Florence.Editor.isDirty) {
      var result = confirm("You have unsaved changes. Are you sure you want to continue");
      if (result == true) {
        Florence.Editor.isDirty = false;
      } else {
        return false;
      }
    }

    $('.fl-panel--sub-menu').empty();
    $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
    $(this).addClass('fl-main-menu__link--active');

    // setupFlorenceWorkspace($(this));
    if ($(this).parent().hasClass('fl-main-menu__item--browse')) {
      //$('.fl-panel--sub-menu').empty();
      clearInterval(window.intervalID);
      loadBrowseScreen();
    }

    else if ($(this).parent().hasClass('fl-main-menu__item--create')) {
      disablePreview();
      loadCreateBulletinScreen(collectionName);
    }

    else if ($(this).parent().hasClass('fl-main-menu__item--edit')) {
      loadPageDataIntoEditor(collectionName, true);
      $('.fl-main-menu__item--browse .fl-main-menu__link').removeClass('fl-main-menu__link--active');
      $('.fl-main-menu__item--edit .fl-main-menu__link').addClass('fl-main-menu__link--active');
      clearInterval(window.intervalID);
      enablePreview();
      window.intervalID = setInterval(function () {
        checkForPageChanged(function () {
          loadPageDataIntoEditor(collectionName, true);
        });
      }, window.intIntervalTime);
    }

    else if ($(this).parent().hasClass('fl-main-menu__item--review')) {
      $('.fl-panel--sub-menu').html(workspace_menu_review);
      enablePreview();
      //$('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');
      loadReviewScreen(collectionName);

      clearInterval(window.intervalID);
      window.intervalID = setInterval(function () {
        checkForPageChanged(function () {
          updateReviewScreen(collectionName);
        });
      }, window.intIntervalTime);
    }

    else {
      clearInterval(window.intervalID);
      loadBrowseScreen();
    }
  });

  removePreviewColClasses();
  removeSubMenus();

  $(this).addClass('fl-main-menu__link--active');

  $('.fl-panel--preview').addClass('col--7');
  $('.fl-panel--sub-menu').show();
}
