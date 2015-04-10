function loadEditDatasetScreen(collectionName) {

  // Metadata and correction collapsible sections
  var workspace_menu_sub_edit =
    '<section class="fl-panel fl-panel--editor">' +
    '  <section style="overflow: scroll;" class="fl-editor">' +
    '    <div id="accordion">' +
      // section > div necessary for accordion
    '      <section class="fl-editor__metadata">Metadata</section>' +
    '      <div id="metadata-section"></div>' +
    '      <section class="fl-editor__metadata">Correction</section>' +
    '      <div id="correction-section">' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Notes</section>' +
    '      <div id="notes-section">' +
    '        <article class="fl-editor__notes"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Related</section>' +
    '      <div id="related-section">' +
    '        <article class="fl-editor__related"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Used in</section>' +
    '      <div id="used-section">' +
    '        <article class="fl-editor__used"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Download</section>' +
    '      <div id="content-section">' +
    '        <article class="fl-editor__download"></article>' +
    '      </div>' +
    '    </div>' +
    '  </section>' +
    '  <nav class="fl-panel--editor__nav">' +
    '    <button class="fl-panel--editor__nav__cancel">Cancel</button>' +
    '    <button class="fl-panel--editor__nav__save">Save</button>' +
    '    <button class="fl-panel--editor__nav__complete">Save and submit for internal review</button>' +
    '    <button class="fl-panel--editor__nav__review">Save and submit for approval</button>' +
    '  </nav>' +
    '</section>';


  $('.fl-panel--sub-menu').html(workspace_menu_sub_edit);
  $('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');
  accordion();

  $('.fl-panel--editor__nav__publish').click(function () {
    publish(collectionName);
  });
}
