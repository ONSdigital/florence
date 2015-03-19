function viewController(view){

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
		if (view === 'collections'){
			viewCollections();
		}

		//users and access
		else if (view === 'users-and-access'){
			//
		}

		//publish
		else if (view === 'publish'){
			//
		}

		//workspace
		else if (view === 'workspace'){
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