function bulletinEditor(collectionName, data) {

  var newSections = [];
  var newTabs = [];
  var newRelated = [];
  var newLinks = [];
  var lastIndexSection, lastIndexTab, lastIndexRelated, lastIndexLink;

  //console.log(data.sections);

  $(".section-list").remove();
  $("#addCorrection").remove();
  $("#addSection").remove();
  $("#addTab").remove();
  $("#addBulletin").remove();
  $("#addLink").remove();

  $("#metadata-list").remove();

  // Metadata load
  $("#metadata-section").append(
    '<div id="metadata-list">' +
    ' <p>Title: <textarea class="auto-size" type="text" id="title" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Next release: <textarea class="auto-size" type="text" id="nextRelease" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Contact name: <textarea class="auto-size" type="text" id="contactName" cols="20" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Contact email: <textarea class="auto-size" type="text" id="contactEmail" cols="30" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Headline 1: <textarea class="auto-size" type="text" id="headline1" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Headline 2: <textarea class="auto-size" type="text" id="headline2" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p>Headline 3: <textarea class="auto-size" type="text" id="headline3" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    ' <p >National statistic: <input type="checkbox" name="natStat" value="yes" /> Yes </p>' +
    ' <p>Summary: <textarea class="auto-size" type="text" id="summary" cols="40" style="box-sizing: border-box; min-height: 31px;"></textarea></p>' +
    '</div>');

  // Metadata edition and saving
  $("#title").val(data.title).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.title = $(this).val();
  });
  $("#nextRelease").val(data.nextRelease).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.nextRelease = $(this).val();
  });
  $("#contactName").val(data.contact.name).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.name = $(this).val();
  });
  $("#contactEmail").val(data.contact.email).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.contact.email = $(this).val();
  });
  $("#summary").val(data.summary).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.summary = $(this).val();
  });
  $("#headline1").val(data.headline1).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline1 = $(this).val();
  });
  $("#headline2").val(data.headline2).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline2 = $(this).val();
  });
  $("#headline3").val(data.headline3).on('click keyup', function () {
    $(this).textareaAutoSize();
    data.headline3 = $(this).val();
  });

  /* The checked attribute is a boolean attribute, which means the corresponding property is true if the attribute
   is present at all—even if, for example, the attribute has no value or is set to empty string value or even "false" */
  var checkBoxStatus = function () {
    if(data.nationalStatistic === "false" || data.nationalStatistic === false) {
      return false;
    } else {
      return true;
    }
  };

  $("#metadata-list input[type='checkbox']").prop('checked', checkBoxStatus).click(function () {
    data.nationalStatistic = $("#metadata-list input[type='checkbox']").prop('checked') ? true : false;
  });

  var style = "background-image:url(img/sb_v_double_arrow.png);background-repeat: no-repeat; background-position:10px 25px";


  // Correction section
  // Load
  $(data.correction).each(function (index, correction) {
    lastIndexCorrection = index + 1;
    $(".fl-editor__correction").append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;">' +
        '  <p>Text: <textarea class="auto-size" type="text" id="correction_text_' + index + '" cols="65" style="box-sizing: border-box; min-height: 31px;">' + correction.text + '</textarea></p>' +
        '  <p>Date: <input class="auto-size" type="date" id="correction_date_' + index + '"/></p>' +
        '  <p>Type: <input type="radio" name="correctionType" value="minor"/><label> Minor</label> ' +
        '           <input type="radio" name="correctionType" value="major"/><label> Major</label> ' +
        '  </p>' +
        '  <button class="fl-panel--editor__correction__item__delete_' + index + '">Delete</button>' +
        '</div>');

    $("#correction_text_" + index).on('click keyup', function () {
      $(this).textareaAutoSize();
      data.correction[index].text = $(this).val();
    });
    $("#correction_date_" + index).val(correction.date).on('click keyup', function () {
      data.correction[index].date = $(this).val();
    });

    // Delete
    $(".fl-panel--editor__correction__item__delete_" + index).click(function () {
      $("#" + index).remove();
      data.correction.splice(index, 1);
      updateContent(collectionName, getPathName(), JSON.stringify(data));
      datasetEditor(collectionName, data);
    });
  });

  // New correction
  $("#correction-section").append('<button id="addCorrection">Add new correction</button>');
  $("#addCorrection").one('click', function () {
    data.correction.push({text:"", date:""});
    updateContent(collectionName, getPathName(), JSON.stringify(data));
    datasetEditor(collectionName, data);
  });

  // Edit sections
  // Load and edition
  $(data.sections).each(function(index, section){
    lastIndexSection = index + 1;
    $('.fl-editor__sections').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        //'<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>' +
        'Title ' +
        ' <textarea id="section__' + index + '" cols="50" placeholder="Type title here and click edit to add content">' + section.title + '</textarea>' +
        ' <textarea style="display: none;" id="section_markdown_' + index + '">' + section.markdown + '</textarea>' +
        ' <button class="fl-panel--editor__sections__section-item__edit_' + index + '">Edit</button>' +
        ' <button class="fl-panel--editor__sections__section-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__sections__section-item__edit_"+index).click(function() {
      var editedSectionValue = $("#section_markdown_" + index).val();

      var editorPrev = '<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>';
      var editorEdit = '<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
      '<div id="wmd-button-bar"></div>' +
      ' <textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedSectionValue + '</textarea>' +
      ' <button id="finish-section">Finish editing</button>' +
      '</div>';

      $('body').prepend(editorPrev, editorEdit);

      markdownEditor();

      $("#finish-section").click(function(){
        var editedSectionText = $('#wmd-input').val();
        data.sections[index].markdown = editedSectionText;
        var editedSectionTitle = $('#section__' + index).val();
        data.sections[index].title = editedSectionTitle;
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
        bulletinEditor(collectionName, data);
        save();
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });

    // Delete
    $(".fl-panel--editor__sections__section-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.sections.splice(index, 1);
      bulletinEditor(collectionName, data);
    });
  });

  //Add new sections
  $("#content-section").append('<button id="addSection">Add new section</button>');
  $("#addSection").click(function () {
    $('.fl-editor__sections').append(
      '<div id="' + lastIndexSection + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
      'Title ' +
      ' <textarea id="section__' + lastIndexSection + '" cols="50"></textarea>' +
      ' <textarea style="display: none;" id="section_markdown_' + lastIndexSection + '"></textarea>' +
      ' <button class="fl-panel--editor__sections__section-item__edit_' + lastIndexSection + '">Edit</button>' +
      ' <button class="fl-panel--editor__sections__section-item__delete_' + lastIndexSection + '">Delete</button>' +
      '</div>');
    sortableSections();
    saveNewSection();
  });

  function saveNewSection() {
    var orderSection = $(".fl-editor__sections").sortable('toArray');
    $(orderSection).each(function(index, name){
      var title = $('#section__'+name).val();
      var markdown = $('#section_markdown_'+name).val();
      newSections[index] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    $(".section-list").remove();
    $("#metadata-list").remove();
    bulletinEditor(collectionName, data);
  }

  function sortableSections() {
    $(".fl-editor__sections").sortable();
  }
  sortableSections();

  // Edit accordion
  // Load and edition
  $(data.accordion).each(function(index, tab) {
    lastIndexTab = index + 1;
    $('.fl-editor__accordion').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="tab__' + index + '" cols="50">' + tab.title + '</textarea>' +
        ' <textarea style="display: none;" id="tab_markdown_' + index + '">' + tab.markdown + '</textarea>' +
        ' <button class="fl-panel--editor__accordion__tab-item__edit_' + index + '">Edit</button>' +
        ' <button class="fl-panel--editor__accordion__tab-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    $(".fl-panel--editor__accordion__tab-item__edit_"+index).click(function() {
      var editedTabValue = $("#tab_markdown_" + index).val();

      var editorPrev = '<div style="float: right; margin-top: 50px; height:905px; overflow: scroll;" id="wmd-preview" class="wmd-panel wmd-preview"></div>';
      var editorEdit = '<div style="float: left; margin-top: 50px;" id="wmd-edit" class="wmd-panel">' +
          '<div id="wmd-button-bar"></div>' +
          ' <textarea style="height:845px;" class="wmd-input" id="wmd-input">' + editedTabValue + '</textarea>' +
          ' <button id="finish-tab">Finish editing</button>' +
          '</div>';

      $('body').prepend(editorPrev, editorEdit);

      markdownEditor();

      $("#finish-tab").click(function() {
        data.accordion[index].markdown = $('#wmd-input').val();
        data.accordion[index].title = $('#tab__' + index).val();
        $("#wmd-preview").remove();
        $("#wmd-edit").remove();
        save();
        updateContent(collectionName, getPathName(), JSON.stringify(data));
      });
    });

    // Delete
    $(".fl-panel--editor__accordion__tab-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.accordion.splice(index, 1);
      bulletinEditor(collectionName, data);
    });
  });

  //Add new tab
  $("#accordion-section").append('<button id="addTab">Add new tab</button>');
  $("#addTab").click(function () {
    $('.fl-editor__accordion').append(
        '<div id="' + lastIndexTab + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="tab__' + lastIndexTab + '" cols="50"></textarea>' +
        ' <textarea style="display: none;" id="tab_markdown_' + lastIndexTab + '"></textarea>' +
        ' <button class="fl-panel--editor__accordion__tab-item__edit_' + lastIndexTab + '">Edit</button>' +
        ' <button class="fl-panel--editor__accordion__tab-item__delete_' + lastIndexTab + '">Delete</button>' +
        '</div>');
    sortableTabs();
    saveNewTab();
  });

  function saveNewTab() {
    var orderTab = $(".fl-editor__accordion").sortable('toArray');
    $(orderTab).each(function(index, name){
      var title = $('#tab__'+name).val();
      var markdown = $('#tab_markdown_'+name).val();
      newTabs[parseInt(index)] = {title: title, markdown: markdown};
    });
    data.accordion = newTabs;
    console.log(data.accordion);
    $(".tab-list").remove();
    $("#metadata-list").remove();
    bulletinEditor(collectionName, data);
  }

  function sortableTabs() {
    $(".fl-editor__accordion").sortable();
  }
  sortableTabs();

  // Related bulletin
  // Load
  if (data.relatedBulletins.length === 0) {
    lastIndexRelated = 0;
  } else {
    $(data.relatedBulletins).each(function (iBulletin, bulletin) {
      lastIndexRelated = iBulletin + 1;
      $('.fl-editor__related').append(
          '<div id="' + iBulletin + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
          'Link ' +
          ' <textarea id="bulletin__' + iBulletin + '" cols="50">' + bulletin.uri + '</textarea>' +
          ' <textarea style="display: none;" id="bulletin_name_' + iBulletin + '">' + bulletin.name + '</textarea>' +
          ' <textarea style="display: none;" id="bulletin_summary_' + iBulletin + '">' + bulletin.summary + '</textarea>' +
          ' <button class="fl-panel--editor__related__bulletin-item__delete_' + iBulletin + '">Delete</button>' +
          '</div>');

      // Delete
      $(".fl-panel--editor__related__bulletin-item__delete_" + iBulletin).click(function () {
        $("#" + iBulletin).remove();
        data.relatedBulletins.splice(iBulletin, 1);
        bulletinEditor(collectionName, data);
      });
    });
  }

  //Add new related
  $("#related-section").append('<button id="addBulletin">Add new link</button>');
  $("#addBulletin").one('click', function () {
    $('.fl-editor__related').append(
        '<div id="' + lastIndexRelated + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Link ' +
        '  <textarea id="bulletin__' + lastIndexRelated + '" placeholder="Go to the related bulletin and click Get" cols="50"></textarea>' +
        '  <button class="fl-panel--editor__related__bulletin-item__get_' + lastIndexRelated + '">Get</button>' +
        '  <button class="fl-panel--editor__related__bulletin-item__cancel_' + lastIndexRelated + '">Cancel</button>' +
        '</div>');

    $(".fl-panel--editor__related__bulletin-item__cancel_" + lastIndexRelated).hide();

    unCheckPage();
    loadPageDataIntoEditor(collectionName, false);

    $(".fl-panel--editor__related__bulletin-item__get_" + lastIndexRelated).one('click', function () {
      $(".fl-panel--editor__related__bulletin-item__cancel_" + lastIndexRelated).show().one('click', function () {
        $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
        checkPage();
        $(".fl-panel--editor__related__bulletin-item__cancel_" + lastIndexRelated).remove();
        bulletinEditor(collectionName, data);
      });
      var bulletinurl = $('.fl-panel--preview__content').contents().get(0).location.href;
      var bulletinurldata = "/data" + bulletinurl.split("#!")[1];
      $.ajax({
        url: bulletinurldata,
        dataType: 'json',
        crossDomain: true,
        success: function (relatedData) {
          if (relatedData.type === 'bulletin') {
            $('#bulletin__' + lastIndexRelated).val(relatedData.uri);
            $('.bulletin-list').append(
                '<textarea style="display: none;" id="bulletin_name_' + lastIndexRelated + '"></textarea>' +
                '<textarea style="display: none;" id="bulletin_summary_' + lastIndexRelated + '"></textarea>');
            $('#bulletin_name_' + lastIndexRelated).val(relatedData.name);
            $('#bulletin_summary_' + lastIndexRelated).val(relatedData.summary);
            saveNewBulletin();
            $('.fl-panel--preview__content').get(0).src = localStorage.getItem("pageurl");
            //checkPage2();
            checkPage();
            save();
            updateContent(collectionName, getPathName(), JSON.stringify(data));
          } else {
            alert("This is not a bulletin");
          }
        },
        error: function () {
          console.log('No page data returned');
        }
      });
    });
    sortableRelated();
  });

  function checkPage() {
    window.intervalID = setInterval(function () {
      checkForPageChanged(function () {
        loadPageDataIntoEditor(collectionName, true);
      });
    }, intIntervalTime);
  }

  function unCheckPage() {
    clearInterval(window.intervalID);
  }

  function sortableRelated() {
    $(".fl-editor__related").sortable();
  }

  sortableRelated();

  function saveNewBulletin() {
    var orderBulletin = $(".fl-editor__related").sortable('toArray');
    $(orderBulletin).each(function(indexB, nameB){
      var uri = $('#bulletin__'+nameB).val();
      var summary = $('#bulletin_summary_'+nameB).val();
      var names = $('#bulletin_name_'+nameB).val();
      newRelated[parseInt(indexB)] = {uri: uri, name: names, summary: summary};
    });
    data.relatedBulletins = newRelated;
    $(".bulletin-list").remove();
    $("#metadata-list").remove();
    bulletinEditor(collectionName, data);
  }

  // Edit external
  // Load and edition
  $(data.externalLinks).each(function(index, link){
    lastIndexLink = index + 1;
    $('.fl-editor__external').append(
        '<div id="' + index + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="link__' + index + '" cols="50">' + link.url + '</textarea>' +
        ' <button class="fl-panel--editor__external__link-item__delete_' + index + '">Delete</button>' +
        '</div>').show();

    // Delete
    $(".fl-panel--editor__external__link-item__delete_"+index).click(function() {
      $("#"+index).remove();
      data.externalLinks.splice(index, 1);
      bulletinEditor(collectionName, data);
    });
  });

  //Add new external
  $("#external-section").append('<button id="addLink">Add new link</button>');
  $("#addLink").click(function () {
    $('.fl-editor__external').append(
        '<div id="' + lastIndexLink + '" class="section-list" style="background-color:grey; color:white;'+style+'">' +
        'Title ' +
        ' <textarea id="link__' + lastIndexLink + '" placeholder="Copy the link here" cols="50"></textarea>' +
        ' <button class="fl-panel--editor__external__link-item__delete_' + lastIndexLink + '">Delete</button>' +
        '</div>');
    sortableLinks();
    saveNewLink();
  });

  function saveNewLink() {
    var orderLink = $(".fl-editor__external").sortable('toArray');
    $(orderLink).each(function(index, name){
      var link;
      console.log($('#link__' + name).val().length);
      if($('#link__' + name).val().length === 0) {
        link = "";
      } else {
        link = $('#link__' + name).val();
      }
      console.log(link);
      newLinks[index] = {url: link};
    });
    data.externalLinks = newLinks;
    $(".link-list").remove();
    $("#metadata-list").remove();
    bulletinEditor(collectionName, data);
  }

  function sortableLinks() {
    $(".fl-editor__external").sortable();
  }
  sortableLinks();



  // Save
  $('.fl-panel--editor__nav__save').unbind("click").click(function () {
    save();
    updateContent(collectionName, getPathName(), JSON.stringify(data));
  });

  // complete
  $('.fl-panel--editor__nav__complete').unbind("click").click(function () {
    pageData = $('.fl-editor__headline').val();
    save();
    saveAndCompleteContent(collectionName, getPathName(), JSON.stringify(data));
  });


  function save() {
    // Sections
    var orderSection = $(".fl-editor__sections").sortable('toArray');
    $(orderSection).each(function (indexS, nameS) {
        var markdown = $('#section_markdown_' + nameS).val();
        var title = $('#section__' + nameS).val();
      newSections[indexS] = {title: title, markdown: markdown};
    });
    data.sections = newSections;
    // Tabs
    var orderTab = $(".fl-editor__accordion").sortable('toArray');
    $(orderTab).each(function (indexT, nameT) {
      var markdown = data.accordion[parseInt(nameT)].markdown;
      var title = $('#tab__' + nameT).val();
      newTabs[indexT] = {title: title, markdown: markdown};
    });
    console.log(newTabs);
    data.accordion = newTabs;
    // Related links
    var orderBulletin = $(".fl-editor__related").sortable('toArray');
    $(orderBulletin).each(function (indexB, nameB) {
      var uri = $('#bulletin__' + nameB).val();
      var summary = $('#bulletin_summary_' + nameB).val();
      var name = $('#bulletin_name_' + nameB).val();
      newRelated[indexB]= {uri: uri, name: name, summary: summary};
    });
    data.relatedBulletins = newRelated;
      //console.log(data.relatedBulletins);
    // External links
    var orderLink = $(".fl-editor__external").sortable('toArray');
    $(orderLink).each(function(indexL, nameL){
      var link = $('#link__'+nameL).val();
      newLinks[indexL] = {url: link};
    });
    data.externalLinks = newLinks;

    //console.log(data);
    bulletinEditor(collectionName, data);
  }
}

