function accordion() {
  $(function () {
    $("#accordion").accordion(
        {
          header: "section",
          heightStyle: "content",
          active: 'none',
          collapsible: true
        }
    );
  });
}
