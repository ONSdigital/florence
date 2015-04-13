function viewController(view){

	if (logged_in()){
		// alert('auth true');

		//click handlers
		$('.fl-admin-menu__link').unbind("click").click(function() {
			if ($(this).parent().hasClass('fl-admin-menu__item--collections')){
				viewController('collections');
			}
		});

		$('.fl-admin-menu__item--useradmin').unbind("click").click(function() {
				viewController('users-and-access');
		});

		var loginLink = $('.fl-admin-menu__item--login');
		loginLink.addClass('hidden');
		loginLink.unbind("click").click(function() {
			viewController('login');
		});
		var logoutLink = $('.fl-admin-menu__item--logout')
		logoutLink.removeClass('hidden');
		logoutLink.unbind("click").click(function() {
			logoutLink.addClass('hidden');
			loginLink.removeClass('hidden');
			logout();
			viewController('login');
		});

		$('.fl-admin-menu__item--publish').unbind("click").click(function() {
				viewController('publish');
		});

		//clear view
		$('.fl-view').empty();

		if (view === 'collections'){
			viewCollections();
		}
		else if (view === 'users-and-access'){
			viewUserAndAccess('create');
		}
		else if (view === 'login'){
			viewUserAndAccess('login');
		}
		else if (view === 'publish'){
			viewPublish();
		}
		else if (view === 'workspace'){
			viewWorkspace();
		}
		else {
			viewController('collections');
			// viewController('workspace')
		}
	}

	//authentication
  else {
    //authentication calls collections view for now until authentication is implemented
    // viewCollections();
    //viewWorkspace();
    viewLogIn();
  }

  function logged_in(){
    // read the cookie here to see if there is an access token, then check if its valid
    return accessToken() != ''
  }
}
