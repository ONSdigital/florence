function loadCreateBulletinScreen(collectionName) {

  var workspace_menu_create =
      '<section class="fl-panel fl-panel--creator">' +
      '  <section class="fl-creator">' +
      '    <section class="fl-creator__page_details">' +
      '      <span class="fl-creator__title"> Select the Parent</span>' +
      '      <textarea class="fl-creator__parent" name="fl-editor__headline" cols="40" rows="2"></textarea>' +
      '      <br>' +
      '      <span class="fl-creator__title"> enter the new page name </span>' +
      '      <textarea class="fl-creator__new_name" name="fl-editor__headline" cols="40" rows="2"></textarea>' +
      '      <br>' +
      '      <section class="fl-creator__title"> Select a Page Type' +
      '      <select class="fl-creator__page_type_list_select" required>'+
      '        <option name="bulletin">bulletin</option>' +
      '        <option name="article">article</option>' +
      '        <option name="dataset">dataset</option>' +
      '      </select></section>'+
      '    </section>' +
      '  </section>' +
      '  <nav class="fl-panel--creator__nav">' +
          // Here goes the create button
      '  </nav>' +
      '</section>';

  $('.fl-panel--sub-menu').html(workspace_menu_create);
  loadT4Creator(collectionName);
}
