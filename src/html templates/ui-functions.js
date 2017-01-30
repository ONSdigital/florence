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




		//publishes table
		$('.publish-select-table tbody tr').click(function(){

			$('.publish-select-table tbody tr').removeClass('selected');

			$(this).addClass('selected');

			$('.publish-selected').animate({right: "0%"}, 800);

			$('.publish-select').animate({marginLeft: "0%"}, 500);
		});

		$('.publish-selected .btn-cancel').click(function(){
			$('.publish-selected').animate({right: "-50%"}, 500);
			$('.publish-select').animate({marginLeft: "25%"}, 800);
			$('.publish-select-table tbody tr').removeClass('selected');
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
			// var linesHolder = $('.markdown-editor-line-numbers');
			var textareaWidth = textarea.width();
			var charWidth = 7;
			var lineHeight = 21;
			var textareaMaxChars = Math.floor(textareaWidth / charWidth);
			var lines = textarea.val().split('\n');
			var linesLi = '';
			var cursorEndPos = textarea.prop('selectionEnd');
			var charMapArray = [];
			var charMapArrayJoin = [];
			var lineLengthArray = [];
			var contentLength = textarea.val().length;
			var cumulativeLineLength = 0;
			// var cursorLine = textarea.prop('selectionStart').split('\n').length;
			$.each(lines, function(index){
				var lineNumber = index + 1;
				var lineLength = this.length;
				var lineWrap = Math.round(lineLength / textareaMaxChars);
				// var lineWrap = Math.floor(lineLength / textareaMaxChars);
				// var lineWrap = Math.ceil(lineLength / textareaMaxChars);

        console.log('max chars: ' + textareaMaxChars);
        console.log('line length: ' + lineLength);


        var numberOfLinesCovered = textareaLines(this, textareaMaxChars, 0, 0);
				var liPaddingBottom = numberOfLinesCovered * lineHeight;

				if(lineNumber === 1) {
					cumulativeLineLength += lineLength;
				} else {
					cumulativeLineLength += lineLength + 1;
					// console.log('+1');
				}


				linesLi += '<li id="markdownEditorLine-' + lineNumber + '" style="padding-bottom:' + liPaddingBottom +'px">&nbsp;</li>';

				lineLengthArray.push(cumulativeLineLength);



				//push to charmap

				// charMapArray.push(this.replace(this.split(''), lineNumber));


				// console.log(this.selectionStart);

				//console.log('line wrap: ' + lineWrap + ' (' + lineLength / textareaMaxChars + ')');
			});


      //for carl :)
      // given a line of text, calculate how many lines it will cover given a max line length
      // with word wrap
			function textareaLines(line, maxLineLength, start, numberOfLinesCovered) {

				if (start + maxLineLength >= line.length) {
					console.log('Line Length = ' + numberOfLinesCovered);
					return numberOfLinesCovered;
				}

				var substring = line.substr(start, maxLineLength + 1);
				var actualLineLength = substring.lastIndexOf(' ') + 1;

				if (actualLineLength === maxLineLength) // edge case - the break is at the end of the line exactly with a space after it
				{
					console.log('edge case hit');
					actualLineLength--;
				}

				if (start + actualLineLength === line.length) {
					console.log('edge case  2 hit');
					return numberOfLinesCovered;
				}
				//if (actualLineLength === -1) {
				//  console.log('edge case   3 hit');
				//  return numberOfLinesCovered;
				//}

				console.log('Line: ' + numberOfLinesCovered + ' length = ' + actualLineLength);

				return textareaLines(line, maxLineLength, start + actualLineLength, numberOfLinesCovered + 1);
			}

			if(linesLi) {
				var linesOl = '<ol>' + linesLi + '</ol>';
				$('.markdown-editor-line-numbers').html(linesOl);
				// console.log(linesOl);
			}

			//sync scroll
			$('.markdown-editor-line-numbers ol').css('margin-top', -textarea.scrollTop());
			textarea.on('scroll', function () {
				var marginTop = $(this).scrollTop();
				$('.markdown-editor-line-numbers ol').css('margin-top', -marginTop);
				$('.wmd-preview').scrollTop(marginTop);
			});


			for (var i = 0; i < lineLengthArray.length; i++) {

				if(cursorEndPos <= lineLengthArray[i]) {
					// console.log(i + 1);
					var activeLine = i + 1;
					$('#markdownEditorLine-' + activeLine).addClass('active');
					break;
				}
				// console.log(lineLengthArray[i]);
				//Do something
			}



		}

		try {

			$('.collections-accordion').accordion({
				header: '.collections-section__head',
				active: false,
				collapsible: true
			});

		}
		catch(err){
			//
		}



});