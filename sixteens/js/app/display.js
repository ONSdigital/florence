function setDisplay() {
    $('.js--hide').hide();
    $('.js--show').show();
    $('.nojs--hide').removeClass('nojs--hide');
}
$(function() {
    setDisplay();
});
