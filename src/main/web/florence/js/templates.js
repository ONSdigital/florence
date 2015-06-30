(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['browseNode'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return " \n  <li data-url=\""
    + alias1(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n    <span class=\"page-item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n    <div class=\"page-options\">\n      <button class=\"btn-browse-edit\">Edit</button>\n      <button class=\"btn-browse-create\">Create</button>\n      <button class=\"btn-browse-delete\">Delete</button>\n    </div>\n      "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </li>\n";
},"2":function(depth0,helpers,partials,data) {
    return " page-item--directory";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return " page-item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n        <ul>\n          "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n        </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['chartBuilder'] = template({"1":function(depth0,helpers,partials,data) {
    return "              <option value=\"bar\">Bar Chart</option>\n              <option value=\"line\">Line Chart</option>\n              <option value=\"barline\">Bar + Line Chart</option>\n              <option value=\"rotated\">Bar Chart (rotated)</option>\n              <option value=\"table\">Table only</option>\n";
},"3":function(depth0,helpers,partials,data) {
    return "              <option value=\"false\">None</option>\n              <option value=\"top-right\">Top Right</option>\n              <option value=\"top-left\">Top Left</option>\n              <option value=\"bottom-right\">Bottom Right</option>\n              <option value=\"bottom-left\">Bottom Left</option>\n";
},"5":function(depth0,helpers,partials,data) {
    return "              <option value=\"0.56\">16:9</option>\n              <option value=\"0.75\">4:3</option>\n              <option value=\"0.42\">21:9</option>\n              <option value=\"1\">1:1</option>\n              <option value=\"1.3\">10:13</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"chart-builder overlay\">\n  <div class=\"chart-builder__inner\">\n    <!-- <h1>Chart Builder</h1> -->\n\n    <div id=\"edit-chart\" class=\"chart-builder__editor\">\n\n      <input type=\"text\" id=\"chart-title\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n      <input type=\"text\" id=\"chart-subtitle\" placeholder=\"[Subtitle]\" value=\""
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\"/>\n      <input type=\"text\" id=\"chart-unit\" placeholder=\"[Unit]\" value=\""
    + alias3(((helper = (helper = helpers.unit || (depth0 != null ? depth0.unit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"unit","hash":{},"data":data}) : helper)))
    + "\"/>\n      <input type=\"text\" id=\"chart-source\" placeholder=\"[Source]\" value=\""
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)))
    + "\"/>\n\n      <textarea id=\"chart-data\" placeholder=\"Paste your data here\" rows=\"4\" cols=\"120\"></textarea>\n      <br/>\n\n      <label>Alt Text <br>\n        <input type=\"text\" id=\"chart-alt-text\" placeholder=\"[Alt Text]\" value=\""
    + alias3(((helper = (helper = helpers.altText || (depth0 != null ? depth0.altText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"altText","hash":{},"data":data}) : helper)))
    + "\"/>\n      </label>\n\n      <label>Chart Type <br>\n        <select id=\"chart-type\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),{"name":"select","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n      <div id=\"barline\">\n\n      </div>\n\n      <label>Legend<br>\n        <select id=\"chart-legend\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.legend : depth0),{"name":"select","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n      <label>Aspect Ratio<br>\n        <select id=\"aspect-ratio\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.aspectRatio : depth0),{"name":"select","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n      <textarea id=\"chart-notes\" placeholder=\"Add chart notes here\" rows=\"4\" cols=\"120\">"
    + alias3(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"notes","hash":{},"data":data}) : helper)))
    + "</textarea>\n      <br/>\n\n    </div>\n\n    <div id=\"preview-chart\" class=\"chart-builder__preview\">\n\n    </div>\n\n    <div class=\"chart-builder__footer\">\n      <button class=\"btn-chart-builder-cancel\">Cancel</button>\n      <button class=\"btn-chart-builder-create\">Save Chart</button>\n    </div>\n\n  </div>\n\n\n  <div id=\"hiddenDiv\" style=\"display:none\">\n    <canvas id=\"hiddenCanvas\"></canvas>\n\n  </div>\n\n\n  <div id=\"hiddenSvgForDownload\"></div>\n  <canvas id=\"hiddenCanvasForDownload\"></canvas>\n\n</div>";
},"useData":true});
templates['chartBuilderPreview'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n</br>\n"
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\n\n<div id=\"chart\"></div>\n\n"
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)));
},"useData":true});
templates['chartEditBarlines'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "  <label>"
    + alias2(alias1((depth0 != null ? depth0.series : depth0), depth0))
    + "</label>\n  <select id=\"types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"col--5\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias3).call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"select","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </select>\n  <label for=\""
    + alias2(alias1((depth0 != null ? depth0.series : depth0), depth0))
    + "\">Bar stack</label>\n    <input id=\""
    + alias2(alias1((depth0 != null ? depth0.series : depth0), depth0))
    + "\" name=\"group_check\" value=\""
    + alias2(alias1((depth0 != null ? depth0.series : depth0), depth0))
    + "\" type=\"checkbox\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isChecked : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <br/>\n";
},"2":function(depth0,helpers,partials,data) {
    return "      <option value=\"bar\">Bar</option>\n      <option value=\"line\">Line</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return " checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['collectionDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Edit file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Move file</button>\n          <button class=\"btn-page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Review file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Move file</button>\n          <button class=\"btn-page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<div class=\"section-head\">\n  <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n  <p>Publish: "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n<div class=\"section-content\">\n  <h3 id=\"in-progress-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.inProgress : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages in progress</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.inProgress : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  <h3 id=\"complete-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.complete : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting review</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.complete : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  <h3 id=\"reviewed-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.reviewed : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting approval</h3>\n  <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.reviewed : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-edit-cancel\">Cancel</button>\n  <button class=\"btn-collection-work-on\">Work on collection</button>\n  <button class=\"btn-collection-approve\">Approve collection</button>\n</nav>\n";
},"useData":true});
templates['collectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <tr data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n        <td headers=\"collection-name\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n        <td headers=\"collection-date\" class=\"collection-date\">"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 collection-select\">\n  <h1 class=\"text-align-center\">Select a collection</h1>\n  <table class=\"collections-select-table\">\n    <thead>\n      <tr>\n        <th id=\"collection-name\" scope=\"col\">Collection name</th>\n        <th id=\"collection-date\" scope=\"col\">Collection date</th>\n      </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 collection-create\">\n  <h1 class=\"text-align-center\">Create a collection</h1>\n  <form method=\"post\" action=\"\" class=\"form-create-collection\">\n    <label for=\"collectionname\" class=\"hidden\">Scheduled publish</label>\n    <input id=\"collectionname\" type=\"text\" placeholder=\"Collection name\" />\n    <label for=\"team\" class=\"hidden\">Select the team the collection can be previewed by</label>\n    <select id=\"team\">\n      <option selected disabled=\"disabled\">Select the team the collection can be previewed by</option>\n      <option value=\"Team1\">Team 1</option>\n      <option value=\"Team2\">Team 2</option>\n      <option value=\"Team3\">Team 3</option>\n    </select>\n    <input type=\"radio\" id=\"scheduledpublish\" name=\"publishtype\" value=\"scheduled\" checked><label for=\"scheduledpublish\">Scheduled publish</label>\n    <input type=\"radio\" id=\"manualpublish\" name=\"publishtype\" value=\"manual\" required><label for=\"manualpublish\">Manual publish</label>\n    <br>\n    <div class=\"block text-center\">\n      <label for=\"date\" class=\"hidden\">Date</label>\n      <input id=\"date\" type=\"text\" placeholder=\"dd/mm/yyyy\"/>\n      <br>\n      <label for=\"time\" class=\"hidden\">Time</label>\n      <select id=\"time\" class=\"small\">\n        <option value=\"34200000\">09:30</option>\n      </select>\n    </div>\n    <button class=\"btn-collection-create\">Create collection</button>\n  </form>\n</section>\n<section class=\"panel col col--6 collection-selected\">\n\n</section>";
},"useData":true});
templates['editNav'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn-edit-save-and-submit-for-approval\" >Save and submit for approval</button>\n";
},"3":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn-edit-save-and-submit-for-review\">Save and submit for review</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!--<button class=\"btn-edit-cancel\">Cancel</button>-->\n<button class=\"btn-edit-save\">Save</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPageComplete : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editNavCompendium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<!--<button class=\"btn-edit-cancel\">Cancel</button>-->\n<button class=\"btn-edit-save\">Save</button>\n<button class=\"btn-edit-save-and-submit-for-approval\" >Save and exit</button>\n";
},"useData":true});
templates['florence'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wrapper\">\n  <nav class=\"admin-nav\">\n  </nav>\n  <div class=\"section\">\n  </div>\n</div>";
},"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"col--4 login-wrapper\">\n  <h1>Login</h1>\n\n  <form method=\"post\" action=\"\" class=\"form-login\">\n    <label for=\"email\">Email:</label><input id=\"email\" type=\"email\" value=\"p1@t.com\" class=\"fl-user-and-access__email\"\n                                            name=\"fl-editor__headline\"\n                                            cols=\"40\" rows=\"1\"/>\n    <label for=\"password\">Password:</label><input id=\"password\" type=\"password\" value=\"Doug4l\"\n                                                  class=\"fl-user-and-access__password\"\n                                                  name=\"fl-editor__headline\" cols=\"40\" rows=\"1\"/>\n    <button type=\"submit\" id=\"login\" class=\"btn-florence-login fl-panel--user-and-access__login \">Log in</button>\n  </form>\n</div>";
},"useData":true});
templates['mainNav'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "          <li class=\"nav--admin__item--collection selected\">Working on: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1), depth0))
    + "</li>\n";
},"4":function(depth0,helpers,partials,data) {
    return "selected";
},"6":function(depth0,helpers,partials,data) {
    return "      <li class=\"nav--admin__item nav--admin__item--logout\"><a href=\"#\">Logout</a></li>\n";
},"8":function(depth0,helpers,partials,data) {
    return "      <li class=\"nav--admin__item nav--admin__item--login selected\"><a href=\"#\">Login</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"nav nav--admin\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  <li class=\"nav--admin__item nav--admin__item--collections "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n    <a href=\"#\">Collections</a></li>\n  <li class=\"nav--admin__item nav--admin__item--users\"><a href=\"#\">Users and access</a></li>\n  <li class=\"nav--admin__item nav--admin__item--publish\"><a href=\"#\">Publishing queue</a></li>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});
templates['markdownEditor'] = template({"1":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0));
},"3":function(depth0,helpers,partials,data) {
    return "Content Editor";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"markdown-editor\">\n  <div class=\"markdown-editor__header\">\n    <h1>"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</h1>\n\n    <div class=\"custom-markdown-buttons\">\n      <button class=\"btn-markdown-editor-chart\" title=\"Build Chart\"></button>\n      <button class=\"btn-markdown-editor-table\" title=\"Build Table\"></button>\n    </div>\n    <div id=\"wmd-button-bar\"></div>\n  </div>\n  <div class=\"markdown-editor__content\">\n    <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n    <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n      <h2>Markdown:</h2>\n      <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.markdown : depth0), depth0))
    + "</textarea>\n\n      <div class=\"markdown-editor-line-numbers\"></div>\n    </div>\n  </div>\n  <div class=\"markdown-editor__footer\">\n    <button class=\"btn-markdown-editor-cancel\">Cancel</button>\n    <button class=\"btn-markdown-editor-save\">Save changes</button>\n    <button class=\"btn-markdown-editor-exit\">Save changes and exit</button>\n  </div>\n</div>";
},"useData":true});
templates['markdownEditorNoTitle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"markdown-editor\">\n  <div class=\"markdown-editor__header\">\n    <h1>Content editor</h1>\n    <div class=\"custom-markdown-buttons\">\n      <button class=\"btn-markdown-editor-chart\" title=\"Build Chart\"></button>\n      <button class=\"btn-markdown-editor-table\" title=\"Build Table\"></button>\n    </div>\n    <div id=\"wmd-button-bar\"></div>\n  </div>\n  <div class=\"markdown-editor__content\">\n    <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n    <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n      <h2>Markdown:</h2>\n      <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</textarea>\n      <div class=\"markdown-editor-line-numbers\"></div>\n    </div>\n  </div>\n  <div class=\"markdown-editor__footer\">\n    <button class=\"btn-markdown-editor-cancel\">Cancel</button>\n    <button class=\"btn-markdown-editor-save\">Save changes</button>\n    <button class=\"btn-markdown-editor-exit\">Save changes and exit</button>\n  </div>\n</div>";
},"useData":true});
templates['publishDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div class=\"collections-accordion\">\n    <div class=\"collections-section\">\n      <div class=\"collections-section__head\">\n        <h3 class=\"collection-name\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\n      </div>\n      <div class=\"collections-section__content\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageType : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <button class=\"btn-collection-unlock\">Unlock collection</button>\n        <h4>Approved pages in this collection</h4>\n        <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pageDetails : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n    </div>\n  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "          <button class=\"btn-collection-publish\">Publish collection</button>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <li><span class=\"page-item page-item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n            <div class=\"page-options\">\n              <button class=\"btn-page-delete\">Remove from this publish</button>\n            </div>\n          </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"section-head\">\n  <h2>"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</h2>\n  <p>"
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "</p>\n</div>\n\n<div class=\"section-content section-content--fullwidth\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.collectionDetails : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n<nav class=\"section-nav\">\n  <button class=\"btn-edit-cancel\">Cancel</button>\n</nav>\n";
},"useData":true});
templates['publishList'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "    <tr data-collections=\""
    + alias2(alias1((depth0 != null ? depth0.ids : depth0), depth0))
    + "\">\n      <td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n    </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel col col--6 publish-select\">\n  <h1 class=\"text-align-center\">Select a publish date</h1>\n  <table class=\"publish-select-table\">\n    <thead>\n    <tr>\n      <th id=\"publish-name\" scope=\"col\">Publish date</th>\n    </tr>\n    </thead>\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 publish-selected\">\n\n</section>";
},"useData":true});
templates['tableBuilder'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"table-builder overlay\">\n  <div class=\"table-builder__inner\">\n\n    <div id=\"edit-table\" class=\"table-builder__editor\">\n      <form id=\"upload-table-form\">\n        <input type=\"text\" id=\"table-title\" placeholder=\"[Title]\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"file\" name=\"files\" id=\"files\">\n        <input type=\"submit\" value=\"Submit\">\n      </form>\n    </div>\n\n    <div id=\"preview-table\" class=\"table-builder__preview\">\n      <div id=\"table\"></div>\n    </div>\n\n    <div class=\"table-builder__footer\">\n      <button class=\"btn-table-builder-cancel\">Cancel</button>\n      <button class=\"btn-table-builder-create\">Save Table</button>\n    </div>\n\n  </div>\n</div>";
},"useData":true});
templates['workBrowse'] = template({"1":function(depth0,helpers,partials,data) {
    return " page-item--directory";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return " page-item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                <ul>\n                    "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<section class=\"panel workspace-browse\">\n  <nav class=\"tree-nav-holder\">\n    <ul class=\"page-list page-list--tree\">\n          <li data-url=\""
    + alias1(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n            <span class=\"page-item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n            <div class=\"page-options\">\n              <button class=\"btn-browse-edit\">Edit</button>\n              <button class=\"btn-browse-create\">Create</button>\n              <button class=\"btn-browse-delete\">Delete</button>\n            </div>\n            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </li>\n    </ul>\n  </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workCreate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section class=\"panel workspace-create\">\n  <h1>New page details</h1>\n  <form>\n    <label for=\"pagetype\" class=\"hidden\">Page type</label>\n    <select id=\"pagetype\" class=\"selectbg\" required>\n      <option value=\"\" name=\"\">Select your option</option>\n      <option value=\"bulletin\" name=\"bulletin\">Bulletin</option>\n      <option value=\"article\" name=\"article\">Article</option>\n      <option value=\"dataset\" name=\"dataset\">Dataset</option>\n      <option value=\"compendium-landing-page\" name=\"compendium\">Compendium</option>\n      <option value=\"static_landing_page\" name=\"static_landing_page\">Static landing page</option>\n      <option value=\"static_page\" name=\"static_page\">Generic static page</option>\n      <option value=\"static_article\" name=\"static_article\">Static article</option>\n      <option value=\"static_qmi\" name=\"qmi\">QMI</option>\n      <option value=\"static_foi\" name=\"foi\">FOI</option>\n      <option value=\"static_adhoc\" name=\"adhoc\">Ad hoc</option>\n    </select>\n    <input id=\"location\" type=\"text\" style=\"display: none;\"/>\n    <div class=\"edition\"></div>\n    <label for=\"pagename\" class=\"hidden\">Page name</label>\n    <input id=\"pagename\" class=\"full\" type=\"text\" placeholder=\"Page name\" />\n    <button class=\"btn-page-create\">Create page</button>\n  </form>\n</section>\n";
},"useData":true});
templates['workEditCharts'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\"chart_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n            <button class=\"btn-markdown-edit\" id=\"chart-edit_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\"chart-delete_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"charts\">\n  <div class=\"edit-section__head\">\n    <h1>Charts</h1>\n\n    <p>Edit existing charts</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"chart-list\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.charts : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});
templates['workEditT1'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <p id=\"item-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.statistics : depth0)) != null ? stack1.data : stack1)) != null ? stack1.description : stack1)) != null ? stack1.title : stack1), depth0))
    + "</p>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"keywords\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"sections\">\n      <div class=\"edit-section__head\">\n        <h1>Statistical highlights</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT2'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT3'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <p id=\"timeseries-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.description : stack1)) != null ? stack1.title : stack1), depth0))
    + "</p>\n              <button class=\"btn-page-delete\" id=\"timeseries-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <p id=\"bulletins-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n              <button class=\"btn-page-delete\" id=\"bulletins-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <p id=\"articles-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n              <button class=\"btn-page-delete\" id=\"articles-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <p id=\"datasets-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n              <button class=\"btn-page-delete\" id=\"datasets-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"timeseries\">\n      <div class=\"edit-section__head\">\n        <h1>Time series related to "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-timeseries\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTimeseries\">Add timeseries</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"bulletins\">\n      <div class=\"edit-section__head\">\n        <h1>Bulletins related to "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-bulletins\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.statsBulletins : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addBulletins\">Add bulletins</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"articles\">\n      <div class=\"edit-section__head\">\n        <h1>Articles related to "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-articles\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedArticles : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addArticles\">Add articles</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"datasets\">\n      <div class=\"edit-section__head\">\n        <h1>Datasets related to "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-datasets\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.datasets : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDatasets\">Add datasets</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Article'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"tab-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"tab-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"tab-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"tab-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"article-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"article-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"link-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Title\">"
    + alias3(((helper = (helper = helpers.linkText || (depth0 != null ? depth0.linkText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkText","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea id=\"link-url_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Paste link here and save\">"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"link-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"data-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.xls || (depth0 != null ? depth0.xls : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xls","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1['abstract'] : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Main sections | Title | Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"collapsible\">\n      <div class=\"edit-section__head\">\n        <h1>Collapsible sections</h1>\n        <p>Background notes | References | Footnotes</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-tabs\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.accordion : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTab\">Add collapsible section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relArticle\">\n      <div class=\"edit-section__head\">\n        <h1>Related articles</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedArticles : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addArticle\">Add article</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"extLink\">\n      <div class=\"edit-section__head\">\n        <h1>External links</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-external\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.externalLinks : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addLink\">Add external link</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relData\">\n      <div class=\"edit-section__head\">\n        <h1>Related data</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related-data\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedData : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addData\">Add related data</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Bulletin'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"tab-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"tab-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"tab-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"tab-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"bulletin-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"bulletin-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"link-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Title\">"
    + alias3(((helper = (helper = helpers.linkText || (depth0 != null ? depth0.linkText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkText","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea id=\"link-url_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Paste link here and save\">"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"link-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"data-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n            <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"headline1-p\">\n            <label for=\"headline1\">Headline 1\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline1\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline1 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline2-p\">\n            <label for=\"headline2\">Headline 2\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline2\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline2 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline3-p\">\n            <label for=\"headline3\">Headline 3\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline3\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline3 : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Main sections | Title | Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"collapsible\">\n      <div class=\"edit-section__head\">\n        <h1>Collapsible sections</h1>\n        <p>Background notes | References | Footnotes</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-tabs\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.accordion : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTab\">Add collapsible section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relBulletin\">\n      <div class=\"edit-section__head\">\n        <h1>Related bulletins</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedBulletins : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addBulletin\">Add bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"extLink\">\n      <div class=\"edit-section__head\">\n        <h1>External links</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-external\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.externalLinks : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addLink\">Add external link</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relData\">\n      <div class=\"edit-section__head\">\n        <h1>Related data</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related-data\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedData : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addData\">Add related data</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Compendium'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"tab-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"tab-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"tab-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"tab-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"article-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"article-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"link-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Title\">"
    + alias3(((helper = (helper = helpers.linkText || (depth0 != null ? depth0.linkText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkText","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea id=\"link-url_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Paste link here and save\">"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"link-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"data-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.xls || (depth0 != null ? depth0.xls : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xls","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1['abstract'] : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Main sections | Title | Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"collapsible\">\n      <div class=\"edit-section__head\">\n        <h1>Collapsible sections</h1>\n        <p>Background notes | References | Footnotes</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-tabs\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.accordion : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTab\">Add collapsible section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relArticle\">\n      <div class=\"edit-section__head\">\n        <h1>Related articles</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedArticles : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addArticle\">Add article</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"extLink\">\n      <div class=\"edit-section__head\">\n        <h1>External links</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-external\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.externalLinks : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addLink\">Add external link</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relData\">\n      <div class=\"edit-section__head\">\n        <h1>Related data</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related-data\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedData : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addData\">Add related data</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavCompendium,depth0,{"name":"editNavCompendium","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Methodology'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"bulletin-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"bulletin-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"data-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.xls || (depth0 != null ? depth0.xls : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xls","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-m\">Title | Contact | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Main sections | Title | Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relBulletin\">\n      <div class=\"edit-section__head\">\n        <h1>Related bulletins</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedBulletins : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addBulletin\">Add bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relData\">\n      <div class=\"edit-section__head\">\n        <h1>Related data</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related-data\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedData : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addData\">Add related data</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT5'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <!--<textarea id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>-->\n              <textarea id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(this.lambda(depth0, depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <!--<textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>-->\n              <textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(this.lambda(depth0, depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"note-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"note-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"document-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"document-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"timeseries-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"timeseries-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"dataset-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"methodology-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"methodology-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Next release | Key note | Unit | NS | Source</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <!--<div class=\"edition\">-->\n            <!--<label for=\"edition\">Edition-->\n              <!--<textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>-->\n            <!--</label>-->\n          <!--</div>-->\n          <!--<div class=\"release-date\">-->\n            <!--<label for=\"releaseDate\">Release date-->\n              <!--<input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>-->\n              <!--&lt;!&ndash;<textarea class=\"auto-size\" type=\"text\" id=\"releaseDate\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "</textarea>&ndash;&gt;-->\n            <!--</label>-->\n          <!--</div>-->\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"number\">Number\n              <textarea class=\"auto-size\" type=\"text\" id=\"number\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.number : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keyNote\">Key note\n              <textarea class=\"auto-size\" type=\"text\" id=\"keyNote\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keyNote : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <!--<div id=\"migrated\">-->\n            <!--<label for=\"migrated\">Migrated </label>-->\n            <!--<input type=\"checkbox\" name=\"migrated\" value=\"false\" />-->\n          <!--</div>-->\n          <div>\n            <label for=\"unit\">Unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"unit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.unit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"preUnit\">Pre unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"preUnit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.preUnit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"source\">Source\n              <textarea class=\"auto-size\" type=\"text\" id=\"source\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.source : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Section</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.section : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"note\">\n      <div class=\"edit-section__head\">\n        <h1>Notes</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-notes\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addNote\">Add note</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDocument\">\n      <div class=\"edit-section__head\">\n        <h1>Related bulletins and articles</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-document\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedDocuments : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDocument\">Add bulletin or article</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relTimeseries\">\n      <div class=\"edit-section__head\">\n        <h1>Related time series</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-timeseries\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedData : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTimeseries\">Add time series</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDataset\">\n      <div class=\"edit-section__head\">\n        <h1>Related datasets</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-dataset\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedDatasets : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDataset\">Add dataset</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relMethodology\">\n      <div class=\"edit-section__head\">\n        <h1>Related methodology</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-methodology\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedMethodology : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-methodology\" id=\"addMethodology\">Add methodology</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT6'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea class=\"auto-size\" id=\"chapter-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"chapter-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"chapter-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add content\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"dataset-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"methodology-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"methodology-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n              <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1['abstract'] : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"chapter\">\n      <div class=\"edit-section__head\">\n        <h1>Chapters</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-chapters\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.chapters : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-chapter\" id=\"addChapter\">Add chapter</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDataset\">\n      <div class=\"edit-section__head\">\n        <h1>Compendium datasets</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-dataset\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.compendiumData : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDataset\">Add dataset</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relMethodology\">\n      <div class=\"edit-section__head\">\n        <h1>Related methodology</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-methodology\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedMethodology : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-methodology\" id=\"addMethodology\">Add methodology</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT7'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"content-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Click edit to add content\">"
    + alias3(this.lambda(depth0, depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"content-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"content-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-s\">Title | Summary | Keywords</p>\n        <p id=\"metadata-q\">Title | Contact | Survey | Frequency | Compilation | Coverage | Size | Revised | Keywords</p>\n        <p id=\"metadata-f\">Title | Release date | Keywords</p>\n        <p id=\"metadata-ad\">Title | Release date | Reference | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"contact-p\">\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n            <label for=\"contactPhone\">Contact phone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"survey-p\">\n            <label for=\"survey\">Survey name\n              <textarea class=\"auto-size\" type=\"text\" id=\"survey\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.surveyName : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"frequency-p\">\n            <label for=\"frequency\">Frequency\n              <textarea class=\"auto-size\" type=\"text\" id=\"frequency\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.frequency : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"compilation-p\">\n            <label for=\"compilation\">Compilation\n              <textarea class=\"auto-size\" type=\"text\" id=\"compilation\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.compilation : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"geoCoverage-p\">\n            <label for=\"geoCoverage\">Geographic coverage\n              <textarea class=\"auto-size\" type=\"text\" id=\"geoCoverage\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.geoCoverage : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"sampleSize-p\">\n            <label for=\"sampleSize\">Sample size\n              <textarea class=\"auto-size\" type=\"text\" id=\"sampleSize\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.sampleSize : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"lastRevised-p\">\n            <label for=\"lastRevised\">Last revised\n              <textarea class=\"auto-size\" type=\"text\" id=\"lastRevised\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.lastRevised : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div id=\"reference-p\">\n            <label for=\"reference\">Reference\n              <textarea class=\"auto-size\" type=\"text\" id=\"reference\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.reference : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-content\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.markdown : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addContent\">Add content</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\"></div>\n\n    <div id=\"tables\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT7Landing'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea class=\"auto-size\" id=\"section-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type link here and click edit to add content\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"section-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p>Title | Summary | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Sections</h1>\n        <p> Title | summary</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <!--<textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>-->\n              <textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(this.lambda(depth0, depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"note-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"note-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"dataset-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"used-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"used-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"methodology-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"methodology-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.xls || (depth0 != null ? depth0.xls : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xls","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"migrated\">\n            <label for=\"migrated\">Migrated </label>\n            <input type=\"checkbox\" name=\"migrated\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"note\">\n      <div class=\"edit-section__head\">\n        <h1>Note</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-notes\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.section : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addNote\">Add note</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDataset\">\n      <div class=\"edit-section__head\">\n        <h1>Related datasets</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedDatasets : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDataset\">Add dataset</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"used\">\n      <div class=\"edit-section__head\">\n        <h1>Related documents</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-used\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usedIn : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-used\" id=\"addUsed\">Add article or bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relMethodology\">\n      <div class=\"edit-section__head\">\n        <h1>Related methodology</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-methodology\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedMethodology : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-methodology\" id=\"addMethodology\">Add methodology</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8Compendium'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <!--<textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>-->\n              <textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type or click edit to add content\">"
    + alias3(this.lambda(depth0, depth0))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"note-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"note-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"dataset-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"used-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"used-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n              <textarea id=\"methodology-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"methodology-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"download-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and save to add content\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"download-filename_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.xls || (depth0 != null ? depth0.xls : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xls","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n            <p>Text: <textarea class=\"auto-size\" type=\"text\" id=\"correction_text_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" cols=\"65\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias3(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"text","hash":{},"data":data}) : helper)))
    + "</textarea></p>\n            <p>Date: <input class=\"auto-size\" type=\"date\" id=\"correction_date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\"/></p>\n            <p>Type: <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"minor\"/><label> Minor</label>\n              <input type=\"radio\" name=\"correctionType"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" value=\"major\"/><label> Major</label>\n            </p>\n            <button class=\"btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"edition\">\n            <label for=\"edition\">Edition\n              <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"release-date\">\n            <label for=\"releaseDate\">Release date\n              <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"migrated\">\n            <label for=\"migrated\">Migrated </label>\n            <input type=\"checkbox\" name=\"migrated\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"note\">\n      <div class=\"edit-section__head\">\n        <h1>Note</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-notes\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.section : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addNote\">Add note</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDataset\">\n      <div class=\"edit-section__head\">\n        <h1>Related datasets</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedDatasets : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDataset\">Add dataset</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"used\">\n      <div class=\"edit-section__head\">\n        <h1>Related documents</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-used\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usedIn : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-used\" id=\"addUsed\">Add article or bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relMethodology\">\n      <div class=\"edit-section__head\">\n        <h1>Related methodology</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-methodology\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedMethodology : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-methodology\" id=\"addMethodology\">Add methodology</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.downloads : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavCompendium,depth0,{"name":"editNavCompendium","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditTables'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <div id=\"table_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n            <button class=\"btn-markdown-edit\" id=\"table-edit_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn-page-delete\" id=\"table-delete_"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"tables\">\n  <div class=\"edit-section__head\">\n    <h1>Tables</h1>\n\n    <p>Edit existing tables</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"table-list\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tables : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});
templates['workSpace'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<nav class=\"panel col col--1 workspace-nav\">\n  <ul class=\"nav nav--workspace\">\n    <li class=\"nav--workspace__browse selected\" id=\"browse\"><a href=\"#\">Browse</a></li>\n    <li class=\"nav--workspace__create\" id=\"create\"><a href=\"#\">Create</a></li>\n    <li class=\"nav--workspace__edit\" id=\"edit\"><a href=\"#\">Edit</a></li>\n  </ul>\n</nav>\n<div class=\"col col--4 workspace-menu\">\n\n</div>\n<section class=\"panel col col--7 workspace-browser\">\n  <div class=\"browser\">\n    <div class=\"addressbar\">\n      <button class=\"browser-btn-back\">&lt;</button>\n      <button class=\"browser-btn-forward\">&gt;</button>\n      <label for=\"browser-location\" class=\"browser-location-label\">Preview URL</label><input id=\"browser-location\" class=\"browser-location\" type=\"text\" value=\"\">\n      <button class=\"browser-btn-mobile\">Mobile</button>\n    </div>\n    <iframe id=\"iframe\" src=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></iframe>\n  </div>\n</section>\n";
},"useData":true});
})();