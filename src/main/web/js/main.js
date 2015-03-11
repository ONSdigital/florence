(function($) {

  var intIntervalTime = 100;
  var pageurl = window.location.href;
  var pageData;

    function getPathName() {
      var parsedUrl = window.location.href.split("#!/")[1];
      return parsedUrl;
    }

  //florence menu
  var florence_menu =
    '<section class="fl-panel fl-panel--admin-bar">' +
      '<nav>' +
        '<ul class="fl-admin-menu">' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--collections">' +
            '<a href="#" class="fl-admin-menu__link">Collections</a>' +
          '</li>' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--useradmin">' +
            '<a href="#" class="fl-admin-menu__link">Users and access</a>' +
          '</li>' +
          '<li class="fl-admin-menu__item fl-admin-menu__item--publish">' +
            '<a href="#" class="fl-admin-menu__link">Publish</a>' +
          '</li>' +
        '</ul>' +
      '</nav>' +
    '</section>' +
    '<section class="fl-panel fl-panel--menu">' +
      '<nav>' +
        '<ul class="fl-main-menu">' +
          '<li class="fl-main-menu__item fl-main-menu__item--browse">' +
            '<a href="#" class="fl-main-menu__link">Browse</a>' +
          '</li>' +
          '<li class="fl-main-menu__item fl-main-menu__item--create">' +
            '<a href="#" class="fl-main-menu__link">Create</a>' +
          '</li>' +
          '<li class="fl-main-menu__item fl-main-menu__item--edit">' +
            '<a href="#" class="fl-main-menu__link">Edit</a>' +
          '</li>' +
          '<li class="fl-main-menu__item fl-main-menu__item--approve">' +
            '<a href="#" class="fl-main-menu__link">Approve</a>' +
          '</li>' +
        '</ul>' +
      '</nav>' +
  '</section>' +
  '<section class="fl-panel fl-panel--sub-menu">' +
  '</section>';

  //florence browse menu

  //florence create menu

  //florence edit menu
  var florence_menu_edit =
  '<section class="fl-panel fl-panel--editor">' +
    '<nav class="fl-panel--editor__breadcrumb">' +
      '<input type="text" value="" placeholder="Publish owner" class="fl-panel--editor__publish-owner" />' +
      '<input type="text" value="" placeholder="Publish id (release name)" class="fl-panel--editor__publish-id" />' +
    '</nav>' +
    '<textarea class="fl-editor" name="fl-editor" cols="40" rows="5"></textarea>' +
    '<nav class="fl-panel--editor__nav">' +
      '<button class="fl-panel--editor__nav__save">Save</button>' +
      '<button class="fl-panel--editor__nav__approve">Approve</button>' +
      '<button class="fl-panel--editor__nav__publish">Publish</button>' +
    '</nav>' +
  '</section>';


  setupFlorence();


  function setupFlorence(){
    $('head').prepend('<link href="http://localhost:8081/css/main.min.css" rel="stylesheet" type="text/css">');
    var bodycontent = $('body').html();


    $('body').wrapInner('<section class="fl-panel fl-panel--preview"><div class="fl-panel--preview__inner"></div></section>');
    // $('body').wrapInner('<section class="fl-container"></section>');
    $('body').prepend(florence_menu);

    $('.fl-main-menu__link').click(function() {
      setupFlorenceWorkspace($(this));
    });

  }

    function save(collectionName, data) {
      // Create the collection
      $.ajax({
        url: "http://localhost:8082/collection",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({name: collectionName}),
        success: function () {
          console.log("Collection created");
          openFileForEditing(collectionName, data);
        },
        error: function () {
          console.log('Error creating collection');
          openFileForEditing(collectionName, data);
        }
      });
    }

    function openFileForEditing(collectionName, data) {
      // Open the file for editing
      $.ajax({
        url: "http://localhost:8082/edit/" + collectionName,
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: JSON.stringify({uri: getPathName() + "/data.json"}),
        success: function () {
          console.log("File opened for editing");
          updateContent(collectionName, data);
        },
        error: function () {
          console.log('Error opening file for edit');
          updateContent(collectionName, data);
          console.log("update content called.");
        }
      });
    }

    function updateContent(collectionName, data) {
      // Update content
      $.ajax({
        url: "http://localhost:8082/content/" + collectionName + "?uri=" + getPathName() + "/data.json",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        data: data,
        success: function (message) {
          console.log("Updating completed" + message);
        },
        error: function (error) {
          console.log(error);
        }
      });

      document.cookie = 'collection=' + collectionName;
    }

    function approve(collectionName) {
      // Open the file for editing
      $.ajax({
        url: "http://localhost:8082/approve/" + collectionName + "?uri=" + getPathName() + "/data.json",
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        success: function () {
          console.log("File approved!");
          alert("Your file is now approved");
        },
        error: function () {
          console.log('Error');
        }
      });
    }

    function publish(collectionName) {
      // Open the file for editing
      $.ajax({
        url: "http://localhost:8082/publish/" + collectionName,
        dataType: 'json',
        crossDomain: true,
        type: 'POST',
        success: function () {
          console.log("File published");
          document.cookie = 'collection=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          alert("Published!");
        },
        error: function () {
          console.log('Error');
        }
      });
    }


    function LoadPageDataIntoEditor(){
    // var pageurl = window.location.href;
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
        console.log('No page data returned');
        $('.fl-editor').val('');
      }
    });
  }


  function convertPageJSONtoMarkdown(){}
  function saveUpdatedMarkdown(){}
  function watchForEditorChanges(){}

  function setupFlorenceWorkspace(caller){

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


    if (caller.parent().hasClass('fl-main-menu__item--browse')){
      //
    }

    else if (caller.parent().hasClass('fl-main-menu__item--create')){
      //
    }

    else if (caller.parent().hasClass('fl-main-menu__item--edit')){
      // $('.fl-panel--editor').show();
      // florence_menu_edit
      // fl-panel--sub-menu
      $('.fl-panel--sub-menu').html(florence_menu_edit);
      // console.log(florence_menu_edit);

      LoadPageDataIntoEditor();
      setInterval(checkEditPageLocation, intIntervalTime);
      $('.fl-panel--editor__nav__save').click(function() {
        if($('.fl-panel--editor__publish-owner').val().length != 0 && $('.fl-panel--editor__publish-id').val().length != 0){
          pageData = $('.fl-editor').val();
          save("testCollection", pageData);
          //console.log(parser.pathname);
        } else {
          alert('Publish owner and Publish id cannot be blank!');
        }

      });

      $('.fl-panel--editor__nav__approve').click(function () {
        approve(collectionName);
      });
      $('.fl-panel--editor__nav__publish').click(function () {
        publish(collectionName);
      });
    }

    if (caller.parent().hasClass('fl-main-menu__item--approve')){
      //
    }



    // else if (caller.parent().hasClass('fl-main-menu__item--publish')){
    //   //
    // }

    else {
      //
    }

  }


function removeSubMenus(){
  //$('.fl-panel--sub-menu').hide();
  $('.fl-panel--sub-menu').empty();
}

function removePreviewColClasses(){
  $('.fl-panel--preview').removeClass('col--4');
  $('.fl-panel--preview').removeClass('col--8');
}

function enablePreview(){
  $('.fl-panel--preview__inner').addClass('fl-panel--preview__inner--active');
}

function checkEditPageLocation() {
  if (pageurl != window.location.href) {
    pageurl = window.location.href;
    $(window.location).trigger("change", {
      newpage: LoadPageDataIntoEditor()
    });
  }
}

})(jQuery);
