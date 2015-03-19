function viewController(view){

	if (authenticate()){
		// alert('auth true');

		//click handlers
		$('.fl-admin-menu__link').click(function() {
			if ($(this).parent().hasClass('fl-admin-menu__item--collections')){
				viewController('collections');
			}
		});

		$('.fl-admin-menu__item--useradmin').click(function() {
				viewController('users-and-access');
		});

		$('.fl-admin-menu__item--login').click(function() {
				authenticate();
		});

		$('.fl-admin-menu__item--publish').click(function() {
				viewController('publish');
		});

		//clear view
		$('.fl-view').empty();

		//collections
		if (view === 'collections'){
			viewCollections();
		}

		//users and access
		else if (view === 'users-and-access'){
			alert('users and access is not implemented')
			//
		}

		//publish
		else if (view === 'publish'){
			alert('publish is not implemented')

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
