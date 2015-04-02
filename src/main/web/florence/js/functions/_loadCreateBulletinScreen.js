function loadCreateBulletinScreen(collectionName) {

  var workspace_menu_create =
      '<section class="fl-panel fl-panel--creator">' +
      '  <section class="fl-creator">' +
      '    <section class="fl-creator__page_details">' +
      '      <span class="fl-creator__title"> Select the Parent</span>' +
      '      <input class="fl-creator__parent" name="fl-editor__headline" cols="40" rows="1"></input>' +
      '      <br>' +
      '      <span class="fl-creator__title"> enter the new page name </span>' +
      '      <input class="fl-creator__new_name" name="fl-editor__headline" cols="40" rows="1"></input>' +
      '      <br>' +
      '      <section class="fl-creator__title"> Select a Page Type' +
      '      <select class="fl-creator__page_type_list_select">'+
      '        <option>bulletin</option>' +
      '      </select></section>'+
      '    </section>' +
      '  </section>' +
      '  <nav class="fl-panel--creator__nav">' +
      '    <button class="fl-panel--creator__nav__create">Create Page</button>' +
      '  </nav>' +
      '</section>';

  $('.fl-panel--sub-menu').html(workspace_menu_create);
  loadPageCreator(collectionName);

}
