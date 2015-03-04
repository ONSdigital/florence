(function($) {

    setupFlorence();


    function setupFlorence(){
        $('head').prepend('<link href="http://localhost:8081/css/main.min.css" rel="stylesheet" type="text/css">');
        var bodycontent = $('body').html();
        var florence_menu =
            '<section class="fl-panel fl-panel--menu">' +
            '<nav>' +
            '<h1 class="fl-brand">Florence Dashboard v0.1</h1>' +
            '<ul class="fl-main-menu">' +
            '<li class="fl-main-menu__item fl-main-menu__item--approve">' +
            '<a href="#" class="fl-main-menu__link">Approve</a></li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--create">' +
            '<a href="#" class="fl-main-menu__link">Create</a></li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--edit">' +
            '<a href="#" class="fl-main-menu__link">Edit</a></li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--users">' +
            '<a href="#" class="fl-main-menu__link">Users</a></li>' +
            '<li class="fl-main-menu__item fl-main-menu__item--publish">' +
            '<a href="#" class="fl-main-menu__link">Publish</a></li>' +
            '</ul>' +
            '</nav>' +
            '</section>' +
            '<section class="fl-panel fl-panel--sub-menu">' +
            '<section class="fl-panel fl-panel--editor">' +
            '<nav class="fl-panel--editor__breadcrumb">' +
            '<p>Selected publish goes here...</p>' +
            '</nav>' +
            '<textarea class="fl-editor" name="fl-editor" cols="40" rows="5"></textarea>' +
            '<nav class="fl-panel--editor__nav">' +
            '<button class="fl-panel--editor__nav__save">Save</button>' +
            '</nav>' +
            '</section>' +
            '</section>';

        $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
        // $('body').wrapInner('<section class="fl-container"></section>');
        $('body').prepend(florence_menu);

        $('.fl-main-menu__link').click(function() {
            setupFlorenceScene($(this));
        });

    }

    function LoadPageDataIntoEditor(){

        var pageurl = window.location.href;

        var pageurldata = pageurl.replace("#!", "data");

        $.ajax({
            url: pageurldata,
            dataType: 'json', // Notice! JSONP <-- P (lowercase)
            crossDomain: true,
            // jsonpCallback: 'callback',
            // type: 'GET',
            success: function(response) {
                // do stuff with json (in this case an array)
                // console.log("Success");
                var dataString = String(response);
                // pageType = data.level
                // console.log(response);
                $('.fl-editor').val(JSON.stringify(response, null, 2));
            },
            error: function() {
                console.log('Error');
            }
        });
    }


    function convertPageJSONtoMarkdown(){}
    function saveUpdatedMarkdown(){}
    function watchForEditorChanges(){}

    function setupFlorenceScene(caller){

        //console.log(caller.parent().attr('class'));
        // console.log($('.fl-panel--preview__inner').height())

        // setPreviewOverlayHeight();

        removePreviewColClasses();
        removeSubMenus();

        $('.fl-main-menu__link').removeClass('fl-main-menu__link--active');
        caller.addClass('fl-main-menu__link--active');

        $('.fl-panel--preview__inner').removeClass('fl-panel--preview__inner--active');
        $('.fl-panel--preview').addClass('col--7');
        $('.fl-panel--sub-menu').show();


        if (caller.parent().hasClass('fl-main-menu__item--approve')){
            // removePreviewColClasses();
            // $('.fl-panel--preview').addClass('col--7');
            // $('.fl-panel--sub-menu').show();
        }

        else if (caller.parent().hasClass('fl-main-menu__item--create')){
            // removePreviewColClasses();
            // $('.fl-panel--preview').addClass('col--7');
            // $('.fl-panel--sub-menu').show();
        }

        else if (caller.parent().hasClass('fl-main-menu__item--edit')){
            // removePreviewColClasses();
            // $('.fl-panel--preview').addClass('col--7');
            // $('.fl-panel--sub-menu').show();
            $('.fl-panel--editor').show();
            $('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');
            LoadPageDataIntoEditor();
        }

        else if (caller.parent().hasClass('fl-main-menu__item--users')){
            // removePreviewColClasses();
            // $('.fl-panel--preview').addClass('col--7');
            // $('.fl-panel--sub-menu').show();
        }

        else if (caller.parent().hasClass('fl-main-menu__item--publish')){
            // removePreviewColClasses();
            // $('.fl-panel--preview').addClass('col--7');
            // $('.fl-panel--sub-menu').show();
        }

        else {
            //
        }

    }


    function removeSubMenus(){
        $('.fl-panel--sub-menu').hide();
        $('.fl-panel--editor').hide();
    }

    function removePreviewColClasses(){
        $('.fl-panel--preview').removeClass('col--4');
        $('.fl-panel--preview').removeClass('col--8');
    }

    function updatePage() {

        document.cookie="owner=carlhuk";
        document.cookie="release=myRelease3";

        $.ajax({
            url: "http://localhost:8081/data",
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            data: JSON.stringify({
                json: JSON.stringify(data),
                id: parser.pathname
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "text"
        }).done(function() {
            console.log("Done!");
            location.reload();
        }).fail(function(jqXHR, textStatus) {
            alert(textStatus);
        })
    }


})(jQuery);
