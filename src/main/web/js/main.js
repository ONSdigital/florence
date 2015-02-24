(function($) {

  var intIntervalTime = 100;
	var newpage;
	var pageurl = window.location.href;
	var data;
	var editableData;
	var pageType

	editableData = {
		"t1":[
			{"class":'.slate--home--hero-banner .grid-col ',"jsonKey":"uri"},
			//{"class":'.slate--home--hero-banner .grid-col ',"jsonKey":"name"},
			],
		"t2":[],
		"t3":[],
		"t4":[],
		"t5":[]
	}

	setupFlorence();
	// renderPage();

	// URI simple parser
	var parser = document.createElement('a');
	parser.href = pageurl.replace("#!/", ""); //takes out #! from Angular.js
	parser.protocol; // => "http:"
	parser.hostname; // => "example.com"
	parser.port;     // => "3000"
	parser.pathname; // => "/pathname/"
	parser.search;   // => "?search=test"
	parser.hash;     // => "#hash"
	parser.host;     // => "example.com:3000"

	var checkLocation = function() {
		if (pageurl != window.location.href) {
			pageurl = window.location.href;
			$(window.location).trigger("change", {
				newpage: getPageData()
			});
		}
	}

	function getPageData(){
		pageurldata = pageurl.replace("#!", "data");

		$.ajax({
			url:pageurldata,
			dataType: 'json', // Notice! JSONP <-- P (lowercase)
			crossDomain: true,
			// jsonpCallback: 'callback',
			// type: 'GET',
			success:function(response){
				// do stuff with json (in this case an array)
				// console.log("Success");
				data = response
				pageType = data.level
				addEditSections()
			},
			error:function(){
				console.log('Error');
			}
		});
	}

	var florenceForm = '<div class="florence-editarea-home">'                   +
	 											'<a href="#" class="florence-editbtn">Edit</a>'       +
												'<div class="florence-editform">'                     +
													'<a href="#" class="florence-cancelbtn">Cancel</a>' +
													'<form onsubmit="return false;">'                   +
														'<textarea id="json"></textarea>'                 +
														'<button class="florence-update" >Update</button>'+
													'</form>'                                           +
												'</div>'                                              +
											'</div>';


	function addEditSections(){
		for(i = 0; i < editableData[pageType].length; i ++){
			var selector, jsonKey
			selector = editableData[pageType][i].class
			jsonKey  = editableData[pageType][i].jsonKey

			$(selector).each(function(index,element){
				var jsonUpdater,jsonPath,uriUpdater;

				setJsonPath(jsonKey);
				jsonUpdater =makeUpdateFunction(jsonKey);
				$(element).prepend(florenceForm);
				$('textarea',element).val(jsonPath);
				editableForm(element,index,jsonUpdater);


				function setJsonPath(jsonKey){
					// will eventually handle all the data paths
					if(data.level === "t1"){
						//find the old value to prepoulate the form
						if(jsonKey !== "uri"){
							jsonPath = data['sections'][index]['items'][0][jsonKey]
						} else {
							splitUrl = data['sections'][index]['items'][0][jsonKey].split("/")
							jsonPath = splitUrl[splitUrl.length - 2] === "timeseries" ? splitUrl[splitUrl.length - 1] : splitUrl[splitUrl.length - 2]
						}

					} else if( data.level === "t2"){
						console.log(" error - t2 data path not implemented")
					} else if(true){
					 	console.log("error getting path to json data ")}
				}

				function makeUpdateFunction(jsonKey){

					if(jsonKey !== "uri"){
						return function(newVal){
							data['sections'][index]['items'][0][jsonKey] = newVal;
						}
					} else {
							return makeUriUpdater(index,jsonKey)
					}
				}

				function makeUriUpdater(index,jsonKey){
					return function uriUpdater(cdid){
						var url
						$.ajax({
							url: "http://localhost:8080/search?cdid=" +cdid,
							crossDomain: true,
							dataType: "json",
							async: false,
							success:function(response){
								url = response;
								console.log(url)
							},
							error:function(){console.log( "error retrieving url from tredegar")}
						})

						data['sections'][index]['items'][0][jsonKey] = url;

					}
				}
			});
		}

		function editableForm(element,index,jsonUpdater) {
			$('.florence-editbtn',element).click(function(){
				$('.florence-editform',element).show();
			});

			$('.florence-cancelbtn',element).click(function(){
				$('.florence-editform',element).hide();
			});

			$('.florence-update',element).click(function(){
				jsonUpdater($('textarea',element).val());
				updatePage();
			});
		}
	}


  function setupFlorence(){
  	$('head').prepend('<link href="http://localhost:8081/css/main.css" rel="stylesheet" type="text/css">');
  	var bodycontent = $('body').html();
  	var florence_bar =
  		'<div class="florence">'                                               +
  			'<div class="florence-head">Florence v0.1</div>'                     +
  			'<nav class="florence-nav">'                                         +
  				'<ul>'                                                             +
  					'<li><a href="#" class="fl-edit fl-top-menu-item">Edit</a></li>' +
  						'<ul class="fl-edit-sub">'                                     +
  							'<li><a href="#" class="fl-save">Save changes</a></li>'      +
  							'<li><a href="#" class="fl-cancel">Cancel changes</a></li>'  +
  						'</ul>'                                                        +
  					'<li class="fl-versions fl-top-menu-item">Versions</li>'         +
  					'<li class="fl-tasks fl-top-menu-item">Tasks</li>'               +
  					'<li class="fl-sitemap fl-top-menu-item">Site map</li>'          +
  				'</ul>'                                                            +
  			'</nav>'                                                             +
  		'</div>';
  	$('body').wrapInner('<div class="florence-content-wrap"></div>');
  	$('body').prepend(florence_bar);

		$('.fl-edit').click(function(){
			// console.log('Florence Edit clicked');
			// $('.florence-editform').show();
			getPageData();
		});

	}

	function updatePage(){
		$.ajax({
	           url:"http://localhost:8081/data",
	           type:"POST",
	           data: JSON.stringify({
	               json: JSON.stringify(data),
                   id: parser.pathname
	           }),
	           contentType:"application/json; charset=utf-8",
	           dataType:"text"
	       	}).done(function(){
	           console.log("Done!");
	           location.reload();
	       	}).fail(function(jqXHR, textStatus){
	           alert(textStatus);
	       	})
	}

	setInterval(checkLocation, intIntervalTime);

})(jQuery);
