function viewController(caller){

	if (authenticate()){
		// alert('auth true');

		//click handlers
		$('.fl-admin-menu__link').click(function() {
			if ($(this).parent().hasClass('fl-admin-menu__item--collections')){
				viewController('collections');
			}
		});

		//clear view
		$('.fl-view').empty();

		//collections
		if (caller === 'collections'){
			viewCollections();
		}

		//users and access
		else if (caller === 'users-and-access'){
			//
		}

		//publish
		else if (caller === 'publish'){
			//
		}

		//workspace
		else if (caller === 'workspace'){
			viewWorkspace();
		}
		

		//else collections
		else {
			viewController('collections');
			// viewController('workspace')
		}
	}

	//authentication
		else {
			//authentication calls collections view for now untill authentication is implimented
			// viewCollections();
			//viewWorkspace();
			alert('Not authenticated');
		}
	

	
}