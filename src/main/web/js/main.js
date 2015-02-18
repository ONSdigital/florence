(
function($) {

	var intIntervalTime = 100;
	var newpage;
	var pageurl = window.location.href;

	setupFlorence();
	// renderPage();

	var checkLocation = function() {
		if (pageurl != window.location.href) {
			pageurl = window.location.href;
			$(window.location).trigger("change", {
				newpage: getPageData()
			});
		}

	function getPageData(){
		pageurldata = pageurl.replace("#!", "data");

		$.ajax({
			url:pageurldata,
			dataType: 'json', // Notice! JSONP <-- P (lowercase)
			crossDomain: true,
			// jsonpCallback: 'callback',
			// type: 'GET',
			success:function(data){
				// do stuff with json (in this case an array)
				// console.log("Success");
				// console.log(data);
				if(data.level === 't1'){
					console.log('t1 page');
					t1(data);
				}
				else if(data.level === 't2'){
					console.log('t2 page');
					t2(data);
				}
			},
			error:function(){
				console.log('Error');
			}
		});
	}

	var florenceForm = '<div class="florence-editarea-home"><a href="#" class="florence-editbtn">Edit</a>' +
			'<div class="florence-editform"><a href="#" class="florence-cancelbtn">Cancel</a><form onsubmit="return false;"><textarea id="json"></textarea>' +
			'<button class="florence-update" >Update</button></form></div></div>';

	function t1(data){
		var editabledata;
		$('.slate--home--hero-banner .grid-wrap').prepend(florenceForm);
		editableform(data);
	}

	function t2(data){
		var editabledata;
		$('.panel').prepend(florenceForm);
		editableform(data);
	}
	// Create a form to modify text and pass JSON data
	function editableform(data) {
		$('.florence-editbtn').click(function(){
			$('.florence-editform').show();
		});

		$('.florence-cancelbtn').click(function(){
			$('.florence-editform').hide();
		});

		$('.florence-update').click(function(){
			updatePage();
		});
		$("#json").val(JSON.stringify(data, null, 3));
	}



	// function renderPage(){
	// 	getPageData();
	// }

	function setupFlorence(){
		$('head').prepend('<link href="http://localhost:8081/css/main.css" rel="stylesheet" type="text/css">');
		var bodycontent = $('body').html();
		var florence_bar =
			'<div class="florence">' +
				'<div class="florence-head">Florence v0.1</div>' +
				'<nav class="florence-nav">' +
					'<ul>' +
						'<li><a href="#" class="fl-edit fl-top-menu-item">Edit</a></li>' +
							'<ul class="fl-edit-sub">' +
								'<li><a href="#" class="fl-save">Save changes</a></li>' +
								'<li><a href="#" class="fl-cancel">Cancel changes</a></li>' +
							'</ul>' +
						'<li class="fl-versions fl-top-menu-item">Versions</li>' +
						'<li class="fl-tasks fl-top-menu-item">Tasks</li>' +
						'<li class="fl-sitemap fl-top-menu-item">Site map</li>' +
					'</ul>' +
				'</nav>' +
			'</div>';
		$('body').wrapInner('<div class="florence-content-wrap"></div>');
		$('body').prepend(florence_bar);

		$('.fl-edit').click(function(){
			// console.log('Florence Edit clicked');
			// $('.florence-editform').show();
			getPageData();
		});

	}

	function updatePage(url){
		$.ajax({
	           url:"http://localhost:8081/data",
	           type:"POST",
	           data: JSON.stringify({
	               json:$('#json').val(),
                   id:pageurl
	           }),
	           contentType:"application/json; charset=utf-8",
	           dataType:"text"
	       }).done(function(){
	           console.log("Done!")
	       }).fail(function(jqXHR, textStatus){
	           alert(textStatus);
	       })
	}

	setInterval(checkLocation, intIntervalTime);

})(jQuery);




