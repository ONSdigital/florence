(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['browseNode'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return " \n  <li data-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n    <span class=\"page-item\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n    <div class=\"page-options\">\n      <button class=\"btn-browse-edit\">Edit</button>\n      <button class=\"btn-browse-create\">Create</button>\n      <button class=\"btn-browse-delete\">Delete</button>\n    </div>\n    "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </li>\n";
},"2":function(depth0,helpers,partials,data) {
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
    return "              <option value=\"0.75\">4:3</option>\n              <option value=\"0.42\">21:9</option>\n              <option value=\"0.56\">16:9</option>\n              <option value=\"1\">1:1</option>\n              <option value=\"1.3\">10:13</option>\n";
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
    + "\"/>\n\n      <textarea id=\"chart-data\" placeholder=\"Paste your data here\" rows=\"4\" cols=\"120\"></textarea>\n      <br/>\n      <label>Chart Type <br>\n        <select id=\"chart-type\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"select","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n      <div id=\"barline\">\n\n      </div>\n\n      <label>Legend<br>\n        <select id=\"chart-legend\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.legend : depth0),{"name":"select","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n      <label>Aspect Ratio<br>\n        <select id=\"aspect-ratio\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.aspectRatio : depth0),{"name":"select","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n      </label>\n\n    </div>\n\n    <div id=\"preview-chart\" class=\"chart-builder__preview\">\n      <div id=\"chart\"></div>\n    </div>\n\n\n    <div id=\"hiddenDiv\" style=\"display:none\">\n      <canvas id=\"hiddenCanvas\"></canvas>\n      <a id=\"hiddenPng\"/>\n    </div>\n\n    <div class=\"chart-builder__footer\">\n      <button class=\"btn-chart-builder-cancel\">Cancel</button>\n      <button class=\"btn-chart-builder-create\">Save Chart</button>\n    </div>\n\n  </div>\n</div>";
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
templates['chartTable'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<table>\n  <tbody>\n    <tr>\n      <th></th>\n    </tr>\n    <tr class=\"row\">\n      <td></td>\n    </tr>\n  </tbody>\n</table>";
},"useData":true});
templates['collectionDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li><span class=\"page-item page-type-"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Edit file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Move file</button>\n          <button class=\"btn-page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li><span class=\"page-item\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Review file</button>\n          <button class=\"btn-page-move\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Move file</button>\n          <button class=\"btn-page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n        </div>\n      </li>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li><span class=\"page-item\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n        <div class=\"page-options\">\n          <button class=\"btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">Edit file</button>\n          <button class=\"btn-page-move\" data-path=\""
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
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.reviewed : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
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
    + "    </tbody>\n  </table>\n</section>\n<section class=\"panel col col--6 collection-create\">\n  <h1 class=\"text-align-center\">Create a collection</h1>\n  <form method=\"post\" action=\"\" class=\"form-create-collection\">\n    <label for=\"collectionname\" class=\"hidden\">Scheduled publish</label>\n    <input id=\"collectionname\" type=\"text\" placeholder=\"Collection name\" />\n    <label for=\"team\" class=\"hidden\">Select the team the collection can be previewed by</label>\n    <select id=\"team\">\n      <option selected disabled=\"disabled\">Select the team the collection can be previewed by</option>\n      <option value=\"Team1\">Team 1</option>\n      <option value=\"Team2\">Team 2</option>\n      <option value=\"Team3\">Team 3</option>\n    </select>\n    <input type=\"radio\" id=\"scheduledpublish\" name=\"publishtype\" value=\"scheduled\"><label for=\"scheduledpublish\">Scheduled publish</label>\n    <input type=\"radio\" id=\"manualpublish\" name=\"publishtype\" value=\"manual\"><label for=\"manualpublish\">Manual publish</label>\n    <br>\n    <div class=\"block text-center\">\n      <label for=\"day\" class=\"hidden\">Day</label>\n      <select id=\"day\" class=\"small\">\n        <option selected disabled>Day</option>\n        <option value=\"1\">1</option>\n        <option value=\"2\">2</option>\n        <option value=\"3\">3</option>\n        <option value=\"4\">4</option>\n        <option value=\"5\">5</option>\n        <option value=\"6\">6</option>\n        <option value=\"7\">7</option>\n        <option value=\"8\">8</option>\n        <option value=\"9\">9</option>\n        <option value=\"10\">10</option>\n        <option value=\"11\">11</option>\n        <option value=\"12\">12</option>\n        <option value=\"13\">13</option>\n        <option value=\"14\">14</option>\n        <option value=\"15\">15</option>\n        <option value=\"16\">16</option>\n        <option value=\"17\">17</option>\n        <option value=\"18\">18</option>\n        <option value=\"19\">19</option>\n        <option value=\"20\">20</option>\n        <option value=\"21\">21</option>\n        <option value=\"22\">22</option>\n        <option value=\"23\">23</option>\n        <option value=\"24\">24</option>\n        <option value=\"25\">25</option>\n        <option value=\"26\">26</option>\n        <option value=\"27\">27</option>\n        <option value=\"28\">28</option>\n        <option value=\"29\">29</option>\n        <option value=\"30\">30</option>\n        <option value=\"31\">31</option>\n      </select>\n      <label for=\"month\" class=\"hidden\">Month</label>\n      <select id=\"month\" class=\"small\">\n        <option selected disabled>Month</option>\n        <option value=\"0\">January</option>\n        <option value=\"1\">February</option>\n        <option value=\"2\">March</option>\n        <option value=\"3\">April</option>\n        <option value=\"4\">May</option>\n        <option value=\"5\">June</option>\n        <option value=\"6\">July</option>\n        <option value=\"7\">August</option>\n        <option value=\"8\">September</option>\n        <option value=\"9\">October</option>\n        <option value=\"10\">November</option>\n        <option value=\"11\">December</option>\n      </select>\n      <label for=\"year\" class=\"hidden\">Year</label>\n      <select id=\"year\" class=\"small\">\n        <option selected value=\"2015\">2015</option>\n        <option value=\"2016\">2016</option>\n        <option value=\"2017\">2017</option>\n      </select>\n      <br>\n      <label for=\"time\" class=\"hidden\">Time</label>\n      <select id=\"time\" class=\"small\">\n        <option value=\"0930\">09:30</option>\n      </select>\n    </div>\n    <button class=\"btn-collection-create\">Create collection</button>\n  </form>\n</section>\n<section class=\"panel col col--6 collection-selected\">\n\n</section>";
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
templates['markdownEditor'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"markdown-editor\">\n    <div class=\"markdown-editor__header\">\n        <h1>"
    + alias2(alias1((depth0 != null ? depth0.title : depth0), depth0))
    + "</h1>\n        <div class=\"custom-markdown-buttons\">\n            <button class=\"btn-markdown-editor-chart\" title=\"Build Chart\"></button>\n        </div>\n        <div id=\"wmd-button-bar\"></div>\n    </div>\n    <div class=\"markdown-editor__content\">\n        <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n        <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n            <h2>Markdown:</h2>\n            <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + alias2(alias1((depth0 != null ? depth0.markdown : depth0), depth0))
    + "</textarea>\n            <div class=\"markdown-editor-line-numbers\"></div>\n        </div>\n    </div>\n    <div class=\"markdown-editor__footer\">\n        <button class=\"btn-markdown-editor-cancel\">Cancel</button>\n        <button class=\"btn-markdown-editor-save\">Save changes</button>\n        <button class=\"btn-markdown-editor-exit\">Save changes and exit</button>\n    </div>\n</div>";
},"useData":true});
templates['publishDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div class=\"collections-accordion\">\n    <div class=\"collections-section\">\n      <div class=\"collections-section__head\">\n        <h3 class=\"collection-name\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\n      </div>\n      <div class=\"collections-section__content\">\n        <button class=\"btn-collection-unlock\">Unlock collection</button>\n        <h4>Approved pages in this collection</h4>\n        <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pageDetails : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n      </div>\n    </div>\n  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <li><span class=\"page-item page-type-"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
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
templates['workBrowse'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                <ul>\n                    "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<section class=\"panel workspace-browse\">\n  <nav class=\"tree-nav-holder\">\n    <ul class=\"page-list page-list--tree\">\n          <li data-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n            <span class=\"page-item\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n            <div class=\"page-options\">\n              <button class=\"btn-browse-edit\">Edit</button>\n              <button class=\"btn-browse-create\">Create</button>\n              <button class=\"btn-browse-delete\">Delete</button>\n            </div>\n              "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </li>\n    </ul>\n  </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workCreate'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section class=\"panel workspace-create\">\n  <h1>New page details</h1>\n  <form>\n    <label for=\"location\" class=\"\">Location</label>\n    <input id=\"location\" type=\"text\" />\n    <label for=\"pagetype\" class=\"\">Page type</label>\n    <select id=\"pagetype\" class=\"selectbg\" required>\n      <option value=\"\" name=\"\">Select your option</option>\n      <option value=\"bulletin\" name=\"bulletin\">Bulletin</option>\n      <option value=\"article\" name=\"article\">Article</option>\n      <option value=\"dataset\" name=\"dataset\">Dataset</option>\n      <option value=\"methodology\" name=\"methodology\">Methodology</option>\n      <option value=\"static\" name=\"static\">Static</option>\n      <option value=\"qmi\" name=\"qmi\">QMI</option>\n      <option value=\"foi\" name=\"foi\">FOI</option>\n      <option value=\"adHoc\" name=\"adHoc\">Ad hoc</option>\n    </select>\n    <label for=\"pagename\" class=\"hidden\">Page type</label>\n    <input id=\"pagename\" class=\"full\" type=\"text\" placeholder=\"Page name\" />\n    <!--Button will be added here-->\n  </form>\n</section>\n";
},"useData":true});
templates['workEdit'] = template({"1":function(depth0,helpers,partials,data) {
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
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"note-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Click edit to add content\">"
    + alias3(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-markdown-edit\" id=\"note-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn-page-delete\" id=\"note-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"5":function(depth0,helpers,partials,data) {
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
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"bulletin-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"bulletin-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"bulletin-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"bulletin-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"article-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"article-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"article-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"article-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"11":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"dataset-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"dataset-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"dataset-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"link-url_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea id=\"link-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Paste link here and save\">"
    + alias3(((helper = (helper = helpers.linkText || (depth0 != null ? depth0.linkText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"linkText","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"link-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"15":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea id=\"dataset-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"used-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"used-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn-page-delete\" id=\"used-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"17":function(depth0,helpers,partials,data) {
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
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <div id=\"download-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n              <button class=\"btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n            </div>\n";
},"19":function(depth0,helpers,partials,data) {
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

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n        <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n        <p id=\"metadata-d\">Title | Next release | Contact | Description | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"name\">Title\n            <textarea class=\"auto-size\" type=\"text\" id=\"name\">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n            <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
    + alias2(alias1((depth0 != null ? depth0.nextRelease : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactName\">Contact name\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactName\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactEmail\">Contact email\n            <textarea class=\"auto-size\" type=\"text\" id=\"contactEmail\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"contactPhone\">Contact phone\n              <textarea class=\"auto-size\" type=\"text\" id=\"contactPhone\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.contact : depth0)) != null ? stack1.phone : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1((depth0 != null ? depth0.summary : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"abstract-p\">\n            <label for=\"abstract\">Abstract\n            <textarea class=\"auto-size\" type=\"text\" id=\"abstract\">"
    + alias2(alias1((depth0 != null ? depth0['abstract'] : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat\">National statistic </label>\n            <input type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div id=\"migrated\">\n            <label for=\"migrated\">Migrated </label>\n            <input type=\"checkbox\" name=\"migrated\" value=\"false\" />\n          </div>\n          <div id=\"headline1-p\">\n            <label for=\"headline1\">Headline 1\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline1\" cols=\"40\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias2(alias1((depth0 != null ? depth0.headline1 : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline2-p\">\n            <label for=\"headline2\">Headline 2\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline2\" cols=\"40\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias2(alias1((depth0 != null ? depth0.headline2 : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"headline3-p\">\n            <label for=\"headline3\">Headline 3\n            <textarea class=\"auto-size\" type=\"text\" id=\"headline3\" cols=\"40\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias2(alias1((depth0 != null ? depth0.headline3 : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"description-p\">\n            <label for=\"description\">Description\n            <textarea class=\"auto-size\" type=\"text\" id=\"description\" cols=\"40\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias2(alias1((depth0 != null ? depth0.description : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n            <textarea class=\"auto-size\" type=\"text\" id=\"keywords\" cols=\"40\" style=\"box-sizing: border-box; min-height: 31px;\">"
    + alias2(alias1((depth0 != null ? depth0.keywords : depth0), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"content\">\n      <div class=\"edit-section__head\">\n        <h1>Content</h1>\n        <p>Main sections | Title | Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-sections\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addSection\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"note\">\n      <div class=\"edit-section__head\">\n        <h1>Notes</h1>\n        <p>Body copy</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-notes\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addNote\">Add note</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"collapsible\">\n      <div class=\"edit-section__head\">\n        <h1>Collapsible sections</h1>\n        <p>Background notes | References | Footnotes</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-tabs\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.accordion : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addTab\">Add collapsible section</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relBulletin\">\n      <div class=\"edit-section__head\">\n        <h1>Related bulletins</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedBulletins : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addBulletin\">Add bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relArticle\">\n      <div class=\"edit-section__head\">\n        <h1>Related articles</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedArticles : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addArticle\">Add article</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"relDataset\">\n      <div class=\"edit-section__head\">\n        <h1>Related datasets</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-related\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.relatedDatasets : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addDataset\">Add dataset</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"extLink\">\n      <div class=\"edit-section__head\">\n        <h1>External links</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-external\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.externalLinks : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addLink\">Add external link</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"used\">\n      <div class=\"edit-section__head\">\n        <h1>Related bulletins</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-used\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.usedIn : depth0),{"name":"each","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-used\" id=\"addUsed\">Add article or bulletin</button>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"download\">\n      <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-download\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.download : depth0),{"name":"each","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn-add-download\" id=\"addFile\">Add file</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"charts\">\n\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Correction</h1>\n        <p>Date | Notice | Severity</p>\n      </div>\n      <div class=\"edit-section__content edit-section__content--correction\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"each","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"text-center\">\n          <button class=\"btn-add-section\" id=\"addCorrection\">Add correction</button>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"      ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
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

  return "<div class=\"edit-section\">\n  <div class=\"edit-section__head\">\n    <h1>Charts</h1>\n\n    <p>Edit existing charts</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"chart-list\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.charts : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});
templates['workSpace'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<nav class=\"panel col col--1 workspace-nav\">\n  <ul class=\"nav nav--workspace\">\n    <li class=\"nav--workspace__browse selected\" id=\"browse\"><a href=\"#\">Browse</a></li>\n    <li class=\"nav--workspace__create\" id=\"create\"><a href=\"#\">Create</a></li>\n    <li class=\"nav--workspace__edit\" id=\"edit\"><a href=\"#\">Edit</a></li>\n  </ul>\n</nav>\n<div class=\"col col--4 workspace-menu\">\n\n</div>\n<section class=\"panel col col--7 workspace-browser\">\n  <div class=\"browser\">\n    <div class=\"addressbar\">\n      <button class=\"browser-btn-back\">&lt;</button>\n      <button class=\"browser-btn-forward\">&gt;</button>\n      <label for=\"browser-location\" class=\"browser-location-label\">Preview URL</label><input id=\"browser-location\" class=\"browser-location\" type=\"text\" value=\"\">\n      <button class=\"browser-btn-mobile\">Mobile</button>\n    </div>\n    <iframe id=\"iframe\" src=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\"></iframe>\n  </div>\n</section>\n";
},"useData":true});
})();