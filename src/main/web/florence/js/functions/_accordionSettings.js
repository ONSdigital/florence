function accordion() {
  $(function () {
    $(".edit-accordion").accordion(
        {
          header: "div.edit-section__head",
          heightStyle: "content",
          active: 'none',
          collapsible: true
        }
    );
  });
}
