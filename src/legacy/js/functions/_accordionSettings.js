/**
 * Keeps the accordion open in the tab specified
 * @param active - the active tab
 */

function accordion(active) {
  var activeTab = parseInt(active);
  if(!activeTab){
    activeTab = 'none';
  }
  $(function () {
    $(".edit-accordion").accordion(
      {
        header: "div.edit-section__head",
        heightStyle: "content",
        active: activeTab,
        collapsible: true
      }
    );
  });
}
