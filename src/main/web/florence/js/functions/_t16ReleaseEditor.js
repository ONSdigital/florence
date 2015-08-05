function releaseEditor(collectionId, data) {
	var newSections = [], newDates = [];
	var secActiveTab, getActiveTab;

	$(".edit-accordion").on('accordionactivate', function(event, ui) {
	    setActiveTab = $(".edit-accordion").accordion("option", "active");
	    if (setActiveTab !== false) {
	    	Florence.globalVars.activeTab = setActiveTab;
	    }
	});

	getActiveTab = Florence.globalVars.activeTab;
	accordion(getActiveTab);
	getLastPosition ();

	$("#title").on('input', function () {
		$data.description.title = $(this).val();
	})

	$("#edition").on('input', function () {
	    
	    data.description.edition = $(this).val();
	});
	if (!Florence.collection.date) {
	    if (!data.description.releaseDate){
	    	$('#releaseDate').datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
	        	data.description.releaseDate = new Date($(this).datepicker({dateFormat: 'dd MM yy'})[0].value).toISOString();
	    	});
	    } else {
	    	//dateTmp = $('#releaseDate').val();
	      	dateTmp = data.description.releaseDate;
	      	var dateTmpFormatted = $.datepicker.formatDate('dd MM yy', new Date(dateTmp));
	      	$('#releaseDate').val(dateTmpFormatted).datepicker({dateFormat: 'dd MM yy'}).on('change', function () {
	        	data.description.releaseDate = new Date($('#releaseDate').datepicker('getDate')).toISOString();
	      	});
	    }
	} else {
		$('.release-date').hide();
	}
	$("#nextRelease").on('input', function () {
	    data.description.nextRelease = $(this).val();
	});
	if (!data.description.contact) {
		data.description.contact = {};
	}
	$("#contactName").on('input', function () {
		data.description.contact.name = $(this).val();
	});
	$("#contactEmail").on('input', function () {
		data.description.contact.email = $(this).val();
	});
	$("#contactTelephone").on('input', function () {
		data.description.contact.telephone = $(this).val();
	});
	$("#summary").on('input', function () {
		data.description.summary = $(this).val();
	});

	/* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
	var checkBoxStatus = function (id) {
		if (id === 'natStat') {
			if(data.description.nationalStatistic === "false" || data.description.nationalStatistic === false) {
		  		return false;
			} else {
		  		return true;
		}
		} else if (id === 'cancelled') {
			if(data.description.cancelled === "false" || data.description.cancelled === false) {
			  	return false;
			} else {
			  	return true;
			}
		}
	};

	// Gets status of checkbox and sets JSON to match
	$("#natStat input[type='checkbox']").prop('checked', checkBoxStatus($('#natStat').attr('id'))).click(function () {
    	data.description.nationalStatistic = $("#natStat input[type='checkbox']").prop('checked') ? true : false;
  	});

  	$("#cancelled input[type='checkbox']").prop('checked', checkBoxStatus($('#cancelled').attr('id'))).click(function () {
    	data.description.cancelled = $("#cancelled input[type='checkbox']").prop('checked') ? true : false;
  	});

  	$("#dateChange").on('input', function (){
  		data.dateChanges.previousDate = $(this).val();
  	});

	// Save
	var editNav = $('.edit-nav');
	editNav.off(); // remove any existing event handlers.

	editNav.on('click', '.btn-edit-save', function () {
	    save();
	    updateContent(collectionId, data.uri, JSON.stringify(data));
	});

	// completed to review
    editNav.on('click', '.btn-edit-save-and-submit-for-review', function () {
      //pageData = $('.fl-editor__headline').val();
      save();
      saveAndCompleteContent(collectionId, data.uri, JSON.stringify(data));
    });

    // reviewed to approve
    editNav.on('click', '.btn-edit-save-and-submit-for-approval', function () {
      save();
      saveAndReviewContent(collectionId, data.uri, JSON.stringify(data));
    });


	function save() {
	    // Sections
	    var orderSection = $("#sortable-section").sortable('toArray');
	    $(orderSection).each(function (indexS, nameS) {
	      	var markdown = data.sections[parseInt(nameS)].markdown;
	      	var title = $('#section-title_' + nameS).val();
	      	newSections[indexS] = {title: title, markdown: markdown};
	    });
	    data.sections = newSections;
	    // Date changes
	    var orderDates = $("#sortable-date").sortable('toArray');
	    console.log('orderDates = ' + orderDates);
	    $(orderDates).each(function (indexD, nameD) {
			var markdown = data.dateChanges[parseInt(nameD)].markdown;
			var previousDate = $('#previousDate_' + indexD).val();
			console.log(date);
			newDates[indexD] = {previousDate: previousDate, markdown: markdown};
	    });
	    console.log('newDates = ' + newDates);
	    data.dateChanges = newDates;
  }

}