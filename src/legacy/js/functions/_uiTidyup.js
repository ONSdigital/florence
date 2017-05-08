function uiTidyUp() {
	//wrap selects with <div class="select-wrap">
	// $('select').wrap('<span class="select-wrap"></span>');
	console.log('uiTidyup');
	$(function() {
 
    $( 'select' )
      .selectmenu()
      .selectmenu( "menuWidget" )
        .addClass( "overflow" );
  });
}