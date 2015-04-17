(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['browse'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return " \n      <li>\n          "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      </li>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n            <ul>\n                "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n            </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\n    "
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"usePartial":true,"useData":true});
templates['browseNode'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return " \n  <li>\n      "
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n      "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </li>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n        <ul>\n            "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n        </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
})();