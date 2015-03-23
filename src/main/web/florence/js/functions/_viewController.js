function viewController(view, collectionName){

	if (logged_in()){
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
				viewController('login');
		});

		$('.fl-admin-menu__item--publish').click(function() {
				//viewController('publish');
		});

		//clear view
		$('.fl-view').empty();

		//collections
		if (view === 'collections'){
			viewCollections();
		}

		//users and access
		else if (view === 'users-and-access'){
			viewUserAndAccess('create');
			//
		}

		else if (view === 'login'){
			viewUserAndAccess('login');
		}
		//publish
		else if (view === 'publish'){
			alert('publish is not implemented')

			//
		}

		//workspace
		else if (view === 'workspace'){
			viewWorkspace(collectionName);
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

		function logged_in(){

			// read the cookie here to see if theres an access token, then check if its valid
			return true
		}


}
