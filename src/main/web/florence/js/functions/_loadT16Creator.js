function loadT16Creator (collectionId, releaseDate, pageType, parentUrl) {
	var pageType, pageTitle, uriSection, pageTitleTrimmed, releaseDate, releaseDateManual, breadcrumb

	//Stores parent URL
	var parentUrlData = parentUrl + "/data";
	$.ajax({
	url: parentUrlData,
	dataType: 'json',
	crossDomain: true,
	success: function (checkData) {
		//Checks page is built in correct location
		if (checkData.type === 'product_page') {
			//Builds breadcrumb from parent breadcrumb/uri
			var inheritedBreadcrumb = checkData.breadcrumb;
			var parentBreadcrumb = {
		  		"uri": checkData.uri
			};
			inheritedBreadcrumb.push(parentBreadcrumb);
			breadcrumb = inheritedBreadcrumb;
			submitFormHandler ();
			return true;
		} else {
			alert("This is not a valid place to create this page.");
			loadCreateScreen(collectionId);
		}
	},
	error: function () {
		console.log('No page data returned');
	}
	});

	function submitFormHandler () {
		//Adds 'edition' and manual 'release date' field
		$('.edition').append(
			'<label for="edition">Edition</label>' +
			'<input id="edition" type="text" placeholder="August 2010, Q3 2015, 1978, etc." />'
	    );
	    if (!releaseDate) {
			$('.edition').append(
			'<label for="releaseDate">Release date</label>' +
			'<input id="releaseDate" type="text" placeholder="day month year" />'
			);
			$('#releaseDate').datepicker({dateFormat: 'dd MM yy'});
	    }

	    //Submits inherited and added information to JSON
	    $('form').submit(function (e) {
			releaseDateManual = $('#releaseDate').val()
			pageData = pageTypeDataT16(pageType);
			pageData.description.edition = $('#edition').val();
			pageTitle = $('#pagename').val();
			pageData.description.title = pageTitle;
			uriSection = "";
			pageTitleTrimmed = pageTitle.replace(/[^A-Z0-9]+/ig, "").toLowerCase();

			if (!releaseDate) {
	        	pageData.description.releaseDate = new Date($('#releaseDate').val()).toISOString();
	      	} else {
	        	pageData.description.releaseDate = releaseDate;
	      	}
			newUri = makeUrl(parentUrl, uriSection, pageTitleTrimmed);
			newUri = '/' + newUri;
			pageData.uri = newUri;
			pageData.breadcrumb = breadcrumb;

			if (!pageData.description.releaseDate) {
	        	alert('Release date can not be empty');
	        	return true;
			} if (pageTitle.length < 4) {
        		alert("This is not a valid file title");
	        	return true;
			} else {
	        	Florence.globalVars.pagePath = newUri;
	        	checkSaveContent(collectionId, newUri, pageData);
			}
			e.preventDefault();
	    });
	}

	function pageTypeDataT16(pageType) {
		return {
			"description": {
				"edition": "",
				"releaseDate": "",
				"nextRelease": "",
				"contact": {
					"name": "",
					"email": "",
					"telephone": ""
				},
				"summary": "",
				"title": "",
				"nationalStatistic": false,
				"cancelled": false,
				"cancellationNotice": "",
			},
			"sections": [],
			"accordion": [],
			"relatedDatasets": [],
			"relatedDocuments": [],
			type: pageType,
			"uri": "",
			"breadcrumb": [],
			"dateChanges": [],
		};
	}
}