$(document).ready(function(){


		//collections table
		$('.collections-select-table tbody tr').click(function(){

			$('.collections-select-table tbody tr').removeClass('selected');

			$(this).addClass('selected');

			$('.collection-selected').animate({right: "0%"}, 500);
		});

		$('.collection-selected .btn-cancel').click(function(){
			$('.collection-selected').animate({right: "-50%"}, 500);
			$('.collections-select-table tbody tr').removeClass('selected');
		});






		//forms field styling markup injection
		$('select:not(.small)').wrap('<span class="selectbg"></span>');
		$('select.small').wrap('<span class="selectbg selectbg--small"></span>');
		$('.selectbg--small:eq(1)').addClass('selectbg--small--margin');
		$('.selectbg--small:eq(3)').addClass('float-right');







		//page-list
		$('.page-item').click(function(){
			$('.page-list li').removeClass('selected');
			$('.page-options').hide();

			$(this).parent('li').addClass('selected');
			// $(this).addClass('page-item--selected');
			$(this).next('.page-options').show();

			//page-list-tree
			$('.tree-nav-holder ul').removeClass('active');
			$(this).parents('ul').addClass('active');
			$(this).closest('li').children('ul').addClass('active');
		});



		//page-list--tree
		$('.page-list--tree .page-item').click(function(){
			//change iframe location
			var newURL = baseURL + $(this).closest('li').attr('data-url');
			browserContent.document.location.href = newURL;
			$('.browser-location').val(newURL);
			// console.log(newURL);
		});


		function treeNodeSelect(url){
			var urlPart = url.replace(baseURL, '');
			var selectedListItem = $('.tree-nav-holder li').find('[data-url="' + urlPart + '"]'); //get first li with data-url with url

			// console.log(urlPart);

			$('.page-list li').removeClass('selected');
			$('.page-options').hide();

			$(selectedListItem).addClass('selected hello');
			$(selectedListItem).children('.page-options').show();

			//page-list-tree
			$('.tree-nav-holder ul').removeClass('active');
			$(selectedListItem).parents('ul').addClass('active');
			$(selectedListItem).closest('li').children('ul').addClass('active');
		}








		//mini browser
		var baseURL = 'http://localhost:8081/index.html#!/'; //global var
		function setupMiniBrowser() {
			var browserContent = $('#iframe')[0].contentWindow;
			browserContent.document.onclick = function(){
				var browserLocation = browserContent.location.href;
				$('.browser-location').val(browserLocation);
				treeNodeSelect(browserLocation);
				//console.log(browserLocation);
				// console.log('iframe inner clicked');
			};

			$('.browser-location').val($('#iframe').attr('src'));
		}
		try {
			setupMiniBrowser();
		} catch(err) {
			//
		}

		//disabled back and forward buttons (display: none in css) for now (bugs - one click behind)
		// $('.browser-btn-back').click(function(){
		// 	browserContent.history.back();
		// 	var browserLocation = browserContent.location.href;
		// 	// console.log(browserContent.history.back(Window));
		// 	$('.browser-location').val(browserLocation);
		// });

		// $('.browser-btn-forward').click(function(){
		// 	browserContent.history.forward();
		// 	var browserLocation = browserContent.location.href;
		// 	$('.browser-location').val(browserLocation);
		// });






		//edit
		// $('.edit-section').click(function() {

		// 	if(!$(this).hasClass('active')) {
		// 		$('.edit-section__content').slideUp(300);
		// 		$('.edit-section').removeClass('active');

		// 		$(this).children('.edit-section__content').slideDown(300);
		// 		$(this).addClass('active');
		// 	}
		// });
		try {
			$('.edit-accordion').accordion({
				header: '.edit-section__head'
			});

			$('.edit-section__sortable').sortable();
			$('.edit-section__sortable').disableSelection();

			markdownEditor();
			markDownEditorSetLines()

		}
		catch(err){
			//
		}

		$('.btn-markdown-editor-cancel').on('click', function() {
			$('.markdown-editor').stop().fadeOut(200);
		});

		$('.btn-markdown-edit').on('click', function() {
			$('.markdown-editor').stop().fadeIn(200);
		});

		// var t = $("#wmd-input")[0];
		// consloe.log(t.value.substr(0, t.selectionStart).split("\n").length);

		$("#wmd-input").on('click', function() {
			// markDownEditorActiveLine($(this)[0]);
			markDownEditorSetLines();
		});

		$("#wmd-input").on('keyup', function() {
			// markDownEditorActiveLine($(this)[0]);
			markDownEditorSetLines();
		});

		function markDownEditorActiveLine(textarea) {
			var line = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
			console.log(line);

		}

		function markDownEditorSetLines() {
			var textarea = $("#wmd-input");
			var textareaWidth = textarea.width();
			var charWidth = 7;
			var lineHeight = 21;
			var textareaMaxChars = textareaWidth / charWidth;
			var lines = textarea.val().split('\n');
			var linesLi = '';
			$.each(lines, function(index){
				var lineNumber = index + 1;
				var lineLength = this.length;
				var lineWrap = Math.floor(lineLength / textareaMaxChars);
				var liMarginBottom = lineWrap * lineHeight;
				linesLi += '<li style="margin-bottom:' + liMarginBottom +'px">&nbsp;</li>';
				console.log(lineLength);
			});

			if(linesLi) {
				var linesOl = '<ol>' + linesLi + '</ol>';
				$('.markdown-editor-line-numbers').html(linesOl);
				// console.log(linesOl);
			}

			// console.log(textareaMaxChars);



			// var line = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
			// console.log(line);

		}

		
		
});