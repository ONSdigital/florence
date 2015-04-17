function loadEditT4Screen(collectionName) {
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
    '        <article class="fl-editor__correction"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Notes</section>' +
    '      <div id="accordion-section">' +
    '        <article class="fl-editor__accordion"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Related</section>' +
    '      <div id="related-section">' +
    '        <article class="fl-editor__related"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">External links</section>' +
    '      <div id="external-section">' +
    '        <article class="fl-editor__external"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Content</section>' +
    '      <div id="content-section">' +
    '        <article class="fl-editor__sections"></article>' +
    '      </div>' +
    '    </div>' +
    '  </section>' +
    '  <nav class="fl-panel--editor__nav">' +
    '    <button class="fl-panel--editor__nav__cancel">Cancel</button>' +
    '    <button class="fl-panel--editor__nav__save">Save</button>' +
    '    <button class="fl-panel--editor__nav__complete" style="display: none;">Save and submit for internal review</button>' +
    '    <button class="fl-panel--editor__nav__review" style="display: none;">Save and submit for approval</button>' +
    '  </nav>' +
    '</section>';

  $('.fl-panel--sub-menu').html(workspace_menu_sub_edit);
  $('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');
  accordion();

  $('.fl-panel--editor__nav__publish').click(function () {
    publish(collectionName);
  });
}
