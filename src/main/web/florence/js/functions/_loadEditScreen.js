function loadEditScreen(collectionName) {

  function accordion() {
    $(function () {
      $("#accordion").accordion(
        {
          header: "section",
          heightStyle: "content",
          active: 2
        }
      );
    });
  }

  // Metadata and correction collapsible sections
  var workspace_menu_sub_edit =
    '<section class="fl-panel fl-panel--editor">' +
    '  <section style="overflow: scroll;" class="fl-editor">' +
    '    <div id="accordion">' +
      // section > div necessary for accordion
    '      <section class="fl-editor__metadata">Metadata section</section>' +
    '      <div id="metadata-section"></div>' +
    '      <section class="fl-editor__metadata">Correction section</section>' +
    '      <div id="correction-section">' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '        Demo: <input value="Tab 2 content"><br>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Content section</section>' +
    '      <div id="content-section">' +
    '        <textarea class="fl-editor__headline" name="fl-editor__headline"></textarea>' +
    '        <article class="fl-editor__sections"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Accordion section</section>' +
    '      <div id="accordion-section">' +
    '        <article class="fl-editor__accordion"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">Related bulletins</section>' +
    '      <div id="related-section">' +
    '        <article class="fl-editor__related"></article>' +
    '      </div>' +
    '      <section class="fl-editor__metadata">External links</section>' +
    '      <div id="external-section">' +
    '        <article class="fl-editor__external"></article>' +
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
  // Clear local storage
  localStorage.removeItem("pageurl");
  var pageUrl = $('.fl-panel--preview__content').contents().get(0).location.href;
  localStorage.setItem("pageurl", pageUrl);
  accordion();

  loadPageDataIntoEditor(localStorage.getItem("collection"), true);

  clearInterval(window.intervalID);
  window.intervalID = setInterval(function () {
    checkForPageChanged(function () {
      loadPageDataIntoEditor(collectionName, true);
    });
  }, window.intIntervalTime);

  $('.fl-panel--editor__nav__publish').click(function () {
    publish(collectionName);
  });

}