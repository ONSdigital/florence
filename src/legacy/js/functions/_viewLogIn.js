function viewLogIn() {

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var verification_code = getParameterByName("verify");
    if(verification_code && !window.verificationAttempted) {
        var email = getParameterByName("email");
        window.verificationAttempted = true;
        postLogin("<verify>:"+email, verification_code);
        return;
    }

    var login_form = templates.login;
    $('.section').html(login_form);

    $('.form-login').submit(function (e) {
        e.preventDefault();
        loadingBtn($('#login'));
        var email = $('.fl-user-and-access__email').val();
        var password = $('.fl-user-and-access__password').val();
        postLogin(email, password);
    });
}

