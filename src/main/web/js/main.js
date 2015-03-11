(function($) {

  //global vars
  var intIntervalTime = 100;
  var pageurl = window.location.href;
  var pageData;

  //calling external js functions - this should all get replaces with a bild script in production compiling one main.min.js;
  var files = [
  '_approve.js', 
  '_checkEditPageLocation.js', 
  '_enablePreview.js', 
  '_getPathName.js', 
  '_loadPageDataIntoEditor.js', 
  '_openFileForEditing.js', 
  '_publish.js', 
  '_removePreviewColClasses.js', 
  '_removeSubMenus.js', 
  '_save.js', 
  '_setupFlorence.js', 
  '_setupFlorenceWorkspace.js', 
  '_updateContent.js'];

  //inject functions into dom
  for (i = 0; i < files.length; i++) {
    javascript:document.body.appendChild(document.createElement('script')).src='http://localhost:8081/js/functions/'+files[i];
    console.log(files[i]);
  }

      // javascript:document.body.appendChild(document.createElement('script')).src='http://localhost:8081/js/functions/_setupFlorence.js';




  



  // possible new functions
  function convertPageJSONtoMarkdown(){}
  function saveUpdatedMarkdown(){}
  function watchForEditorChanges(){}

  

})(jQuery);
