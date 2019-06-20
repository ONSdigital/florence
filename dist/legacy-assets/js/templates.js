(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['blockModal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='modal'>\n    <div class='modal-box'>\n        <div class='uri-input'>\n            <label for='uri-input' class='uri-input__label'>What type of content would you like to add?</label>\n        </div>\n        <button class='btn-uri-browse' id=\"data-link\">Timeseries</button>\n        <button class='btn-uri-browse' id=\"item-link\">News</button>\n        <div class='modal-nav'>\n            <button class='btn-uri-cancel'>Cancel</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['blockNewsModal'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "              <option value=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-class=\"ui-icon-image\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class='modal'>\n  <div class='modal-box_t1'>\n    <div class='uri-input'>\n      <!--<label for='uri-width' class='uri-input__label'>Add size</label>-->\n      <!--<div class=\"select-wrap\">-->\n        <!--<select name=\"uri-size\" id=\"uri-size\">-->\n          <!--<option value=\"size11\" data-class=\"icon11\">1:1</option>-->\n          <!--<option value=\"size12\" data-class=\"icon12\">1:2</option>-->\n          <!--<option value=\"size21\" selected=\"selected\" data-class=\"icon21\">2:1</option>-->\n          <!--<option value=\"size22\" data-class=\"icon22\">2:2</option>-->\n          <!--<option value=\"size23\" data-class=\"icon23\">2:3</option>-->\n          <!--<option value=\"size24\" data-class=\"icon24\">2:4</option>-->\n        <!--</select>-->\n      <!--</div>-->\n      <label for='uri-input' class='uri-input__label'>Add url</label>\n      <input id='uri-input' placeholder='Enter URL' type='text' class='uri-input__input' value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.block : depth0)) != null ? stack1.uri : stack1), depth0))
    + "\">\n      <div class=\"modal-news\">\n        <label for='uri-image' class='uri-input__label'>Add image</label>\n        <!--No image removes any image that was there before-->\n        <div class=\"select-wrap\">\n          <select name=\"uri-image\" id=\"uri-image\">\n            <option value=\"-1\" selected=\"selected\" data-class=\"ui-icon-image\">No image</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.images : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          </select>\n        </div>\n        <label for='uri-title' class='uri-input__label'>Add title</label>\n        <input id='uri-title' placeholder='Enter title' type='text' class='uri-input__input' value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.block : depth0)) != null ? stack1.title : stack1), depth0))
    + "\">\n        <label for='uri-text' class='uri-input__label'>Add text</label>\n        <textarea class=\"auto-size uri-textarea\" type=\"text\" id=\"uri-text\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.block : depth0)) != null ? stack1.text : stack1), depth0))
    + "</textarea>\n      </div>\n    </div>\n    <div class='modal-nav_t1'>\n      <button class='btn-uri-get'>Save</button>\n      <button class='btn-uri-cancel'>Cancel</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['browseNode'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isVisualisationsDirectory : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <li class=\"js-browse__item\" data-is-visualisations=\"\" >\n            <span class=\"page__container\">\n                <span class=\"js-browse__item-title page__item page__item--directory datavis-directory\">\n                    "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n                </span>\n                <div class=\"page__buttons page__buttons--list\">\n                    <button class=\"btn btn--positive btn-browse-create-datavis\">Upload visualisation</button>\n                </div>\n            </span>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </li>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <ul class=\"js-browse__children\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "                        <li class=\"js-browse__item\" data-url=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\" >\n                            <span class=\"page__container\">\n                                <span class=\"js-browse__item-title page__item page__item--"
    + alias1(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n                                    "
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n                                </span>\n                                <div class=\"page__buttons page__buttons--list\">\n                                    <button class=\"btn btn--primary btn-browse-edit\">Edit</button>\n                                </div>\n                            </span>\n                        </li>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)));
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "/"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0));
},"9":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "        <li class=\"js-browse__item "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" data-url=\""
    + alias2(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n            <span class=\"page__container "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deleteMarker : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                <span class=\"js-browse__item-title page__item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(14, data, 0),"inverse":this.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias2(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n                <span class=\"page__buttons page__buttons--list\">\n\n                    <span class=\"page__primary-buttons js-browse__buttons--primary "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deleteMarker : depth0),{"name":"if","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <button class=\"btn btn--primary btn-browse-edit\">Edit</button>\n                        <button class=\"btn btn--positive btn-browse-create\">Create</button>\n                    </span>\n\n\n                    <button class=\"btn btn--primary btn-browse-delete-revert "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.deleteIsInCollection : depth0),"&&",(depth0 != null ? depth0.deleteMarker : depth0),{"name":"ifCond","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(20, data, 0),"data":data})) != null ? stack1 : "")
    + "\">Revert deletion</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deleteMarker : depth0),{"name":"if","hash":{},"fn":this.program(24, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isDeletable : depth0),{"name":"if","hash":{},"fn":this.program(27, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </span>\n            </span>\n            "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(32, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </li>\n";
},"10":function(depth0,helpers,partials,data) {
    return "js-browse__item--directory";
},"12":function(depth0,helpers,partials,data) {
    return "deleted";
},"14":function(depth0,helpers,partials,data) {
    return " page__item--directory";
},"16":function(depth0,helpers,partials,data) {
    var helper;

  return " page__item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"18":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n                    : "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"20":function(depth0,helpers,partials,data) {
    return "hidden";
},"22":function(depth0,helpers,partials,data) {
    return "";
},"24":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.deleteIsInCollection : depth0),{"name":"unless","hash":{},"fn":this.program(25, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"25":function(depth0,helpers,partials,data) {
    return "* this file has been delete in another collection";
},"27":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <span class=\"js-browse__buttons--secondary "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.deleteMarker : depth0),{"name":"if","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                            <button class=\"js-browse__menu hamburger-icon hamburger-icon--page-item\">\n                                <span class=\"hamburger-icon__span\">toggle menu</span>\n                            </button>\n\n                            <span class=\"page__menu\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isMoveable : depth0),{"name":"if","hash":{},"fn":this.program(28, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isDeletable : depth0),{"name":"if","hash":{},"fn":this.program(30, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                            </span>\n                        </span>\n";
},"28":function(depth0,helpers,partials,data) {
    return "                                    <button class=\"btn btn--primary btn-browse-move\">Move</button>";
},"30":function(depth0,helpers,partials,data) {
    return "                                    <button class=\"btn btn--warning btn-browse-delete\">Delete</button>";
},"32":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                <ul class=\"js-browse__children\">\n                    "
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['changePassword'] = template({"1":function(depth0,helpers,partials,data) {
    return "              <label for=\"password-old\">Current password:</label><input id=\"password-old\" type=\"password\" cols=\"40\"\n                                                                        rows=\"1\"/>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"change-password-overlay builder overlay\">\n  <div class=\"change-password-overlay__inner\">\n      <form>\n          <h1>Change password</h1>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.authenticate : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "          <label for=\"password-new\">New password:</label><input id=\"password-new\" type=\"password\" cols=\"40\" rows=\"1\"/>\n          <label for=\"password-confirm\">Confirm new password:</label><input id=\"password-confirm\" type=\"password\"\n                                                                            cols=\"40\"\n                                                                            rows=\"1\"/>\n          <button id=\"update-password\" class=\"btn btn--positive btn-florence-login fl-panel--user-and-access__login \">\n              Update password\n          </button>\n          <button id=\"update-password-cancel\" class=\"btn\">Cancel</button>\n      </form>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['chartBuilder'] = template({"1":function(depth0,helpers,partials,data) {
    return "                                    <option value=\"lg\">Desktop</option>\n                                    <option value=\"md\">Tablet</option>\n                                    <option value=\"sm\">Mobile</option>\n";
},"3":function(depth0,helpers,partials,data) {
    return "                                    <option value=\"0.56\">16:9</option>\n                                    <option value=\"0.75\">4:3</option>\n                                    <option value=\"0.42\">21:9</option>\n                                    <option value=\"1\">1:1</option>\n                                    <option value=\"1.3\">10:13</option>\n";
},"5":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"builder js-chart-builder overlay\">\n    <div class=\"chart-builder__inner builder__inner\">\n\n\n        <div id=\"edit-chart\" class=\"builder__editor builder__editor--chart\">\n\n            <div class=\"tab--background\">\n                <nav class=\"tabs--js\">\n                    <ul class=\"list--neutral flush\">\n                        <li class=\"tab__item width-sm--6\">\n                            <a href=\"javascript:void(0)\" class=\"tab__link tab__link--active\">Metadata</a>\n                        </li>\n                        <li class=\"tab__item width-sm--6\">\n                            <a href=\"javascript:void(0)\" class=\"tab__link\">Chart</a>\n                        </li>\n                        <li class=\"tab__item width-sm--6\">\n                            <a href=\"javascript:void(0)\" class=\"tab__link\">Series</a>\n                        </li>\n                        <li class=\"tab__item width-sm--6\">\n                            <a href=\"javascript:void(0)\" class=\"tab__link\">Advanced</a>\n                        </li>\n                        <li class=\"tab__item width-sm--6\">\n                            <a href=\"javascript:void(0)\" class=\"tab__link\">Annotation</a>\n                        </li>\n                    </ul>\n                </nav>\n            </div>\n\n\n            <div id='chart-panel' class=\"js-chart-builder-panel\">\n            </div>\n\n\n            <div id='metadata-panel' class=\"js-chart-builder-panel\">\n            </div>\n\n\n            <div id='series-panel' class=\"js-chart-builder-panel\">\n            </div>\n\n\n            <div id='advanced-panel' class=\"js-chart-builder-panel\">\n            </div>\n\n\n            <div id='annotation-panel' class=\"js-chart-builder-panel\">\n                <div class=\"\">\n                    <button class=\"btn btn--positive\" id=\"add-annotation\">Add annotation</button>\n                    Drag and drop the annotation to position\n                </div>\n\n                <div id=\"annotation-chart\" class=\"edit-section__sortable\">\n                </div>\n            </div>\n\n        </div>\n\n\n        <div id=\"preview-chart\" class=\"builder__preview builder__preview--chart\">\n            <div> \n                <div> \n                    <label>DEVICE <br>\n                        <div class=\"select-wrap half\">\n                            <select id=\"device\" class=\"refresh-device\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.targetDevice : depth0),{"name":"select","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                            </select>\n                        </div>\n                    </label>\n                    <label>Aspect ratio:<br>\n                        <div class=\"select-wrap half\">\n                            <select id=\"aspect-ratio\" class=\"refresh-aspect\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.aspectRatio : depth0),{"name":"select","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                            </select>\n                        </div>\n                    </label>\n                \n                \n                    <div id=\"\">\n                        <label>Label interval<br>\n                            <input type=\"text\" id=\"chart-label-interval\" class=\"refresh-aspect\" placeholder=\"[Label interval]\" value=\""
    + alias3(((helper = (helper = helpers.labelInterval || (depth0 != null ? depth0.labelInterval : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"labelInterval","hash":{},"data":data}) : helper)))
    + "\"/>\n                        </label>\n\n                        <label class=\"checkbox-label-half refresh-aspect\">Hide annotations at this size\n                            <input type=\"checkbox\" id=\"is-hidden\" value=\"display_checkbox\" class=\"inline-block\" "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.devices : depth0)) != null ? stack1.lg : stack1)) != null ? stack1.isHidden : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ></label>\n                        <br/>\n                    </div>\n                    <div id=\"chart-size\"></div>\n                </div>\n            </div>\n\n            <hr/>\n\n            <div id=\"chart-title-preview\"></div>\n            </br>\n            <div id=\"chart-subtitle-preview\"></div>\n            <div id=\"holder\">\n            <div id=\"chart\"></div>\n            </div>\n            <br/>\n            <h4>Source:</h4><span id=\"chart-source-preview\"></span>\n            <h4>Notes:</h4><span id=\"chart-notes-preview\"></span>\n\n            <div>\n            \n            </div>\n\n        </div>\n\n        <div class=\"builder__footer\">\n            <button class=\"btn btn--positive btn-chart-builder-create\">Save chart</button>\n            <button class=\"btn btn-chart-builder-cancel\">Cancel</button>\n\n            <div class=\"debug-links\">\n                FILE ID: <strong>"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "</strong>\n                 | <a href='"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "' target =\"showchart\">CHART</a>\n                 | <a href='"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "/data' target =\"data\">DATA</a>\n                 | <a href='../chartconfig?uri="
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "' target =\"json\">JSON</a>\n                 <br/>\n                 PATH: "
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\n            </div>\n        </div>\n\n    </div>\n\n\n    <div id=\"hiddenDiv\" style=\"display:none\">\n        <canvas id=\"hiddenCanvas\"></canvas>\n    </div>\n\n\n    <div id=\"hiddenSvgForDownload\"></div>\n    <canvas id=\"hiddenCanvasForDownload\"></canvas>\n\n</div>";
},"useData":true});
templates['chartBuilderAdvanced'] = template({"1":function(depth0,helpers,partials,data) {
    return "                    <input id=\"show-tooltip\" name=\"Show Tooltip\" type=\"checkbox\">\n";
},"3":function(depth0,helpers,partials,data) {
    return "                    <input id=\"show-tooltip\" name=\"Show Tooltip\" checked type=\"checkbox\">\n";
},"5":function(depth0,helpers,partials,data) {
    return "checked";
},"7":function(depth0,helpers,partials,data) {
    return "                                <option value=\"bottom\">bottom</option>\n                                <option value=\"top\">top</option>\n";
},"9":function(depth0,helpers,partials,data) {
    return "                                <option value=\"left\">left</option>\n                                <option value=\"right\">right</option>\n";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.select || (depth0 && depth0.select) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.highlight : depth0),{"name":"select","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                <option value=\"No Highlight\">No Highlight</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                                <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.select || (depth0 && depth0.select) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.highlight : depth0),{"name":"select","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"16":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                <option value=\"No Highlight\">No Highlight</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <span class=\"refresh-chart\">\n                    <label for=\"show-tooltip\" class=\"checkbox-label--small\">Show tooltips</label>\n"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.showTooltip : depth0),false,{"name":"if_eq","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                    <br/>\n                    <label for=\"show-marker\" class=\"checkbox-label--small\">Show marker points</label>\n                    <input id=\"show-marker\" name=\"Show Marker\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showMarker : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n                    <br/>\n                    <label for=\"connect-null\" class=\"checkbox-label--small\">Connect null points</label>\n                    <input id=\"connect-null\" name=\"Connect Null\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasConnectNull : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n                </span>\n\n            \n\n                <br/>\n                <div class=\"refresh-chart\"> \n                <label>X-axis position<br>\n                    <div class=\"select-wrap\">\n                        <select id=\"position-x-axis\" class=\"\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.xAxisPos : depth0),{"name":"select","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </label>\n                <label>Y-axis position"
    + alias3(((helper = (helper = helpers.yAxisPos || (depth0 != null ? depth0.yAxisPos : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"yAxisPos","hash":{},"data":data}) : helper)))
    + "<br>\n                    <div class=\"select-wrap\">\n                        <select id=\"position-y-axis\" class=\"\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.yAxisPos : depth0),{"name":"select","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </label>\n                </div>\n\n               <br/>\n\n\n\n                \n\n                <br/>\n\n \n                <div class=\"refresh-chart\"> \n                <label>Highlight Category<br>\n                    <div class=\"select-wrap\">\n                        <select id=\"chart-highlight\" class=\"\">\n"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(11, data, 0),"inverse":this.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </label>\n                </div>\n\n                <br/>\n\n\n\n\n                <div class=\"refresh-chart\">\n                <label>Use configuration from existing chart<br>\n                    <input type=\"text\" id=\"chart-config-URL\" class=\"loadExisting\" placeholder=\"[URL]\"\n                           value=\""
    + alias3(((helper = (helper = helpers.labelURL || (depth0 != null ? depth0.labelURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"labelURL","hash":{},"data":data}) : helper)))
    + "\"/>\n                </label>eg: 8bd65442, fc0d5bc1,\n                <br/> or /economy/grossdomesticproductgdp/articles/chartdemo/2017-01-05/27fabb49\n                </div>\n";
},"useData":true});
templates['chartBuilderAdvancedSelect'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.select || (depth0 && depth0.select) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.highlight : depth0),{"name":"select","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                <option value=\"0\">No Highlight</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                                <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.select || (depth0 && depth0.select) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.highlight : depth0),{"name":"select","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                <option value=\"0\">No Highlight</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['chartBuilderAnnotation'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n    <div id=\"annotation-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"chart-accordian\">\n    \n        <h3 class=\"chart-accordian-header edit-section__head accordian__title\">Note "
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ":"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "&nbsp;</h3>\n        <div class=\"chart-accordian-body accordian__content\" >\n           \n            <button class=\"btn btn--warning btn-delete-annotation\" id=\"delete-annotation-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n\n            <label for=\"show-plotline-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"checkbox-label--small\">Plotline</label>\n            <input  class=\"refresh-chart\" name=\"show-plotline-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" id=\"is-plotline-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPlotline : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n            <br/>Click the chart to set the plot line/band position\n\n            <div class=\"refresh-chart\"> \n                <label>Plotline orientation<br>\n                    <div class=\"select-wrap\">\n                        <select id=\"orientation-axis-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.orientation : depth0),{"name":"select","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </label>\n            </div>\n\n            <label for=\"chart-title\" class=\"refresh-chart\">Plot Band Width\n                <input type=\"text\" id=\"band-width-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"half\" placeholder=\"[band width]\" value=\""
    + alias3(((helper = (helper = helpers.bandWidth || (depth0 != null ? depth0.bandWidth : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"bandWidth","hash":{},"data":data}) : helper)))
    + "\"/>\n            </label>\n\n            <br/>\n            <label for=\"chart-title\" class=\"refresh-coords\">X Position (change these to set the plotline position)\n                <input type=\"text\" id=\"note-x-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-coords half\" placeholder=\"[x]\" value=\""
    + alias3(((helper = (helper = helpers.x || (depth0 != null ? depth0.x : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"x","hash":{},"data":data}) : helper)))
    + "\"/>\n            </label>\n            <label for=\"chart-title\" class=\"refresh-coords\">Y Position \n                <input type=\"text\" id=\"note-y-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-coords half\" placeholder=\"[y]\" value=\""
    + alias3(((helper = (helper = helpers.y || (depth0 != null ? depth0.y : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"y","hash":{},"data":data}) : helper)))
    + "\"/>\n            </label>\n            <br/>(NB Plot lines use row and columns coords. Annotations use x and y coords.)\n            <br/>\n            <label for=\"chart-notes\">Notes</label>\n                <textarea id=\"chart-notes-"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-chart\" placeholder=\"Add annotation here\" rows=\"4\" cols=\"120\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n            <br/>\n            \n\n        </div>\n    </div>\n\n";
},"2":function(depth0,helpers,partials,data) {
    return "checked";
},"4":function(depth0,helpers,partials,data) {
    return "                                <option value=\"x-axis\">x axis</option>\n                                <option value=\"y-axis\">y axis</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.annotations : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['chartBuilderChart'] = template({"1":function(depth0,helpers,partials,data) {
    return "                                <option value=\"bar\">Bar Chart</option>\n                                <option value=\"rotated\">Bar Chart (rotated)</option>\n                                <option value=\"line\">Line Chart</option>\n                                <option value=\"area\">Area Chart</option>\n                                <option value=\"barline\">Bar + Line Chart</option>\n                                <option value=\"rotated-barline\">Bar + Line Chart (rotated)</option>\n                                <option value=\"dual-axis\">Dual Axis</option>\n                                <option value=\"scatter\">Scatter Plot Chart</option>\n                                <option value=\"pie\">Pie Chart</option>\n                                <option value=\"donut\">Donut Chart</option>\n                                <option value=\"population\">Population Pyramid</option>\n                                <option value=\"confidence-interval\">Confidence Interval</option>\n                                <option value=\"rotated-confidence-interval\">Confidence Interval (rotated)</option>\n                                <option value=\"confidence-interval-scatter\">Confidence Interval (Scatter)</option>\n                                <option value=\"box-and-whisker\">Box and Whisker</option>\n                                <option value=\"small-multiples\">Small Multiples</option>\n                                <option value=\"heatmap\">Heatmap</option>\n                                <option value=\"table\">Table</option>\n";
},"3":function(depth0,helpers,partials,data) {
    return "third";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "                        <label for=\"chart-interval\" class=\""
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                            <input type=\"text\" id=\"chart-interval\" placeholder=\"[Interval]\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.yAxisInterval || (depth0 != null ? depth0.yAxisInterval : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"yAxisInterval","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-chart\"/>\n                        </label>\n";
},"7":function(depth0,helpers,partials,data) {
    return "                    <input type=\"radio\" name=\"palette\" id=\"colour\" value=\"colour\" />\n                    <label for=\"colour\">Colour</label>\n                    <input type=\"radio\" name=\"palette\" id=\"blue\" value=\"blue\" checked=\"checked\"/>\n                    <label for=\"blue\">Blue</label>\n                    <input type=\"radio\" name=\"palette\" id=\"legacy\" value=\"legacy\"/>\n                    <label for=\"legacy\">Legacy</label>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.palette : depth0),"legacy",{"name":"if_eq","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    return "                    <input type=\"radio\" name=\"palette\" id=\"colour\" value=\"colour\" />\n                    <label for=\"colour\">Colour</label>\n                    <input type=\"radio\" name=\"palette\" id=\"blue\" value=\"blue\" />\n                    <label for=\"blue\">Blue</label>\n                    <input type=\"radio\" name=\"palette\" id=\"legacy\" value=\"legacy\" checked=\"checked\"/>\n                    <label for=\"legacy\">Legacy</label>\n";
},"12":function(depth0,helpers,partials,data) {
    return "                    <input type=\"radio\" name=\"palette\" id=\"colour\" value=\"colour\" checked=\"checked\"/>\n                    <label for=\"colour\">Colour</label>\n                    <input type=\"radio\" name=\"palette\" id=\"blue\" value=\"blue\"/>\n                    <label for=\"blue\">Blue</label>\n                    <input type=\"radio\" name=\"palette\" id=\"legacy\" value=\"legacy\"/>\n                    <label for=\"legacy\">Legacy</label>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <label for=\"chart-data\">Chart data</label>\n                <textarea id=\"chart-data\" class=\"refresh-chart\" placeholder=\"Paste your data here\" rows=\"4\" cols=\"120\"></textarea>\n                <label>Chart type<br>\n                    <div class=\"select-wrap\">\n                        <select id=\"chart-type\" class=\"refresh-chart\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),{"name":"select","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </label>\n                <div id=\"extras\" class=\"refresh-chart\">\n                </div>\n\n                <div class=\"refresh-chart\">\n                    <label>Decimal places (tooltip)<br>\n                        <input type=\"text\" id=\"chart-decimal-places\" class=\"refresh-chart half\" placeholder=\"[Decimal places]\"\n                               value=\""
    + alias3(((helper = (helper = helpers.decimalPlaces || (depth0 != null ? depth0.decimalPlaces : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"decimalPlaces","hash":{},"data":data}) : helper)))
    + "\"/>\n                    </label>\n                    <label>Decimal places (yAxis)<br>\n                        <input type=\"text\" id=\"chart-decimal-places-yaxis\" class=\"refresh-chart half\" placeholder=\"[Decimal places]\"\n                               value=\""
    + alias3(((helper = (helper = helpers.decimalPlacesYaxis || (depth0 != null ? depth0.decimalPlacesYaxis : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"decimalPlacesYaxis","hash":{},"data":data}) : helper)))
    + "\"/>\n                    </label>\n                </div>\n                <span class=\"refresh-chart\">\n                    <label for=\"chart-min\" class=\""
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">Overwrite y-axis\n                        <input type=\"text\" id=\"chart-min\" placeholder=\"[Min]\" value=\""
    + alias3(((helper = (helper = helpers.yMin || (depth0 != null ? depth0.yMin : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"yMin","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-chart\"/>\n                    </label>\n                    <label for=\"chart-max\" class=\""
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                        <input type=\"text\" id=\"chart-max\" placeholder=\"[Max]\" value=\""
    + alias3(((helper = (helper = helpers.yMax || (depth0 != null ? depth0.yMax : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"yMax","hash":{},"data":data}) : helper)))
    + "\" class=\"refresh-chart\"/>\n                    </label>\n"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.chartType : depth0),"line",{"name":"if_eq","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </span>\n\n\n                  <span class=\"refresh-chart\">\n                    <legend>Colours</legend>\n"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.palette : depth0),"blue",{"name":"if_eq","hash":{},"fn":this.program(7, data, 0),"inverse":this.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "                  </span>\n";
},"useData":true});
templates['chartBuilderMetadata'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <span class=\"refresh-text\">\n                    <label for=\"chart-title\">Title\n                        <input type=\"text\" id=\"chart-title\" class=\"half\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n                    </label>\n                    <label for=\"chart-subtitle\">Sub-title\n                        <input type=\"text\" id=\"chart-subtitle\" class=\"half\" placeholder=\"[Subtitle]\" value=\""
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\"/>\n                    </label>\n                    <label for=\"chart-source\">Source\n                        <input type=\"text\" id=\"chart-source\" placeholder=\"[Source]\" class=\"half\" value=\""
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)))
    + "\"/>\n                    </label>\n                </span>\n\n                <label for=\"chart-unit\">Units\n                    <input type=\"text\" id=\"chart-unit\" class=\"refresh-chart half\" placeholder=\"[Unit]\" value=\""
    + alias3(((helper = (helper = helpers.unit || (depth0 != null ? depth0.unit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"unit","hash":{},"data":data}) : helper)))
    + "\"/>\n                </label>\n                <label for=\"chart-alt-text\">X axis label</label>\n                <input type=\"text\" id=\"chart-x-axis-label\" style=\"width: 99.7%\" class=\"refresh-chart\"\n                   placeholder=\"[X axis label]\" value=\""
    + alias3(((helper = (helper = helpers.xAxisLabel || (depth0 != null ? depth0.xAxisLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"xAxisLabel","hash":{},"data":data}) : helper)))
    + "\"/>\n\n\n\n                <label for=\"chart-alt-text\">Alt text</label>\n                <textarea id=\"chart-alt-text\" class=\"refresh-text\" placeholder=\"[Alt text]\">"
    + alias3(((helper = (helper = helpers.altText || (depth0 != null ? depth0.altText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"altText","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n                <label for=\"chart-notes\">Notes</label>\n                <textarea id=\"chart-notes\" class=\"refresh-text\" placeholder=\"Add chart notes here\" rows=\"4\"\n                      cols=\"120\">"
    + alias3(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"notes","hash":{},"data":data}) : helper)))
    + "</textarea>\nSample markdown:[I'm an inline-style link with title](https://www.ons.gov.uk \"ONS Homepage\")\n            ";
},"useData":true});
templates['chartBuilderSeries'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <label for=\"series-types_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Series "
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + ": "
    + alias3(this.lambda(depth0, depth0))
    + "</label>\n  <div class=\"select-wrap\">\n    <select id=\"series-types_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"col--5\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].chartTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n\n  <br/>\n";
},"2":function(depth0,helpers,partials,data) {
    return "        <option value=\"bar\">Bar</option>\n        <option value=\"line\">Line</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"edit-section\" id=\"charts\">\n    <div id=\"chart-list\" class=\"edit-section__content\">\n        <div id=\"sortable-chart\" class=\"edit-section__sortable\">\nNOT CURRENTLY FUNCTIONAL\nNB: the type needs to be set to Bar+Line in order to change the series\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n        </div>\n        \n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['chartBuilderTable'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<th scope ='col'>"
    + ((stack1 = this.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</th>";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "        <tr>\n            <th scope='row'>"
    + this.escapeExpression(helpers.lookup.call(depth0,(depths[1] != null ? depths[1].categories : depths[1]),(data && data.index),{"name":"lookup","hash":{},"data":data,"blockParams":blockParams}))
    + "</th>\n"
    + ((stack1 = helpers.each.call(depth0,(depths[1] != null ? depths[1].series : depths[1]),{"name":"each","hash":{},"fn":this.program(4, data, 2, blockParams, depths),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "        </tr>\n";
},"4":function(depth0,helpers,partials,data,blockParams,depths) {
    return "            <td>"
    + this.escapeExpression(helpers.lookup.call(depth0,depths[1],blockParams[0][0],{"name":"lookup","hash":{},"data":data,"blockParams":blockParams}))
    + "</td>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div >\n  <table class=\"\">\n    <thead>\n        <tr>\n            "
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.headers : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n        </tr>\n    </thead>\n    <tfoot>\n        <tr>\n        </tr>\n    </tfoot>\n\n    <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "    </tbody>\n  </table>\n</div>";
},"useData":true,"useDepths":true,"useBlockParams":true});
templates['chartEditBarChartExtras'] = template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"finish-at-hundred\" class=\"checkbox-label--small\">Finish at 100</label>\n<input id=\"finish-at-hundred\" name=\"Finish at 100\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.finishAtHundred : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n\n<label for=\"isReversed\" class=\"checkbox-label--small\">Reverse Legend</label>\n<input id=\"isReversed\" name=\"ReversedLegend\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isReversed : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n<label for=\"isStacked\" class=\"checkbox-label--small\">Stacked Bar</label>\n<input id=\"isStacked\" name=\"Stacked-Bar\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isStacked : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">";
},"useData":true});
templates['chartEditBarlineExtras'] = template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3=this.lambda, alias4="function";

  return "  <div>Series "
    + alias2((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ": "
    + alias2(alias3(depth0, depth0))
    + "</div>\n  <label for=\"series-types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Type\n  <div class=\"select-wrap\">\n    <select id=\"series-types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"half\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].chartTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n  </label>\n  <label for=\"line-types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Style\n  <div class=\"select-wrap\">\n    <select id=\"line-types_"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"half\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias1).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].lineTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n  </label>\n  <label for=\""
    + alias2(alias3(depth0, depth0))
    + "\">Bar stack</label>\n    <input id=\""
    + alias2(alias3(depth0, depth0))
    + "\" name=\"group_check\" value=\""
    + alias2(alias3(depth0, depth0))
    + "\" type=\"checkbox\""
    + ((stack1 = (helpers.ifContains || (depth0 && depth0.ifContains) || alias1).call(depth0,depth0,((stack1 = (depths[1] != null ? depths[1].groups : depths[1])) != null ? stack1['0'] : stack1),{"name":"ifContains","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <br/>\n  <hr/>\n\n";
},"4":function(depth0,helpers,partials,data) {
    return "        <option value=\"bar\">Bar</option>\n        <option value=\"line\">Line</option>\n";
},"6":function(depth0,helpers,partials,data) {
    return "        <option value=\"Solid\">Solid</option>\n        <option value=\"Dash\">Dash</option>\n        <option value=\"LongDash\">LongDash</option>\n        <option value=\"Dot\">Dot</option>\n        <option value=\"DashDot\">DashDot</option>\n        <option value=\"ShortDash\">ShortDash</option>\n        <option value=\"ShortDot\">ShortDot</option>\n        <option value=\"ShortDashDot\">ShortDashDot</option>\n        <option value=\"ShortDashDotDot\">ShortDashDotDot</option>\n        <option value=\"LongDashDot\">LongDashDot</option>\n        <option value=\"LongDashDotDot\">LongDashDotDot</option>\n";
},"8":function(depth0,helpers,partials,data) {
    return " checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<label for=\"finish-at-hundred\" class=\"checkbox-label\">Finish at 100</label>\n<input id=\"finish-at-hundred\" name=\"Finish at 100\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.finishAtHundred : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">\n<br/>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['chartEditDualAxisExtras'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "  <label>"
    + alias1(this.lambda(depth0, depth0))
    + "</label>\n  <div class=\"select-wrap\">\n    <select id=\"types_"
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"col--5\">\n"
    + ((stack1 = (helpers.select || (depth0 && depth0.select) || alias2).call(depth0,helpers.lookup.call(depth0,(depths[1] != null ? depths[1].chartTypes : depths[1]),depth0,{"name":"lookup","hash":{},"data":data}),{"name":"select","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </select>\n  </div>\n  <br/>\n";
},"2":function(depth0,helpers,partials,data) {
    return "        <option value=\"bar\">Bar</option>\n        <option value=\"line\">Line</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.series : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['chartEditLineChartExtras'] = template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"start-from-zero\" class=\"checkbox-label\">Start from zero</label>\n<input id=\"start-from-zero\" name=\"Start from zero\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.startFromZero : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " type=\"checkbox\">";
},"useData":true});
templates['chartEditScatterExtras'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "  <div >\n  Note the date requires 3 columns: the label, x and y values\n  </div>\n  <br/>\n";
},"useData":true});
templates['childDeletes'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <li class=\"page-list__item\">\n            <span class=\"page__item page__item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + " delete-child\">\n            "
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<br/>\n            "
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\n            </span>\n        </li>\n\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n            <ul>\n                "
    + ((stack1 = this.invokePartial(partials.childDeletes,depth0,{"name":"childDeletes","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n            </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div>\n    <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.children : stack1),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n</div>";
},"usePartial":true,"useData":true});
templates['collectionDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"slider__banner\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.inProgress : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.thrownError : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "                <p>This collection has been approved and is being prepared for the publishing queue</p>\n";
},"4":function(depth0,helpers,partials,data) {
    return "                <p>Oops, we seem to have hit an error whilst preparing this collection for the publishing queue :(</p>\n";
},"6":function(depth0,helpers,partials,data) {
    return "            <div class=\"slider__options\">\n                <!--<h3>Work on collection</h3>-->\n                <button class=\"btn btn--primary btn-collection-work-on js-work-on-collection\">Create/edit</button>\n                <button class=\"btn js-restore-delete\">Restore content</button>\n                <button class=\"btn js-import\">Import timeseries</button>\n            </div>\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                    <li class=\"page-list__item\"><span class=\"page__item page__item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ("
    + alias3((helpers.lastEditedBy || (depth0 && depth0.lastEditedBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"lastEditedBy","hash":{},"data":data}))
    + ")</span>\n                        <div class=\"page__buttons page__buttons--list\">\n                            <button class=\"btn btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Edit\n                                file\n                            </button>\n                            <button class=\"btn btn--warning btn-page-delete page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file\n                            </button>\n                        </div>\n                    </li>\n";
},"9":function(depth0,helpers,partials,data) {
    return "(Welsh)\n                    ";
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"13":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                    <li class=\"page-list__item\"><span class=\"page__item page__item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ("
    + alias3((helpers.lastEditedBy || (depth0 && depth0.lastEditedBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"lastEditedBy","hash":{},"data":data}))
    + ")</span>\n                        <div class=\"page__buttons page__buttons--list\">\n                            <button class=\"btn btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">\n                                Review\n                                file\n                            </button>\n                            <button class=\"btn btn--warning btn-page-delete page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file\n                            </button>\n                        </div>\n                    </li>\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                    <li class=\"page-list__item\">\n                        <span class=\"page__item page__item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1),"===","cy",{"name":"ifCond","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ("
    + alias3((helpers.lastEditedBy || (depth0 && depth0.lastEditedBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"lastEditedBy","hash":{},"data":data}))
    + ")</span>\n                        <div class=\"page__buttons page__buttons--list\">\n                            <button class=\"btn btn-page-edit\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Edit\n                                file\n                            </button>\n                            <button class=\"btn btn--warning btn-page-delete page-delete\" data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\"\n                                    data-language=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file\n                            </button>\n                        </div>\n                    </li>\n";
},"16":function(depth0,helpers,partials,data) {
    return "(Welsh)";
},"18":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <h3 id=\"\">API datasets in this collection</h3>\n                <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.datasets : depth0),{"name":"each","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n";
},"19":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "                        <li class=\"page-list__item\">\n                            <span class=\"page__item \">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.title : stack1), depth0))
    + " - "
    + alias2(((helper = (helper = helpers.edition || (depth0 != null ? depth0.edition : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"edition","hash":{},"data":data}) : helper)))
    + "</span>\n                            <div class=\"page__buttons page__buttons--list\">\n                                <button class=\"btn btn-page-edit\" data-path=\""
    + alias2(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Edit\n                                    file\n                                </button>\n                                <button class=\"btn btn--warning dataset-delete\" data-instanceId=\""
    + alias2(((helper = (helper = helpers.instance_id || (depth0 != null ? depth0.instance_id : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"instance_id","hash":{},"data":data}) : helper)))
    + "\" data-language=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.descriptions : depth0)) != null ? stack1.language : stack1), depth0))
    + "\">Delete file\n                                </button>\n                            </div>\n                        </li>\n";
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <h3 id=\"delete-uris\">Content deletions</h3>\n\n                <!--<p id=\"approval-permission-blocked\" style=\"display: none\"><strong>You will not be able to approve this collection as it contains delete requests actioned by you.</strong></p> -->\n\n                <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pendingDeletes : depth0),{"name":"each","hash":{},"fn":this.program(22, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n";
},"22":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "                        <li class=\"page-list__item\">\n                            <span class=\"page__item page__item--"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.type : stack1), depth0))
    + "\">\n                                "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(23, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  ("
    + alias2(((helper = (helper = helpers.totalDeletes || (depth0 != null ? depth0.totalDeletes : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(depth0,{"name":"totalDeletes","hash":{},"data":data}) : helper)))
    + " delete"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias3).call(depth0,(depth0 != null ? depth0.totalDeletes : depth0),">","1",{"name":"ifCond","hash":{},"fn":this.program(25, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " in total)<br/>\n                                "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.uri : stack1), depth0))
    + "\n                            </span>\n                            <div class=\"page__buttons page__buttons--list\">\n                                <button class=\"btn-page-delete delete-marker-remove\" data-path=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.uri : stack1), depth0))
    + "\"\n                                        data-language=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.language : stack1), depth0))
    + "\">\n                                    Cancel Delete\n                                </button>\n                            </div>\n                            "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.children : stack1),{"name":"if","hash":{},"fn":this.program(27, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </li>\n";
},"23":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n                                : "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.edition : stack1), depth0));
},"25":function(depth0,helpers,partials,data) {
    return "s";
},"27":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                                <div class=\"page__children\">\n                                    <h4>This delete contains</h4>\n                                    "
    + ((stack1 = this.invokePartial(partials.childDeletes,depth0,{"name":"childDeletes","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                                </div>\n";
},"29":function(depth0,helpers,partials,data) {
    var stack1;

  return "                <h3 id=\"delete-uris\">1 timeseries import</h3>\n                    <ul class=\"page-list\">\n                        <li class=\"page-list__item\">\n                            "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.timeseriesImportFiles : depth0)) != null ? stack1['0'] : stack1), depth0))
    + "\n                        </li>\n                    </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<div class=\"slider\">\n    <div class=\"slider__head js-collection__head\">\n        <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "<span class=\"edit btn-collection-edit js-edit-collection\">Edit collection</span></h2>\n        <!--<p>Publish: "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "<br>"
    + alias3((helpers.createdBy || (depth0 && depth0.createdBy) || alias1).call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"createdBy","hash":{},"data":data}))
    + "</p>-->\n        <!--<button class=\"btn btn--primary btn-collection-edit\">Edit collection details</button>-->\n    </div>\n\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.inProgress : stack1),"||",((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.thrownError : stack1),{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    <!--<div class=\"slider__banner\">-->\n            <!--<p>This collection has been approved and is being prepared for the publishing queue</p>-->\n    <!--</div>-->\n    <div class=\"js-collection__content\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.notStarted : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n        <div class=\"slider__content\">\n            <h3 id=\"in-progress-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.inProgress : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages in progress</h3>\n            <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.inProgress : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n            <h3 id=\"complete-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.complete : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting review</h3>\n            <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.complete : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n            <h3 id=\"reviewed-uris\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.reviewed : depth0)) != null ? stack1.length : stack1), depth0))
    + " pages awaiting approval</h3>\n            <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.reviewed : depth0),{"name":"each","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.datasets : depth0),{"name":"if","hash":{},"fn":this.program(18, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pendingDeletes : depth0),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.timeseriesImportFiles : depth0),{"name":"if","hash":{},"fn":this.program(29, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n\n    <nav class=\"slider__nav\">\n        <!--<button class=\"btn btn--primary btn-collection-work-on\">Work on collection</button>-->\n        <button class=\"btn btn--positive btn-collection-approve\">Approve collection</button>\n        <button id=\"collection-delete\" class=\"btn btn--warning btn-page-delete\">Delete collection</button>\n        <button class=\"btn btn-collection-cancel\">Cancel</button>\n    </nav>\n</div>\n\n";
},"usePartial":true,"useData":true});
templates['collectionEdit'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                    <option value=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3=this.lambda;

  return "<div class=\"slider__modal js-collection__edit-modal\">\n    <div class=\"slider__content slider__content--padded\">\n        <p>"
    + alias2((helpers.createdBy || (depth0 && depth0.createdBy) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.events : stack1),{"name":"createdBy","hash":{},"data":data}))
    + "</p>\n        <input id=\"collection-editor-name\" placeholder=\"Enter new name\" value=\""
    + alias2(alias3(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n        <div class=\"select-wrap\">\n            <select id=\"editor-team\">\n                <option selected disabled=\"disabled\">Edit the team the collection can be previewed by</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.teams : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n        </div>\n        <ul id=\"editor-team-tag\"></ul>\n        <input type=\"text\" class=\"hidden\" id=\"editor-team-input\">\n        <input type=\"radio\" id=\"collection-editor-scheduled\" name=\"publishType\" value=\"scheduledCollection\" required "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.type : stack1),"===","scheduled",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " ><label for=\"collection-editor-scheduled\">Scheduled publish</label>\n        <input type=\"radio\" id=\"collection-editor-manual\" name=\"publishType\" value=\"manualCollection\" required "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.type : stack1),"===","manual",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "><label for=\"collection-editor-manual\">Manual publish</label>\n        <div id=\"collection-editor-date-block\" class=\"overflow-hidden\">\n            <input type=\"text\" id=\"collection-editor-date\" placeholder=\"dd/mm/yyyy\"\n                   value=\""
    + alias2(alias3(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.publishDate : stack1), depth0))
    + "\"/>\n\n            <div class=\"select-wrap select-wrap--small\">\n                <select id=\"collection-editor-hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"                    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                </select>\n            </div>\n            <div class=\"select-wrap select-wrap--small\">\n                <select id=\"collection-editor-min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"                    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                </select>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"slider__nav\">\n        <div class=\"collection-editor__footer-div\">\n            <button class=\"btn btn--positive btn-collection-editor-save\">Save changes</button>\n            <button class=\"btn btn-collection-editor-cancel\">Cancel</button>\n        </div>\n    </div>\n</div>";
},"usePartial":true,"useData":true});
templates['collectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\" "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.inProgress : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.thrownError : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                <td headers=\"collection-name\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n                    "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.inProgress : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                    "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.approvalState : depth0)) != null ? stack1.thrownError : stack1),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                </td>\n                <td headers=\"collection-date\" class=\"collection-date\">"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n";
},"2":function(depth0,helpers,partials,data) {
    return "warning";
},"4":function(depth0,helpers,partials,data) {
    return "error";
},"6":function(depth0,helpers,partials,data) {
    return " [preparing publish]";
},"8":function(depth0,helpers,partials,data) {
    return " [error whilst preparing publish]";
},"10":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                    <option value=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel panel--padded col col--6\" xmlns=\"http://www.w3.org/1999/html\">\n    <h1 class=\"text-align-center\">Select a collection</h1>\n    <table class=\"table table--primary table--fixed-height-27 js-selectable-table\">\n        <thead>\n        <tr>\n            <th id=\"collection-name\" scope=\"col\">Collection name</th>\n            <th id=\"collection-date\" scope=\"col\">Collection date</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.response : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</section>\n<section class=\"panel panel--padded col col--6\">\n    <h1 class=\"text-align-center\">Create a collection</h1>\n\n    <form method=\"post\" action=\"\" class=\"form form-create-collection\">\n        <label for=\"collectionname\" class=\"hidden\">Scheduled publish</label>\n        <input id=\"collectionname\" type=\"text\" placeholder=\"Collection name\"/>\n        <label for=\"team\" class=\"hidden\">Select the team the collection can be previewed by</label>\n        <div class=\"select-wrap\">\n            <select id=\"team\">\n                <option selected disabled=\"disabled\">Select the team the collection can be previewed by</option>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.teams : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n        </div>\n        <ul id=\"team-tag\"></ul>\n        <input type=\"text\" class=\"hidden\" id=\"team-input\">\n        <input type=\"radio\" id=\"scheduledpublish\" name=\"publishType\" value=\"scheduled\" checked><label\n            for=\"scheduledpublish\">Scheduled publish</label>\n        <input type=\"radio\" id=\"manualpublish\" name=\"publishType\" value=\"manual\" required><label for=\"manualpublish\">Manual\n        publish</label>\n        <br>\n\n        <div id=\"scheduledPublishOptions\" class=\"form__container overflow-hidden\">\n            <input type=\"radio\" id=\"customschedule\" name=\"scheduleType\" value=\"custom\" checked><label\n                for=\"customschedule\">Custom\n            schedule</label>\n            <input type=\"radio\" id=\"releaseschedule\" name=\"scheduleType\" value=\"release\" required><label\n                for=\"releaseschedule\">Calendar entry schedule</label>\n\n            <div id=\"customScheduleOptions\" class=\"form__container form__container--dark padding-top--1 padding-bottom--1\">\n                <div class=\"overflow-hidden\">\n                    <label for=\"date\" class=\"hidden\">Date</label>\n                    <input id=\"date\" type=\"text\" placeholder=\"dd/mm/yyyy\"/>\n                    <br>\n                    <label for=\"hour\" class=\"hidden\">Hour</label>\n                    <div class=\"select-wrap select-wrap--small\">\n                        <select id=\"hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"                            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                    <label for=\"min\" class=\"hidden\">Minutes</label>\n                    <div class=\"select-wrap select-wrap--small\">\n                        <select id=\"min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"                            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"releaseScheduleOptions\" class=\"form__container form__container--dark form__container--center-arrow padding-top--1 padding-bottom--1 overflow-hidden text-center hidden \">\n                <a href=\"javascript:void(0)\" class=\"btn btn--primary btn--inline-block btn-select-release\">Select a calendar entry</a>\n                <div class=\"margin-top--1 selected-release\" style=\"display: none;\"></div>\n            </div>\n\n        </div>\n\n        <button class=\"btn btn--positive margin-right--0 float-right btn-collection-create\">Create collection</button>\n    </form>\n</section>\n<section class=\"panel panel--off-canvas col col--6\">\n\n</section>";
},"usePartial":true,"useData":true});
templates['editNav'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn btn--positive btn-edit-save-and-submit-for-approval\" >Save and submit for approval</button>\n";
},"3":function(depth0,helpers,partials,data) {
    return "    <button class=\"btn btn--positive btn-edit-save-and-submit-for-review\">Save and submit for review</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!--<button class=\"btn-edit-cancel\">Cancel</button>-->\n<button class=\"btn btn--primary btn-edit-save\">Save</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPageComplete : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editNavChild'] = template({"1":function(depth0,helpers,partials,data) {
    return "  <button class=\"btn btn--positive btn-edit-save-and-submit-for-approval\" >Save, submit for approval and back to parent</button>\n";
},"3":function(depth0,helpers,partials,data) {
    return "  <button class=\"btn btn--positive btn-edit-save-and-submit-for-review\">Save, submit for review and back to parent</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<button class=\"btn btn--primary btn-edit-save\">Save</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPageComplete : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorAlert'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n          <input id=\"date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\" value=\""
    + alias3(alias4((depth0 != null ? depth0.date : depth0), depth0))
    + "\"/>\n          <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n          <div id=\"correction-container_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"correction-alert\"></div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Alerts</h1>\n    <p>Date | Body copy </p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorCompendiumDatasetFiles'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\"correction_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n    <p id=\"correction-title_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</p>\n    <p id=\"correction-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</p>\n    <div class=\"edit-section__buttons\">\n      <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-upload_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Upload new file</button>\n    </div>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorContent'] = template({"1":function(depth0,helpers,partials,data) {
    return "Content";
},"3":function(depth0,helpers,partials,data) {
    return "Collapsible sections";
},"5":function(depth0,helpers,partials,data) {
    return "Main sections | Title | Body copy";
},"7":function(depth0,helpers,partials,data) {
    return "Background notes | References |\n            Footnotes";
},"9":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + "</div>\n                    <textarea class=\"auto-size\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.markdown || (depth0 != null ? depth0.markdown : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"markdown","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn btn--primary btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"==","section",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</h1>\n        <p>"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"==","section",{"name":"ifCond","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.program(7, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n        </div>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorContentNoTitle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\"content\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + alias3(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"header","hash":{},"data":data}) : helper)))
    + "</h1>\n        <p>Body copy</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-content\" class=\"edit-section__sortable\">\n            <div class=\"edit-section__item\">\n                <textarea class=\"auto-size\" id=\"content-markdown\" placeholder=\"Click edit to add\n                content\" style=\"display: none;\">"
    + alias3(((helper = (helper = helpers.list || (depth0 != null ? depth0.list : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"list","hash":{},"data":data}) : helper)))
    + "</textarea>\n                <div class=\"edit-section__title\">To add or edit content click edit</div>\n                <div class=\"edit-section__buttons\">\n                    <button class=\"btn btn--primary btn-markdown-edit\" id=\"content-edit\">Edit</button>\n                    <button class=\"btn btn--warning btn-page-delete\" id=\"content-delete\">Delete</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorContentOne'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<div class=\"edit-section\" id=\"one\">\n    <div class=\"edit-section__head\">\n        <h1>"
    + alias1(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"header","hash":{},"data":data}) : helper)))
    + "</h1>\n        <p>Body copy</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-one\" class=\"edit-section__sortable\">\n            <div class=\"edit-section__item\">\n                <textarea class=\"auto-size\" id=\"one-markdown\" placeholder=\"Type or click edit to add\n                content\" style=\"display: none;\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.list : depth0)) != null ? stack1.markdown : stack1), depth0))
    + "</textarea>\n                <div class=\"edit-section__title\">To add or edit content click edit</div>\n                <div class=\"edit-section__buttons\">\n                    <button class=\"btn btn--primary btn-markdown-edit\" id=\"one-edit\">Edit</button>\n                    <button class=\"btn btn--warning btn-page-delete\" id=\"one-delete\">Delete</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorCorrection'] = template({"1":function(depth0,helpers,partials,data) {
    return "      <h1>Corrections</h1>\n      <p>Date | Notice </p>\n";
},"3":function(depth0,helpers,partials,data) {
    return "      <h1>Versions</h1>\n      <p>Title</p>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\"></div>\n          <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(((helper = (helper = helpers.updateDate || (depth0 != null ? depth0.updateDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"updateDate","hash":{},"data":data}) : helper)))
    + "\" class=\"hasDateTimePicker\"/>\n          <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.correctionNotice || (depth0 != null ? depth0.correctionNotice : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"correctionNotice","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n            <button class=\"btn btn--warning btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.idField : depth0),"===","correction",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n      <div id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\"></div>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true});
templates['editorDate'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"previousDate_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.previousDate : depth0), depth0))
    + "</div>\n          <textarea style=\"display: none;\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.changeNotice : depth0), depth0))
    + "</textarea>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-note_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Date changes</h1>\n    <p>Date | Change notice</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorDocWithFiles'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\"correction_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n    <p id=\"correction-title_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</p>\n    <p id=\"correction-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</p>\n    <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-upload_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Upload new file</button>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['editorDownloads'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ".</div>\n          <textarea id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"add-tooltip edit-section__title\"\n                    placeholder='Add a title'>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n          <div id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__file-name\">"
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>"
    + alias3(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"header","hash":{},"data":data}) : helper)))
    + "</h1>\n    <p>Title | Name</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.button || (depth0 != null ? depth0.button : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"button","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorDownloadsWithSummary'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item edit-section__sortable-item--summary\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n                    <div class=\"file-upload\">\n                        <div class=\"file-upload__filename\" id=\"file-filename_show_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><strong>Filename:</strong> "
    + alias3(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"file","hash":{},"data":data}) : helper)))
    + "</div>\n                        <textarea class=\"file-upload__title\" id=\"file-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type title here and click edit to add description\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n                        <textarea style=\"display: none;\" id=\"file-summary_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.fileDescription || (depth0 != null ? depth0.fileDescription : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"fileDescription","hash":{},"data":data}) : helper)))
    + "</textarea>\n                        <div class=\"edit-section__buttons\">\n                            <button class=\"btn btn--primary btn-markdown-edit\" id=\"file-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit description</button>\n                            <button class=\"btn btn--warning btn-page-delete\" id=\"file-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                        </div>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"file\">\n    <div class=\"edit-section__head\">\n        <h1>Upload files</h1>\n        <p>Title | Link</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-file\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-file\">Add file</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['editorLinks'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n                    <textarea style=\"display:none\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n                    <span style=\"width:305px;max-width:305px;\"><strong>"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</strong><br /> "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n                    <button class=\"btn btn--primary btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                    <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)));
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"edit-section__head\">\n        <h1>Related "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "s</h1>\n        <p> Link | Title</p>\n    </div>\n    <div class=\"edit-section__content\">\n        <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n        </div>\n    </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorRelated'] = template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.idPlural || (depth0 != null ? depth0.idPlural : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idPlural","hash":{},"data":data}) : helper)));
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ".</div>\n          <div class=\"edit-section__title\">\n            "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n          </div>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Related "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.idPlural : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</h1>\n\n    <p>Title</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorServiceMessage'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"edit-section\" id=\"srv-msg\">\n  <div class=\"edit-section__head\">\n    <h1>Service message</h1>\n    <p>Content</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div class=\"srv-msg-txt\">\n      <label for=\"srv-msg-txt\">Title\n        <textarea class=\"auto-size\" id=\"srv-msg-txt\" type=\"text\" placeholder=\"Type content here\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</textarea>\n      </label>\n    </div>\n    <button class=\"btn btn--warning btn-page-delete\" id=\"srv-msg-delete\">Delete</button>\n  </div>\n</div>";
},"useData":true});
templates['editorT1Blocks'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n          <!--Will display content with no edition: timeseries-->\n          <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n          <button class=\"btn btn--primary btn-markdown-edit\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n          <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Blocks</h1>\n    <p>Title</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['editorTopics'] = template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n          "
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--warning btn-page-delete\" id=\""
    + alias3(alias4((depths[1] != null ? depths[1].idField : depths[1]), depth0))
    + "-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"edit-section\" id=\""
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">\n  <div class=\"edit-section__head\">\n    <h1>Other related "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</h1>\n    <p>Title</p>\n  </div>\n  <div class=\"edit-section__content\">\n    <div id=\"sortable-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <div class=\"text-center\">\n      <button class=\"btn btn--subtle btn-add-section\" id=\"add-"
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "\">Add "
    + alias3(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "</button>\n    </div>\n  </div>\n</div>";
},"useData":true,"useDepths":true});
templates['embedIframe'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='modal'>\n    <div class='modal-box'>\n        <form class=\"embed__form\">\n            <label for=\"embed-url\" class=\"embed__label\">Enter url of interactive content</label>\n            <input id=\"embed-url\" class=\"embed__input\" type=\"text\" placeholder=\"eg 'https://neighbourhood.statistics.gov.uk/interactive-chart.html'\">\n            <div>\n                <label for=\"full-width-checkbox\">Make interactive full (wrapper) width</label>\n                <input id=\"full-width-checkbox\" type=\"checkbox\" name=\"full-width\" />\n            </div>\n        </form>\n        <div class='modal-nav'>\n            <button class='btn btn--positive btn-embed-save'>Save</button>\n            <button class='btn btn-embed-cancel'>Cancel</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['equationBuilder'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"builder js-equation-builder overlay\">\n    <div class=\"equation-builder__inner builder__inner\">\n        <!-- <h1>Chart Builder</h1> -->\n\n        <div id=\"edit-equation\" class=\"equation-builder__editor builder__editor\">\n            <form>\n                <label for=\"equation-title\">Title</label>\n                <input type=\"text\" id=\"equation-title\" class=\"js-equation-title\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n\n                <label for=\"equation-content\">Equation markdown</label>\n                <textarea id=\"equation-content\" placeholder=\"[Equation markdown]\" class=\"js-equation-content\" rows=\"10\">"
    + alias3(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper)))
    + "</textarea>\n            </form>\n        </div>\n\n        <div id=\"preview-equation\" class=\"builder__preview js-equation-preview\">\n\n        </div>\n\n        <div class=\"equation-builder__footer builder__footer\">\n            <button class=\"btn btn--positive btn-equation-builder-create\">Save equation</button>\n            <button class=\"btn btn-equation-builder-cancel\">Cancel</button>\n        </div>\n\n    </div>\n</div>";
},"useData":true});
templates['florence'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wrapper\">\n  <nav class=\"js-nav\">\n  </nav>\n  <div class=\"section\" id=\"main\">\n  </div>\n</div>";
},"useData":true});
templates['forceContentModal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"overlay\" id=\"js-modal-select\">\n    <div class='modal-select'>\n        <div class=\"modal-select__head\">\n            <h1 class=\"modal-select__title\" style=\"width:100%\">Insert JSON</h1>\n        </div>\n        <form id=\"force-content-json-form\">\n            <div style=\"box-sizing: border-box;width:100%;display:block;padding: 0 21px;\">\n                <div class='json-input'>\n                    <label for='force-content-json-field' class='uri-input__label'>JSON</label>\n                    <textarea id=\"force-content-json-field\" rows=\"24\" cols=\"50\"></textarea>\n                </div>\n            </div>\n            <div class='modal-nav'>\n                <button type=\"submit\" class='btn btn--primary btn-modal-save'>Save</button>\n                <button class='btn btn-modal-cancel'>Cancel</button>\n            </div>\n        </form>\n    </div>\n</div>";
},"useData":true});
templates['iframeNav'] = template({"1":function(depth0,helpers,partials,data) {
    return "    <label for='latest' class='latest__label'>Latest release</label>\n    <input id='latest' class='latest__checkbox' type='checkbox' value='value' checked='checked'>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='iframe-nav'>\n  <button class='btn btn--primary btn-browse-get'>Use this page</button>\n  <button class='btn btn-browse-cancel'>Cancel</button>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLatest : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['imageBuilder'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"image-builder builder overlay\">\n    <div class=\"image-builder__inner builder__inner\">\n\n        <div id=\"edit-image\" class=\"image-builder__editor builder__editor\">\n\n            <span class=\"refresh-text\">\n                <input type=\"text\" id=\"image-title\" placeholder=\"[Title]\" value=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n                <input type=\"text\" id=\"image-subtitle\" placeholder=\"[Subtitle]\" value=\""
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "\"/>\n                <input type=\"text\" id=\"image-source\" placeholder=\"[Source]\" value=\""
    + alias3(((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"source","hash":{},"data":data}) : helper)))
    + "\"/>\n                <input type=\"text\" id=\"image-alt-text\" placeholder=\"[Alt text]\" value=\""
    + alias3(((helper = (helper = helpers.altText || (depth0 != null ? depth0.altText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"altText","hash":{},"data":data}) : helper)))
    + "\"/>\n            </span>\n\n            <form id=\"upload-image-form\">\n                <label>Image file upload</label>\n                <input type=\"file\" name=\"image-upload\" id=\"image-upload\">\n                <button id=\"upload-image-button\" class=\"btn btn--primary btn--flush\" type=\"submit\" value=\"Upload image\">Upload image</button>\n            </form>\n\n            </br>\n\n            <form id=\"upload-data-form\">\n                <label>Data file upload</label>\n                <input type=\"file\" name=\"data-upload\" id=\"data-upload\">\n                <button id=\"upload-data-button\" class=\"btn btn--primary btn--flush\" type=\"submit\" value=\"Upload data\">Upload data</button>\n            </form>\n\n            </br>\n\n            <textarea id=\"image-notes\" class=\"refresh-text\" placeholder=\"Add image notes here\" rows=\"4\"\n                      cols=\"120\">"
    + alias3(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"notes","hash":{},"data":data}) : helper)))
    + "</textarea>\n\n        </div>\n\n        <div id=\"preview-image\" class=\"image-builder__preview builder__preview\">\n            <span id=\"image-title-preview\"></span>\n            </br>\n            <span id=\"image-subtitle-preview\"></span>\n\n            <div id=\"image\"></div>\n\n            <span id=\"image-source-preview\"></span>\n            <span id=\"image-notes-preview\"></span>\n\n        </div>\n\n        <div class=\"image-builder__footer builder__footer\">\n            <button class=\"btn btn--positive btn-image-builder-create\">Save image</button>\n            <button class=\"btn btn-image-builder-cancel\">Cancel</button>\n        </div>\n\n    </div>\n</div>";
},"useData":true});
templates['importTsTitlesModal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='modal'>\n    <div class='modal-box'>\n        <form id=\"import-ts-form\">\n            <div class='uri-input'>\n                <label for='ts-file' class='uri-input__label'>Add .csv file</label>\n                <input id='ts-file' type='file' class='uri-input__input' title=\"Select a file and click Submit\" name=\"ts-file\">\n            </div>\n            <div class='modal-nav'>\n                <button type=\"submit\" class='btn btn--primary btn-modal-save'>Save</button>\n                <button class='btn btn-modal-cancel'>Cancel</button>\n            </div>\n        </form>\n    </div>\n</div>";
},"useData":true});
templates['linkExternalModal'] = template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "                    <label for='uri-title' class='uri-input__label'>Add title</label>\n                    <input id='uri-title' placeholder='Enter title' type='text' class='uri-input__input' value=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class='modal'>\n    <div class='modal-box'>\n        <form>\n            <div class='uri-input'>\n                <label for='uri-input' class='uri-input__label'>Add URL</label>\n                <input id='uri-input' placeholder='Enter URL' type='text' class='uri-input__input' value=\""
    + this.escapeExpression(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showTitleField : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n            <div class='modal-nav'>\n                <button class='btn btn--primary btn-uri-get'>Save</button>\n                <button class='btn btn-uri-cancel'>Cancel</button>\n            </div>\n        </form>\n    </div>\n</div>";
},"useData":true});
templates['linkModal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='modal'>\n    <div class='modal-box'>\n        <div class='uri-input'>\n            <label for='uri-input' class='uri-input__label'>What type of link would you like to add?</label>\n        </div>\n        <button class='btn btn--primary btn-uri-browse' id=\"internal-link\">Internal</button>\n        <button class='btn btn--primary btn-uri-browse' id=\"external-link\">External</button>\n        <div class='modal-nav'>\n            <button class='btn btn-uri-cancel'>Cancel</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['loadingAnimation'] = template({"1":function(depth0,helpers,partials,data) {
    return "loader--large";
},"3":function(depth0,helpers,partials,data) {
    return "loader--dark";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"loader "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.large : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.dark : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n</div>";
},"useData":true});
templates['login'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"col--4 login-wrapper\">\n  <h1>Login</h1>\n\n  <form method=\"post\" action=\"\" class=\"form-login\">\n    <label for=\"email\">Email:</label>\n    <input id=\"email\" type=\"email\" class=\"fl-user-and-access__email\" name=\"email\" cols=\"40\" rows=\"1\"/>\n\n    <label for=\"password\">Password:</label>\n    <input id=\"password\" type=\"password\" class=\"fl-user-and-access__password\" name=\"password\" cols=\"40\" rows=\"1\"/>\n\n    <button type=\"submit\" id=\"login\" class=\"btn btn--primary margin-left--0 btn-florence-login fl-panel--user-and-access__login \">Log in</button>\n  </form>\n</div>";
},"useData":true});
templates['mainNav'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.environment : depth0)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n        <li class=\"nav__item\">\n            <a class=\"nav__link js-nav-item js-nav-item--collections\" href=\"javascript:void(0)\">Collections</a></li>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showDatasetsTab : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--publish\" href=\"javascript:void(0)\">Publishing queue</a></li>\n        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--reports\" href=\"javascript:void(0)\">Reports</a></li>\n        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--users\" href=\"javascript:void(0)\">Users and access</a></li>\n        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--teams\" href=\"javascript:void(0)\">Teams</a></li>\n        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--logout\" href=\"javascript:void(0)\">Logout</a></li>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "<li class=\"environment-notification\">You're on "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.environment : depth0)) != null ? stack1.name : stack1), depth0))
    + " environment</li>";
},"4":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "            <li id=\"working-on\" class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--collection selected\" href=\"/florence/collections/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">Working\n                on: "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.collection : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a></li>\n";
},"6":function(depth0,helpers,partials,data) {
    return "            <li class=\"nav__item\">\n                <a class=\"nav__link js-nav-item js-nav-item--datasets\" href=\"javascript:void(0)\">Datasets</a>\n            </li>\n";
},"8":function(depth0,helpers,partials,data) {
    return "        <li class=\"nav__item\"><a class=\"nav__link js-nav-item js-nav-item--login selected\" href=\"javascript:void(0)\">Login</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"nav__list\">\n    <li id=\"network-status\" class=\"icon-status\">\n        <div class=\"icon-status--very-poor\"></div>\n        <div class=\"icon-status--poor\"></div>\n        <div class=\"icon-status--ok\"></div>\n        <div class=\"icon-status--good\"></div>\n    </li>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.Authentication : depth0)) != null ? stack1.isAuthenticated : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});
templates['markdownEditor'] = template({"1":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda((depth0 != null ? depth0.title : depth0), depth0));
},"3":function(depth0,helpers,partials,data) {
    return "Content Editor";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"markdown-editor\">\n    <div class=\"markdown-editor__header\">\n        <h1>"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</h1>\n        <button id=\"js-editor--chart\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--chart\" title=\"Build Chart\"></button>\n        <button id=\"js-editor--table\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--table\" title=\"Build Table\"></button>\n        <button id=\"js-editor--table-v2\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--table-v2\" title=\"Build Table (new)\"></button>\n        <button id=\"js-editor--image\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--image\" title=\"Add image\"></button>\n        <button id=\"js-editor--embed\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--embed\" title=\"Add interactive\"></button>\n        <button id=\"js-editor--equation\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--equation\" title=\"Build equation\"></button>\n        <button id=\"js-editor--box\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--box\" title=\"Add pull out box\"></button>\n        <button id=\"js-editor--warning-box\" class=\"markdown-editor__button markdown-editor__button--custom markdown-editor__button--warning-box\" title=\"Add warning\"></button>\n        <div id=\"wmd-button-bar\"></div>\n    </div>\n    <div class=\"markdown-editor__content\">\n        <div id=\"wmd-preview\" class=\"markdown-editor__preview wmd-panel wmd-preview\"></div>\n        <div id=\"wmd-edit\" class=\"markdown-editor__input wmd-panel wmd-edit\">\n            <label for=\"wmd-input\" class=\"markdown-editor__textarea-label\">Markdown:</label>\n            <textarea class=\"markdown-editor__textarea wmd-input\" title=\"wmd-input\" name=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.markdown : depth0), depth0))
    + "</textarea>\n\n            <div class=\"markdown-editor__line-numbers\" id=\"markdown-editor-line-numbers\"></div>\n        </div>\n    </div>\n    <div class=\"markdown-editor__footer\">\n        <button class=\"btn btn--primary btn-markdown-editor-save\">Save changes</button>\n        <button class=\"btn btn--positive btn-markdown-editor-exit\">Save changes and exit</button>\n        <button class=\"btn btn-markdown-editor-cancel\">Cancel</button>\n    </div>\n</div>";
},"useData":true});
templates['markdownEditorNoTitle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"markdown-editor\">\n    <div class=\"markdown-editor__header\">\n        <h1>Content editor</h1>\n        <div class=\"custom-markdown-buttons\">\n            <button class=\"btn-markdown-editor-chart\" title=\"Build chart\"></button>\n            <button class=\"btn-markdown-editor-table\" title=\"Build table\"></button>\n            <button class=\"btn-markdown-editor-image\" title=\"Add image\"></button>\n            <button class=\"btn-markdown-editor-embed\" title=\"Add interactive\"></button>\n        </div>\n        <div id=\"wmd-button-bar\"></div>\n    </div>\n    <div class=\"markdown-editor__content\">\n        <div id=\"wmd-preview\" class=\"wmd-panel wmd-preview\"></div>\n        <div id=\"wmd-edit\" class=\"wmd-panel wmd-edit\">\n            <h2>Markdown:</h2>\n            <textarea class=\"wmd-input\" id=\"wmd-input\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</textarea>\n            <div class=\"markdown-editor-line-numbers\"></div>\n        </div>\n    </div>\n    <div class=\"markdown-editor__footer\">\n        <button class=\"btn btn--primary btn-markdown-editor-save\">Save changes</button>\n        <button class=\"btn btn--positive btn-markdown-editor-exit\">Save changes and exit</button>\n        <button class=\"btn btn-markdown-editor-cancel\">Cancel</button>\n    </div>\n</div>";
},"useData":true});
templates['publishDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div class=\"accordion js-accordion\">\n                <div class=\"accordion__title js-accordion__title\">\n                    <h3 class=\"collection-name\" data-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3>\n                </div>\n                <div class=\"accordion__content accordion__content--padded disable-animation js-accordion__content\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageType : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    <button class=\"btn btn--primary margin-top--1 margin-bottom--0 btn-collection-unlock\">Unlock collection</button>\n"
    + ((stack1 = (helpers.if_any || (depth0 && depth0.if_any) || alias1).call(depth0,(depth0 != null ? depth0.pageDetails : depth0),(depth0 != null ? depth0.datasets : depth0),(depth0 != null ? depth0.datasetVersions : depth0),{"name":"if_any","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pendingDeletes : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </div>\n            </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "                        <button class=\"btn btn--positive margin-top--1 margin-bottom--0 btn-collection-publish\">Publish collection</button>\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <h4>Approved pages in this collection</h4>\n                        <ul class=\"page-list\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.pageDetails : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.datasets : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.datasetVersions : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </ul>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pageDetails : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <li class=\"page-list__item\"><span class=\"page__item page__item--"
    + alias3(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\"\n                                              data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n                                        <div class=\"page__buttons page__buttons--list\">\n                                            <button class=\"btn btn--warning btn-page-delete\">Remove from this publish</button>\n                                        </div>\n                                    </li>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "\n                                        : "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0));
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.datasets : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"10":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <li class=\"page-list__item\"><span class=\"page__item page__item--dataset\"\n                                                                      data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span>\n                                        <div class=\"page__buttons page__buttons--list\">\n                                            <button class=\"btn btn--warning btn--disabled btn-page-delete\">Remove from this publish</button>\n                                        </div>\n                                    </li>\n";
},"12":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.datasetVersions : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                                    <li class=\"page-list__item\"><span class=\"page__item page__item--dataset_version\"\n                                                                      data-path=\""
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + ": "
    + alias3(((helper = (helper = helpers.edition || (depth0 != null ? depth0.edition : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"edition","hash":{},"data":data}) : helper)))
    + " (version "
    + alias3(((helper = (helper = helpers.version || (depth0 != null ? depth0.version : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"version","hash":{},"data":data}) : helper)))
    + ")</span>\n                                        <div class=\"page__buttons page__buttons--list\">\n                                            <button class=\"btn btn--warning btn--disabled btn-page-delete\">Remove from this publish</button>\n                                        </div>\n                                    </li>\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <h4>Deleted pages in this collection</h4>\n                        <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.pendingDeletes : depth0),{"name":"each","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </ul>\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "                                <li class=\"page-list__item\">\n                                    <span class=\"page__item page__item--"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.type : stack1), depth0))
    + "\">\n                                        "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.title : stack1), depth0))
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.edition : stack1),{"name":"if","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<br/>\n                                        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.uri : stack1), depth0))
    + "\n                                    </span>\n                                    "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.children : stack1),{"name":"if","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                </li>\n";
},"17":function(depth0,helpers,partials,data) {
    var stack1;

  return ": "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.root : depth0)) != null ? stack1.description : stack1)) != null ? stack1.edition : stack1), depth0));
},"19":function(depth0,helpers,partials,data) {
    var stack1;

  return " \n                                        <div class=\"page__children\">\n                                            <h4>This delete contains</h4>\n                                            "
    + ((stack1 = this.invokePartial(partials.childDeletes,depth0,{"name":"childDeletes","data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + " \n                                        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"slider slider--background-primary\">\n    <div class=\"slider__head\">\n        <h2>"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</h2>\n        <p>"
    + alias3(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"subtitle","hash":{},"data":data}) : helper)))
    + "</p>\n    </div>\n\n    <div class=\"slider__content slider__content--fullwidth\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.collectionDetails : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n    <nav class=\"slider__nav\">\n        <button class=\"btn btn-collection-cancel\">Cancel</button>\n    </nav>\n</div>\n";
},"usePartial":true,"useData":true});
templates['publishList'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "            <tr data-collections=\""
    + alias2(alias1((depth0 != null ? depth0.ids : depth0), depth0))
    + "\">\n                <td>"
    + alias2(alias1((depth0 != null ? depth0.date : depth0), depth0))
    + "</td>\n            </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel panel--padded panel--centred col col--6\">\n    <h1 class=\"text-align-center\">Select a publish date</h1>\n    <table class=\"table table--primary table--fixed-height-27 js-selectable-table\">\n        <thead>\n        <tr>\n            <th id=\"publish-name\" scope=\"col\">Publish date</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</section>\n<section class=\"panel panel--off-canvas col col--6\">\n\n</section>";
},"useData":true});
templates['recipeModal'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "<div class=\"overlay\" id=\"js-modal-recipe\">\n    <div class=\"modal-title col--6\">\n      <h1>Select a dataset to connect</h1>\n    </div>\n    <div class=\"modal-recipe\">\n        <div class=\"modal-recipe__header\">\n            <h2>Dataset title</h2>\n        </div>\n        <div class=\"modal-recipe__body\">\n          <ul class=\"modal-recipe-list\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</ul>\n          <div class=\"modal-recipe__animation\">"
    + this.escapeExpression((helpers.loadingAnimation || (depth0 && depth0.loadingAnimation) || alias1).call(depth0,{"name":"loadingAnimation","hash":{"dark":true,"large":true},"data":data}))
    + "</td></tr>\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['relatedModal'] = template({"1":function(depth0,helpers,partials,data) {
    return "                    <label for='latest' class='latest__label'>Latest release</label>\n                    <input id='latest' class='latest__checkbox' type='checkbox' value='value' checked='checked'>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='modal'>\n    <div class='modal-box'>\n        <form>\n            <div class='uri-input'>\n                <label for='uri-input' class='uri-input__label'>Add/edit by URL</label>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLatest : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                <input id='uri-input' placeholder='Enter URL' type='text' class='uri-input__input'>\n            </div>\n            <div class='uri-browse'>\n                <p class='uri-browse__label'>Or browse to find the page</p>\n                <a tabindex=\"0\" class='btn btn--primary btn-uri-browse'>Browse</a>\n            </div>\n            <div class='modal-nav'>\n                <button type=\"submit\" class='btn btn--primary btn-uri-get'>Save</button>\n                <button class='btn btn-uri-cancel'>Cancel</button>\n            </div>\n        </form>\n    </div>\n</div>";
},"useData":true});
templates['reportList'] = template({"1":function(depth0,helpers,partials,data) {
    return "style=\"color: red;\" ";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <tr data-collection-id=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-collections-order=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"unpublished\">\n                    <td class=\"collection-name\">"
    + alias3(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n                    <td class=\"collection-date\">[NOT PUBLISHED]</td>\n                </tr>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "                <tr data-collection-id=\""
    + alias1(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-collections-order=\""
    + alias1(alias2((depth0 != null ? depth0.order : depth0), depth0))
    + "\" class=\"published\">\n                    <td class=\"collection-name\">"
    + alias1(alias2((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n                    <td class=\"collection-date\">"
    + alias1(alias2((depth0 != null ? depth0.formattedDate : depth0), depth0))
    + "</td>\n                </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel panel--padded panel--centred col col--6\">\n    <h1 class=\"text-align-center\">Select a collection</h1>\n    <table class=\"table table--primary table--fixed-height-27 js-selectable-table\">\n        <thead>\n        <tr>\n            <th id=\"collection-name\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " scope=\"col\">Collection name</th>\n            <th id=\"collection-date\" scope=\"col\">Publish date</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.unpublished : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.published : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</section>\n<section class=\"panel panel--off-canvas col col--6\">\n\n</section>";
},"useData":true});
templates['reportPublishedDetails'] = template({"1":function(depth0,helpers,partials,data) {
    return "\n        style=\"color: green; font-weight: 700;\" ";
},"3":function(depth0,helpers,partials,data) {
    return " style=\"color:\n  red; font-weight: 700;\"\n        ";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"slider__content\">\n            <div class=\"accordion js-accordion\">\n                <div class=\"collections-section\">\n                    <div class=\"collections-section__head js-accordion__title\">\n                        <h3 class=\"collection-name\">Error list</h3>\n                    </div>\n                    <div class=\"collections-section__content js-accordion__content\">\n                        <ul class=\"page-list\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.errors : stack1),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </ul>\n                    </div>\n                </div>\n            </div>\n        </div>\n";
},"6":function(depth0,helpers,partials,data) {
    return "                                <li class=\"page-list__item\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</li>\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"slider__content slider__content--fullwidth\">\n            <div class=\"accordion js-accordion\">\n                <div class=\"accordion__title js-accordion__title\">\n                    <h3>Event history</h3>\n                </div>\n                <div class=\"accordion__content js-accordion__content disable-animation\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "                </div>\n            </div>\n            <div class=\"accordion js-accordion\">\n                <div class=\"accordion__title js-accordion__title\">\n                    <h3>Publishing times</h3>\n                </div>\n                <div class=\"accordion__content js-accordion__content disable-animation\">\n                    <table class=\"table table--section publish-times-table\">\n                        <thead>\n                        <tr>\n                            <th class=\"file-name\">Path</th>\n                            <th class=\"file-size\">Size (B)</th>\n                            <th class=\"file-duration\">Time (ms)</th>\n                        </tr>\n                        </thead>\n                        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.transaction : stack1)) != null ? stack1.uriInfos : stack1),{"name":"each","hash":{},"fn":this.program(16, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n";
},"9":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <table class=\"table table--section event-history-table\">\n                            <thead>\n                            <tr>\n                                <th style=\"width:45%\">Action</th>\n                                <th style=\"width:30%\">User</th>\n                                <th style=\"width:25%\">Date/time</th>\n                            </tr>\n                            </thead>\n                            <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"each","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                            </tbody>\n                        </table>\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "                                <tr data-event-type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.type : stack1), depth0))
    + "\">\n                                    <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n                                    <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.user : stack1), depth0))
    + "</td>\n                                    <td>"
    + alias2(((helper = (helper = helpers.formattedDate || (depth0 != null ? depth0.formattedDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedDate","hash":{},"data":data}) : helper)))
    + "</td>\n                                </tr>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.metaData : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"11":function(depth0,helpers,partials,data) {
    var stack1;

  return "                                    <tr>\n                                        <td>\n                                            <ul class=\"event-meta\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.metaData : stack1),{"name":"each","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                            </ul>\n                                        </td>\n                                    </tr>\n";
},"12":function(depth0,helpers,partials,data) {
    var helper, alias1=this.escapeExpression;

  return "                                                    <li class=\"event-meta__item\">"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + ": "
    + alias1(this.lambda(depth0, depth0))
    + "</li>\n";
},"14":function(depth0,helpers,partials,data) {
    return "                        <p>Something went wrong - no events were returned.</p>\n";
},"16":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                            <tr "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verificationStatus : depth0),"===","failed",{"name":"ifCond","hash":{},"fn":this.program(17, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.verificationStatus : depth0),"===","verified",{"name":"ifCond","hash":{},"fn":this.program(19, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " >\n                                <td class=\"file-name\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</td>\n                                <td class=\"file-size\">"
    + alias3(((helper = (helper = helpers.size || (depth0 != null ? depth0.size : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"size","hash":{},"data":data}) : helper)))
    + "</td>\n                                <td class=\"file-duration\">"
    + alias3(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"duration","hash":{},"data":data}) : helper)))
    + "</td>\n                            </tr>\n";
},"17":function(depth0,helpers,partials,data) {
    return "\n                            style=\"color: red;\" ";
},"19":function(depth0,helpers,partials,data) {
    return "\n                            style=\"color: green;\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"slider slider--background-primary\">\n    <div class=\"slider__head\">\n        <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n\n        <p>Planned:  "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</p>\n\n        <p>Started at: "
    + alias3(((helper = (helper = helpers.starting || (depth0 != null ? depth0.starting : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"starting","hash":{},"data":data}) : helper)))
    + "</p>\n\n        <p>\n            Total time: <span "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.duration : depth0),"<","60000",{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.duration : depth0),">=","60000",{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"duration","hash":{},"data":data}) : helper)))
    + "</span> ms\n        </p>\n\n\n    </div>\n\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.success : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\n    <nav class=\"slider__nav\">\n        <button class=\"btn btn-collection-cancel\">Cancel</button>\n    </nav>\n</div>\n";
},"useData":true});
templates['reportUnpublishedDetails'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <table class=\"table table--section event-history-table\">\n                        <thead>\n                        <tr>\n                            <th style=\"width:45%\">Action</th>\n                            <th style=\"width:30%\">User</th>\n                            <th style=\"width:25%\">Date/time</th>\n                        </tr>\n                        </thead>\n                        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        </tbody>\n                    </table>\n                ";
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "                            <tr data-event-type=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.type : stack1), depth0))
    + "\">\n                                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.description : stack1), depth0))
    + "</td>\n                                <td>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.user : stack1), depth0))
    + "</td>\n                                <td>"
    + alias2(((helper = (helper = helpers.formattedDate || (depth0 != null ? depth0.formattedDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedDate","hash":{},"data":data}) : helper)))
    + "</td>\n                            </tr>\n                            <tr>\n                                <td colspan=\"3\">\n                                    <ul class=\"event-meta\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.exceptionText : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.metaData : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                    </ul>\n                                </td>\n                            </tr>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "                                            <li class=\"event-meta__item\">URI: "
    + this.escapeExpression(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "                                            <li class=\"event-meta__item\">Error Text: "
    + this.escapeExpression(((helper = (helper = helpers.exceptionText || (depth0 != null ? depth0.exceptionText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"exceptionText","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.eventDetails : depth0)) != null ? stack1.metaData : stack1),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"8":function(depth0,helpers,partials,data) {
    var helper, alias1=this.escapeExpression;

  return "                                                <li class=\"event-meta__item\">"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + ": "
    + alias1(this.lambda(depth0, depth0))
    + "</li>\n";
},"10":function(depth0,helpers,partials,data) {
    return " <p>Something went wrong - no events were returned.</p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"slider slider--background-primary\">\n    <div class=\"slider__head\">\n        <h2>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n\n        <p>[NOT PUBLISHED]</p>\n    </div>\n    <div class=\"slider__content slider__content--fullwidth\">\n        <div class=\"accordion js-accordion\">\n            <div class=\"accordion__title js-accordion__title\">\n                <h3>Event history</h3>\n            </div>\n            <div class=\"accordion__content js-accordion__content disable-animation\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.events : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n    <nav class=\"slider__nav\">\n        <button class=\"btn btn-collection-cancel\">Cancel</button>\n    </nav>\n</div>";
},"useData":true});
templates['selectorHour'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<option value=\"0\">00</option>\n<option value=\"3600000\">01</option>\n<option value=\"7200000\">02</option>\n<option value=\"10800000\">03</option>\n<option value=\"14400000\">04</option>\n<option value=\"18000000\">05</option>\n<option value=\"21600000\">06</option>\n<option value=\"25200000\">07</option>\n<option value=\"28800000\">08</option>\n<option value=\"32400000\" selected=\"selected\">09</option>\n<option value=\"36000000\">10</option>\n<option value=\"39600000\">11</option>\n<option value=\"43200000\">12</option>\n<option value=\"46800000\">13</option>\n<option value=\"50400000\">14</option>\n<option value=\"54000000\">15</option>\n<option value=\"57600000\">16</option>\n<option value=\"61200000\">17</option>\n<option value=\"64800000\">18</option>\n<option value=\"68400000\">19</option>\n<option value=\"72000000\">20</option>\n<option value=\"75600000\">21</option>\n<option value=\"79200000\">22</option>\n<option value=\"82800000\">23</option>";
},"useData":true});
templates['selectorMinute'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<option value=\"0\">00</option>\n<option value=\"1800000\" selected=\"selected\">30</option>";
},"useData":true});
templates['selectorModal'] = template({"1":function(depth0,helpers,partials,data) {
    return "table--50-25-25";
},"3":function(depth0,helpers,partials,data) {
    return "table--75-25";
},"5":function(depth0,helpers,partials,data) {
    return "                        <th scope=\"col\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</th>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "<div class=\"overlay\" id=\"js-modal-select\">\n    <div class=\"modal-select\">\n        <div class=\"modal-select__head\">\n            <h1 class=\"modal-select__title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n            <div class=\"modal-select__search\">\n                <input id=\"js-modal-select__search\" type=\"text\" placeholder=\"Search\">\n            </div>\n        </div>\n        <div class=\"modal-select__body\">\n            <table class=\"table table--primary "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.noOfColumns : depth0),"===",3,{"name":"ifCond","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias1).call(depth0,(depth0 != null ? depth0.noOfColumns : depth0),"===",2,{"name":"ifCond","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " table--fixed-height-24\" id=\"js-modal-select__table\">\n                <thead>\n                <tr>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.columns : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n                </thead>\n                <tbody id=\"js-modal-select__body\">\n                <tr><td colspan=\"3\" class=\"modal-select__animation\">"
    + ((stack1 = this.invokePartial(partials.loadingAnimation,depth0,{"name":"loadingAnimation","hash":{"dark":true,"large":true},"data":data,"helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "</td></tr>\n                </tbody>\n            </table>\n        </div>\n\n        <div class=\"modal-select__footer\">\n            <button class=\"btn\" id=\"js-modal-select__cancel\">Cancel</button>\n        </div>\n\n    </div>\n</div>";
},"usePartial":true,"useData":true});
templates['tableBuilder'] = template({"1":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda(depth0, depth0));
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "<div class=\"table-builder builder overlay\">\n    <div class=\"table-builder__inner builder__inner\">\n\n        <div id=\"edit-table\" class=\"table-builder__editor builder__editor\">\n            <form id=\"upload-table-form\">\n                <input type=\"text\" id=\"table-title\" placeholder=\"[Title]\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n                <input type=\"file\" name=\"files\" id=\"files\" accept=\".xls\">\n                <button type=\"submit\" value=\"Submit\" class=\"btn btn--primary btn--flush\">Submit</button>\n            </form>\n\n            <form id=\"table-modify-form\" style=\"display: none; padding-top: 10px;\">\n                <p class=\"margin-right--0 margin-left--0\">Submit a comma separated list of row/column numbers below to exclude rows, add table row/column headers to the generated HTML table. These changes will only apply to the HTML table generation theuploaded .xls file will not be affected.</p>\n                <p class=\"margin-right--0 margin-left--0\"><b>Note: </b><i>XLS row/column indices start from 0.</i></p>\n                <input type=\"text\" pattern=\"^[\\d, ]+$\" id=\"rows-excluded\" placeholder=\"[Exclude Rows]\" value=\""
    + ((stack1 = (helpers.comma_separated_list || (depth0 && depth0.comma_separated_list) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.modifications : depth0)) != null ? stack1.rowsExcluded : stack1),{"name":"comma_separated_list","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"/>\n                <input type=\"text\" pattern=\"^[\\d, ]+$\" id=\"header-rows\" placeholder=\"[Table Header Rows]\" value=\""
    + ((stack1 = (helpers.comma_separated_list || (depth0 && depth0.comma_separated_list) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.modifications : depth0)) != null ? stack1.headerRows : stack1),{"name":"comma_separated_list","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"/>\n                <input type=\"text\" pattern=\"^[\\d, ]+$\" id=\"header-columns\" placeholder=\"[Table Header Columns]\" value=\""
    + ((stack1 = (helpers.comma_separated_list || (depth0 && depth0.comma_separated_list) || alias1).call(depth0,((stack1 = (depth0 != null ? depth0.modifications : depth0)) != null ? stack1.headerColumns : stack1),{"name":"comma_separated_list","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"/>\n                <input type=\"submit\" value=\"Preview Modifications\">\n            </form>\n        </div>\n\n        <div id=\"preview-table\" class=\"table-builder__preview builder__preview\">\n\n        </div>\n\n        <div class=\"table-builder__footer builder__footer\">\n            <button class=\"btn btn--positive btn-table-builder-create\">Save table</button>\n            <button class=\"btn btn-table-builder-cancel\">Cancel</button>\n        </div>\n\n    </div>\n</div>";
},"useData":true});
templates['tableBuilderV2'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"table-builder builder overlay\">\n    <div class=\"table-builder__inner builder__inner\">\n        <div id=\"table-builder-app\"></div>\n    </div>\n</div>";
},"useData":true});
templates['teamDetails'] = template({"1":function(depth0,helpers,partials,data) {
    return "<p>This team has no members.</p>";
},"3":function(depth0,helpers,partials,data) {
    return "                <li class=\"page-list__item\">"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"slider\">\n    <div class=\"slider__head\">\n        <h2>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n    </div>\n\n    <div class=\"slider__options\">\n        <button class=\"btn btn--primary btn-team-edit-members\">Add/remove members</button>\n    </div>\n\n    <div class=\"slider__content\">\n        <ul class=\"page-list\">\n            "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.members : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.members : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n\n    <nav class=\"slider__nav\">\n        <button class=\"btn btn--warning btn-team-delete\">Delete team</button>\n        <button class=\"btn btn-team-cancel\">Cancel</button>\n    </nav>\n</div>";
},"useData":true});
templates['teamEdit'] = template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                        <li>"
    + alias2(alias1(depth0, depth0))
    + " <button class=\"btn btn--positive btn-team-list btn-team-add\" data-email=\""
    + alias2(alias1(depth0, depth0))
    + "\">Add</button></li>\n";
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "                        <li>"
    + alias2(alias1(depth0, depth0))
    + " <button class=\"btn btn--warning btn-team-list btn-team-remove\" data-email=\""
    + alias2(alias1(depth0, depth0))
    + "\">Remove</button></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"team-select overlay\">\n    <div class=\"builder__inner team-select__inner\">\n\n        <div class=\"team-select__header\">\n            <h1 class=\"team-select__heading\">Team: "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.team : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h1>\n        </div>\n        <div class=\"team-select__body\">\n            <!--50% width-->\n            <div class=\"col--6 team-select__left-column\">\n                <h2>Users</h2>\n                <div class=\"team-select-search\">\n                    <input id=\"team-search-input\" class=\"team-select-search__input\" type=\"text\"\n                           placeholder=\"Search for a user\">\n                </div>\n                <ul class=\"user-list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.user : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n\n            <!--50% width-->\n            <div class=\"col--6 team-select__right-column\">\n                <h2>Team members</h2>\n                <ul class=\"team-list\">\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.team : depth0)) != null ? stack1.members : stack1),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n        </div>\n\n        <div class=\"team-select__footer\">\n            <button class=\"btn btn-team-selector-cancel\">Done</button>\n        </div>\n\n    </div>\n</div>";
},"useData":true});
templates['teamList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=this.escapeExpression;

  return "                <tr data-id=\""
    + alias1(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n                    <td headers=\"name\" class=\"collection-name\">"
    + alias1(this.lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>\n                </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel panel--padded col col--6\">\n    <h1 class=\"text-align-center\">Select a team</h1>\n    <table class=\"table table--primary table--fixed-height-27 js-selectable-table\">\n        <thead>\n        <tr>\n            <th id=\"collection-name\" scope=\"col\">Name</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</section>\n<section class=\"panel panel--padded col col--6\">\n    <h1 class=\"text-align-center\">Create a team</h1>\n\n    <form autocomplete=\"off\" method=\"post\" action=\"\" class=\"form-create-team\">\n        <input id=\"create-team-name\" type=\"text\" placeholder=\"Name\" autocomplete=\"off\"/>\n\n        <button class=\"btn btn--positive float-right margin-right--0 btn-collection-create\">Create team</button>\n    </form>\n\n</section>\n<section class=\"panel panel--off-canvas col col--6\">\n\n</section>";
},"useData":true});
templates['tickAnimation'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"tick-animation_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"trigger_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"></div>\n    <svg version=\"1.1\" id=\"tick\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n             viewBox=\"0 0 37 37\" style=\"enable-background:new 0 0 37 37;\" xml:space=\"preserve\">\n        <path class=\"circ path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" d=\"\n            M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z\"\n            />\n        <polyline class=\"tick path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" points=\"\n            11.6,20 15.9,24.2 26.4,13.8 \"/>\n    </svg>\n</div>";
},"useData":true});
templates['uploadFileForm'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div id=\""
    + this.escapeExpression(((helper = (helper = helpers.lastIndex || (depth0 != null ? depth0.lastIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"lastIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <form id=\"UploadForm\">\n        <input type=\"file\" title=\"Select a file and click Submit\" name=\"files\">\n        <br>\n        <button class=\"btn btn--primary\" type=\"submit\" form=\"UploadForm\" value=\"submit\">Submit</button>\n        <button class=\"btn btn-page-cancel\" id=\"file-cancel\">Cancel</button>\n    </form>\n    <div id=\"response\"></div>\n    <ul id=\"list\"></ul>\n</div>";
},"useData":true});
templates['userDetails'] = template({"1":function(depth0,helpers,partials,data) {
    return "n";
},"3":function(depth0,helpers,partials,data) {
    return "            <p id=\"temp-password\">This user has not updated their temporary password.</p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"slider\">\n    <div class=\"slider__head\">\n        <h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\n    </div>\n\n    <div class=\"slider__options\">\n        <button class=\"btn btn--primary btn-user-change-password\">Change password</button>\n    </div>\n\n    <div class=\"slider__content\">\n        <p>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + " is a"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.permission : depth0),"admin",{"name":"if_eq","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " <strong>"
    + alias3(((helper = (helper = helpers.permission || (depth0 != null ? depth0.permission : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"permission","hash":{},"data":data}) : helper)))
    + "</strong>.</p>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.temporaryPassword : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n    <nav class=\"slider__nav\">\n        <button class=\"btn btn--warning btn-user-delete\">Delete user</button>\n        <button class=\"btn btn-user-cancel\">Cancel</button>\n    </nav>\n</div>\n";
},"useData":true});
templates['userList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <tr data-id=\""
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "\">\n                <td headers=\"username\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</td>\n                <td headers=\"email\" class=\"collection-name\">"
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "</td>\n            </tr>\n";
},"3":function(depth0,helpers,partials,data) {
    return "                <input type=\"radio\" id=\"admin-type\" name=\"type\" value=\"admin\" required><label\n                    for=\"admin-type\">Administrator</label>\n                <input type=\"radio\" id=\"publisher-type\" name=\"type\" value=\"publisher\" required><label\n                    for=\"publisher-type\">Publisher</label>\n";
},"5":function(depth0,helpers,partials,data) {
    return "                <input type=\"radio\" id=\"viewer-type\" name=\"type\" value=\"viewer\" checked><label\n                    for=\"viewer-type\">Viewer</label>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel panel--padded col col--6\">\n    <h1 class=\"text-align-center\">Select a user</h1>\n    <table class=\"table table--primary table--fixed-height-27 js-selectable-table\">\n        <thead>\n        <tr>\n            <th id=\"collection-name\" scope=\"col\">Name</th>\n            <th id=\"collection-name\" scope=\"col\">Email</th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n</section>\n<section class=\"panel panel--padded col col--6\">\n    <h1 class=\"text-align-center\">Create a user</h1>\n\n    <form autocomplete=\"off\" method=\"post\" action=\"\" class=\"form-create-user\">\n        <input id=\"create-user-username\" type=\"text\" placeholder=\"Username\" autocomplete=\"off\"/>\n        <input id=\"create-user-email\" type=\"text\" placeholder=\"Email\" autocomplete=\"off\"/>\n        <input id=\"create-user-password\" type=\"password\" placeholder=\"Password\" autocomplete=\"off\"/>\n        <div class=\"radioBtnDiv\">\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.permission : depth0)) != null ? stack1.admin : stack1),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.permission : depth0)) != null ? stack1.editor : stack1),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            <br>\n        </div>\n        <button class=\"btn btn--positive margin-right--0 float-right btn-collection-create\">Create user</button>\n    </form>\n</section>\n<section class=\"panel panel--off-canvas col col--6\">\n\n</section>";
},"useData":true});
templates['workBrowse'] = template({"1":function(depth0,helpers,partials,data) {
    return " page__item--directory";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return " page__item--"
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)));
},"5":function(depth0,helpers,partials,data) {
    return "<button class=\"btn btn--warning btn-browse-delete\">Delete</button>";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <ul class=\"js-browse__children\">\n"
    + ((stack1 = this.invokePartial(partials.browseNode,depth0,{"name":"browseNode","data":data,"indent":"                        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                    </ul>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<section class=\"panel workspace-browse\">\n    <nav class=\"tree-nav-holder js-browse\">\n        <ul class=\"page-list page-list--tree\">\n            <li class=\"js-browse__item\" data-url=\""
    + alias1(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "\">\n                <div class=\"page__container selected\">\n                    <span class=\"js-browse__item-title page__item"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.uri : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</span>\n                    <div class=\"page__buttons page__buttons--list selected\">\n                        <button class=\"btn btn--primary btn-browse-edit\">Edit</button>\n                        <button class=\"btn btn--positive btn-browse-create\">Create</button>\n                        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isDeletable : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                    </div>\n                </div>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.children : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </li>\n        </ul>\n    </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workCreate'] = template({"1":function(depth0,helpers,partials,data) {
    return "                    <option value=\"visualisation\" name=\"visualisation\" selected>Visualisation</option>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "                    <option value=\"bulletin\" name=\"bulletin\">Bulletin</option>\n                    <option value=\"article\" name=\"article\">Article</option>\n                    <option value=\"article_download\" name=\"article_download\">Article (PDF only)</option>\n                    <option value=\"dataset_landing_page\" name=\"dataset_landing_page\">Dataset</option>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showCreateAPIDatasetOption : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    <option value=\"timeseries_landing_page\" name=\"timeseries_landing_page\">Timeseries dataset</option>\n                    <option value=\"compendium_landing_page\" name=\"compendium_landing_page\">Compendium</option>\n                    <option value=\"static_landing_page\" name=\"static_landing_page\">Static landing page</option>\n                    <option value=\"static_page\" name=\"static_page\">Generic static page</option>\n                    <option value=\"static_article\" name=\"static_article\">Static article</option>\n                    <option value=\"static_methodology\" name=\"static_methodology\">Methodology article</option>\n                    <option value=\"static_methodology_download\" name=\"static_methodology_download\">Methodology article (PDF\n                        only)\n                    </option>\n                    <option value=\"static_qmi\" name=\"static_qmi\">QMI</option>\n                    <option value=\"static_foi\" name=\"static_foi\">FOI</option>\n                    <option value=\"static_adhoc\" name=\"static_adhoc\">Ad hoc</option>\n                    <option value=\"release\" name=\"release\">Calendar entry</option>\n";
},"4":function(depth0,helpers,partials,data) {
    return "                        <option value=\"api_dataset_landing_page\" name=\"api_dataset_landing_page\">API Dataset</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel workspace-create\">\n    <h1>New page details</h1>\n    <form>\n        <label for=\"pagetype\" class=\"hidden\">Page type</label>\n        <div class=\"select-wrap\">\n            <select id=\"pagetype\" required>\n                <option value=\"\" name=\"\">Select your option</option>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.dataVis : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "            </select>\n        </div>\n        <div class=\"edition\"></div>\n        <label for=\"pagename\" class=\"hidden\">Page name</label>\n        <input id=\"pagename\" class=\"full\" type=\"text\" placeholder=\"Page name\"/>\n        <button class=\"btn btn--positive margin-left--0 btn-page-create\">Create page</button>\n    </form>\n</section>\n";
},"useData":true});
templates['workEditCharts'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n                    <input class=\"copy-markdown-target\" style=\"position:absolute;left:-99999px;\" value=\"&lt;ons-chart path=&#34;"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "&#34; /&gt;\">\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn btn-markdown-edit copy-markdown\">\n                            Copy\n                            <div class=\"tick-animation\">\n                                <div class=\"tick-animation-trigger\"></div>\n                                <svg version=\"1.1\" id=\"tick\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 37 37\" style=\"enable-background:new 0 0 37 37;\" xml:space=\"preserve\">\n                                    <path class=\"circ path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" d=\"\n                                        M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z\"\n                                        />\n                                    <polyline class=\"tick path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" points=\"\n                                        11.6,20 15.9,24.2 26.4,13.8 \"/>\n                                </svg>\n                            </div>\n                        </button>\n                        <button class=\"btn btn--primary btn-markdown-edit\" id=\"chart-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn btn--warning btn-page-delete\" id=\"chart-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"charts\">\n    <div class=\"edit-section__head\">\n        <h1>Charts</h1>\n\n        <p>Edit existing charts</p>\n    </div>\n    <div id=\"chart-list\" class=\"edit-section__content\">\n        <div id=\"sortable-chart\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.charts : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-chart\">Add chart</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['workEditEquations'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n                    <input class=\"copy-markdown-target\" style=\"position:absolute;left:-99999px;\" value=\"&lt;ons-equation path=&#34;"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "&#34; /&gt;\">\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn btn-markdown-edit copy-markdown\">\n                            Copy\n                            <div class=\"tick-animation\">\n                                <div class=\"tick-animation-trigger\"></div>\n                                <svg version=\"1.1\" id=\"tick\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 37 37\" style=\"enable-background:new 0 0 37 37;\" xml:space=\"preserve\">\n                                    <path class=\"circ path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" d=\"\n                                        M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z\"\n                                        />\n                                    <polyline class=\"tick path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" points=\"\n                                        11.6,20 15.9,24.2 26.4,13.8 \"/>\n                                </svg>\n                            </div>\n                        </button>\n                        <button class=\"btn btn--primary btn-markdown-edit\" id=\"equation-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn btn--warning btn-page-delete\" id=\"equation-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"charts\">\n    <div class=\"edit-section__head\">\n        <h1>Equations</h1>\n\n        <p>Edit existing equations</p>\n    </div>\n    <div id=\"equation-list\" class=\"edit-section__content\">\n        <div id=\"sortable-equation\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.equations : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-equation\">Add equation</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['workEditImages'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n                    <input class=\"copy-markdown-target\" style=\"position:absolute;left:-99999px;\" value=\"&lt;ons-image path=&#34;"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "&#34; /&gt;\">\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn btn-markdown-edit copy-markdown\">\n                            Copy\n                            <div class=\"tick-animation\">\n                                <div class=\"tick-animation-trigger\"></div>\n                                <svg version=\"1.1\" id=\"tick\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 37 37\" style=\"enable-background:new 0 0 37 37;\" xml:space=\"preserve\">\n                                    <path class=\"circ path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" d=\"\n                                        M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z\"\n                                        />\n                                    <polyline class=\"tick path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" points=\"\n                                        11.6,20 15.9,24.2 26.4,13.8 \"/>\n                                </svg>\n                            </div>\n                        </button>\n                        <button class=\"btn btn--primary btn-markdown-edit\" id=\"image-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn btn--warning btn-page-delete\" id=\"image-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"images\">\n    <div class=\"edit-section__head\">\n        <h1>Images</h1>\n\n        <p>Edit existing images</p>\n    </div>\n    <div id=\"image-list\" class=\"edit-section__content\">\n        <div id=\"sortable-image\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.images : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-image\">Add image</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['workEditT1'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n\n        <p>Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div class=\"title\">\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                     style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\" id=\"sections\">\n      <div class=\"edit-section__head\">\n        <h1>Statistical highlights</h1>\n        <p></p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-section\" class=\"edit-section__sortable\">\n          <div id=\"to-populate\"></div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"srv-msg\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT16'] = template({"1":function(depth0,helpers,partials,data) {
    return "                        <div></div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <div class=\"provisional-date\">\n                            <label for=\"provisionalDate\">Provisional date range\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"provisionalDate\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.provisionalDate : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"finalised\">\n                            <label for=\"finalised\" style=\"display: inline-block;\">Finalise </label>\n                            <input type=\"checkbox\" name=\"finalised\" value=\"false\" class=\"checkbox\"/>\n                        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n\n                <p id=\"metadata-d\">Title | Summary | Release date | Next release | Contact | Summary | NS status |\n                    Cancel</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"summary-p\">\n                        <label for=\"summary\">Summary\n                            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"release-date\">\n                        <label for=\"releaseDate\">Release date and time\n                            <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                        </label>\n\n                        <div class=\"select-wrap select-wrap--small\">\n                            <select id=\"release-hour\">\n"
    + ((stack1 = this.invokePartial(partials.selectorHour,depth0,{"name":"selectorHour","data":data,"indent":"                                ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                            </select>\n                        </div>\n                        <div class=\"select-wrap select-wrap--small\">\n                            <select id=\"release-min\">\n"
    + ((stack1 = this.invokePartial(partials.selectorMinute,depth0,{"name":"selectorMinute","data":data,"indent":"                                ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "                            </select>\n                        </div>\n                    </div>\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.finalised : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                    <div class=\"next-p\">\n                        <label for=\"nextRelease\">Next release\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactName\">Contact name\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactEmail\">Contact email\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"natStat\">\n                        <label for=\"natStat-checkbox\">National statistic </label>\n                        <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" class=\"checkbox\"/>\n                    </div>\n                    <div id=\"cancelled\">\n                        <label for=\"cancelled\">Cancelled </label>\n                        <input type=\"checkbox\" name=\"cancelled\" value=\"false\" class=\"checkbox\"/>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"cancellation\"></div>\n\n        <div id=\"changeDate\"></div>\n\n        <div id=\"link\"></div>\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Preview release content</h1>\n\n                <p>References</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div class=\"text-center\">\n                    <button class=\"btn btn--subtle btn-add-section\" id=\"add-preview\">Preview</button>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"prerelease\"></div>\n\n    </div>\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT1Census'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n\n        <p>Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div class=\"title\">\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                     style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"block\"></div>\n\n    <div id=\"images\"></div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n  </div>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT1Sections'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n        <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ". </div>\n        <p id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.statistics : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n        <button class=\"btn btn--primary btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT2'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p>Title | Summary | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"summary-p\">\n                        <label for=\"summary\">Summary\n                            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div id=\"highlights\"></div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT3'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p>Title | Summary | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"summary-p\">\n                        <label for=\"summary\">Summary\n                            <textarea class=\"auto-size\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"highlighted-content\"></div>\n\n        <div id=\"timeseries\"></div>\n\n        <div id=\"datasets\"></div>\n\n        <div id=\"bulletins\"></div>\n\n        <div id=\"articles\"></div>\n\n        <div id=\"qmi\"></div>\n\n        <div id=\"methodology\"></div>\n\n    </div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Article'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "                        <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                            </label>\n                        </div>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isReleaseDateEnabled : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.if_null || (depth0 && depth0.if_null) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.isReleaseDateEnabled : depth0),{"name":"if_null","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "                            <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                            </label>\n                        </div>\n";
},"6":function(depth0,helpers,partials,data) {
    return "checked";
},"8":function(depth0,helpers,partials,data) {
    return "";
},"10":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isReleaseDateEnabled : depth0),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                    "
    + ((stack1 = (helpers.if_null || (depth0 && depth0.if_null) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.isReleaseDateEnabled : depth0),{"name":"if_null","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                                ";
},"11":function(depth0,helpers,partials,data) {
    return "                                        checked\n";
},"13":function(depth0,helpers,partials,data) {
    return " \n                                        checked\n";
},"15":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.imageUri : depth0),{"name":"unless","hash":{},"fn":this.program(16, data, 0),"inverse":this.program(18, data, 0),"data":data})) != null ? stack1 : "");
},"16":function(depth0,helpers,partials,data) {
    return "                                <label for=\"neutral-article-image-upload\">Upload article image\n                                    <input style=\"color: #323232\" type=\"file\" id=\"neutral-article-image-upload\" accept=\".png, .jpg, .jpeg\">\n                                </label>\n\n                                <button id=\"neutral-article-image-upload-submit\" class=\"btn btn--primary margin-top--0\" type=\"submit\" value=\"Upload image\">Upload image</button>\n\n";
},"18":function(depth0,helpers,partials,data) {
    var helper;

  return "                                <div class=\"margin-left--1 margin-top--1\">\n                                    <p class=\"margin-left--0\">Image preview (not actual size)</p>\n                                    <img src=\"/resource?uri="
    + this.escapeExpression(((helper = (helper = helpers.imageUri || (depth0 != null ? depth0.imageUri : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageUri","hash":{},"data":data}) : helper)))
    + "&width=250\" />\n                                </div>\n                                    <button id=\"neutral-article-image-upload-delete\" class=\"btn btn--warning margin-top--0\" type=\"submit\" value=\"Upload image\">Delete image</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-form\">\n        <div class=\"edit-accordion\">\n            <div class=\"edit-section\">\n                <div class=\"edit-section__head\">\n                    <h1>Metadata</h1>\n                    <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n                </div>\n                <div class=\"edit-section__content\">\n                    <div id=\"metadata-list\">\n                        <div>\n                            <label for=\"title\">Title\n                                <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"edition\">\n                            <label for=\"edition\">Edition\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.isPrototypeArticle : depth0),{"name":"unless","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                        <div class=\"next-p\">\n                            <label for=\"nextRelease\">Next release\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactName\">Contact name\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactEmail\">Contact email\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactTelephone\">Contact telephone\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"abstract-p\">\n                            <label for=\"abstract\">Abstract\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"natStat\">\n                            <label for=\"natStat-checkbox\">National statistic</label>\n                            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nationalStatistic : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                        </div>\n                        <div>\n                            <label for=\"keywords\">Keywords\n                                <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                       style=\"display: none;\">\n                            </label>\n                            <ul id=\"keywordsTag\"></ul>\n                        </div>\n                        <div>\n                            <label for=\"metaDescription\">Meta description\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n\n                        <div style=\"background-color: #343B59; padding: 21px 0; margin: 0 21px;\">\n                            <div id=\"articleType\">\n                                <label for=\"articleType-checkbox\">Neutral article</label>\n                                <input id=\"articleType-checkbox\" type=\"checkbox\" name=\"articleType\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPrototypeArticle : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                            </div>\n                            <div id=\"releaseDateEnabled\">\n                                <label for=\"releaseDateEnabled-checkbox\">Release date enabled</label>\n                                <input id=\"releaseDateEnabled-checkbox\" type=\"checkbox\" name=\"releaseDateEnabled\" \n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.isPrototypeArticle : depth0),{"name":"unless","hash":{},"fn":this.program(8, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "/>\n                            </div>\n\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isPrototypeArticle : depth0),{"name":"if","hash":{},"fn":this.program(15, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"section\"></div>\n\n            <div id=\"tab\"></div>\n\n            <div id=\"charts\"></div>\n\n            <div id=\"tables\"></div>\n\n            <div id=\"equations\"></div>\n\n            <div id=\"images\"></div>\n\n            <div id=\"document\"></div>\n\n            <div id=\"data\"></div>\n\n            <div id=\"topics\"></div>\n\n            <div id=\"link\"></div>\n\n            <div id=\"qmi\"></div>\n\n            <div id=\"methodology\"></div>\n\n            <div id=\"pdf\"></div>\n\n            <div id=\"correction\"></div>\n\n            <div id=\"alert\"></div>\n\n        </div>\n\n        <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </nav>\n    </div>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4ArticleDownload'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <form class=\"edit-form\">\n        <div class=\"edit-accordion\">\n            <div class=\"edit-section\">\n                <div class=\"edit-section__head\">\n                    <h1>Metadata</h1>\n                    <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n                </div>\n                <div class=\"edit-section__content\">\n                    <div id=\"metadata-list\">\n                        <div>\n                            <label for=\"title\">Title\n                                <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"edition\">\n                            <label for=\"edition\">Edition\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n\n                            </label>\n                        </div>\n                        <div class=\"next-p\">\n                            <label for=\"nextRelease\">Next release\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactName\">Contact name\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactEmail\">Contact email\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactTelephone\">Contact telephone\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"summary-p\">\n                            <label for=\"abstract\">Abstract\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"natStat\">\n                            <label for=\"natStat-checkbox\">National statistic </label>\n                            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                        </div>\n                        <div>\n                            <label for=\"keywords\">Keywords\n                                <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                       style=\"display: none;\">\n                            </label>\n                            <ul id=\"keywordsTag\"></ul>\n                        </div>\n                        <div>\n                            <label for=\"metaDescription\">Meta description\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"content\"></div>\n\n            <div id=\"file\"></div>\n\n            <div id=\"charts\"></div>\n\n            <div id=\"tables\"></div>\n\n            <div id=\"equations\"></div>\n\n            <div id=\"images\"></div>\n\n            <div id=\"document\"></div>\n\n            <div id=\"data\"></div>\n\n            <div id=\"topics\"></div>\n\n            <div id=\"link\"></div>\n\n            <div id=\"qmi\"></div>\n\n            <div id=\"methodology\"></div>\n\n            <div id=\"alert\"></div>\n\n            <div id=\"correction\"></div>\n\n        </div>\n\n        <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </nav>\n    </form>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Bulletin'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <form class=\"edit-form\">\n        <div class=\"edit-accordion\">\n\n            <div class=\"edit-section\">\n                <div class=\"edit-section__head\">\n                    <h1>Metadata</h1>\n                    <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n                </div>\n                <div class=\"edit-section__content\">\n                    <div id=\"metadata-list\">\n                        <div>\n                            <label for=\"title\">Title\n                                <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"edition\">\n                            <label for=\"edition\">Edition\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n\n                            </label>\n                        </div>\n                        <div class=\"next-p\">\n                            <label for=\"nextRelease\">Next release\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactName\">Contact name\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactEmail\">Contact email\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactTelephone\">Contact telephone\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"summary-p\">\n                            <label for=\"summary\">Summary\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"natStat\">\n                            <label for=\"natStat-checkbox\">National statistic </label>\n                            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                        </div>\n                        <div id=\"headline1-p\">\n                            <label for=\"headline1\">Headline 1\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"headline1\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline1 : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"headline2-p\">\n                            <label for=\"headline2\">Headline 2\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"headline2\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline2 : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"headline3-p\">\n                            <label for=\"headline3\">Headline 3\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"headline3\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline3 : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"keywords\">Keywords\n                                <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                       style=\"display: none;\">\n                            </label>\n                            <ul id=\"keywordsTag\"></ul>\n                        </div>\n                        <div>\n                            <label for=\"metaDescription\">Meta description\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"section\"></div>\n\n            <div id=\"tab\"></div>\n\n            <div id=\"charts\"></div>\n\n            <div id=\"tables\"></div>\n\n            <div id=\"equations\"></div>\n\n            <div id=\"images\"></div>\n\n            <div id=\"document\"></div>\n\n            <div id=\"data\"></div>\n\n            <div id=\"topics\"></div>\n\n            <div id=\"link\"></div>\n\n            <div id=\"qmi\"></div>\n\n            <div id=\"methodology\"></div>\n\n            <div id=\"pdf\"></div>\n\n            <div id=\"correction\"></div>\n\n            <div id=\"alert\"></div>\n\n        </div>\n\n        <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </nav>\n    </form>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Compendium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n\n    <div class=\"child-page\">\n        <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n    </div>\n\n    <div class=\"edit-accordion\">\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p id=\"metadata-a\">Title | Contact | Abstract | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"edition\">\n                        <label for=\"edition\">Headline\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"headline\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.headline : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"release-date\">\n                        <label for=\"releaseDate\">Release date\n                            <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                        </label>\n                    </div>\n                    <div class=\"next-p\">\n                        <label for=\"nextRelease\">Next release\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactName\">Contact name\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactEmail\">Contact email\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactTelephone\">Contact telephone\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"abstract-p\">\n                        <label for=\"abstract\">Abstract\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"abstract\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1._abstract : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"natStat\">\n                        <label for=\"natStat-checkbox\">National statistic </label>\n                        <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"section\"></div>\n\n        <div id=\"tab\"></div>\n\n        <div id=\"charts\"></div>\n\n        <div id=\"tables\"></div>\n\n        <div id=\"equations\"></div>\n\n        <div id=\"images\"></div>\n\n        <div id=\"document\"></div>\n\n        <div id=\"data\"></div>\n\n        <div id=\"topics\"></div>\n\n        <div id=\"link\"></div>\n\n        <div id=\"qmi\"></div>\n\n        <div id=\"methodology\"></div>\n\n        <div id=\"pdf\"></div>\n\n        <div id=\"correction\"></div>\n\n        <div id=\"alert\"></div>\n\n    </div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT4Methodology'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p id=\"metadata-m\">Title | Contact | Summary | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"release-date\">\n                        <label for=\"releaseDate\">Release date\n                            <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactName\">Contact name\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactEmail\">Contact email\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactTelephone\">Contact telephone\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"summary-p\">\n                        <label for=\"summary\">Summary\n                            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"section\"></div>\n\n        <div id=\"tab\"></div>\n\n        <div id=\"charts\"></div>\n\n        <div id=\"tables\"></div>\n\n        <div id=\"equations\"></div>\n\n        <div id=\"images\"></div>\n\n        <div id=\"file\"></div>\n\n        <div id=\"document\"></div>\n\n        <div id=\"dataset\"></div>\n\n        <div id=\"topics\"></div>\n\n        <div id=\"link\"></div>\n\n        <div id=\"anchor\"></div>\n\n        <!--<div id=\"qmi\"></div>-->\n\n        <div id=\"pdf\"></div>\n\n        <div id=\"alert\"></div>\n\n    </div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT5'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-a\">Title | Next release | Key note | Unit | NS | Source</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div class=\"next-p\">\n            <label for=\"nextRelease\">Next release\n              <textarea class=\"auto-size\" type=\"text\" id=\"nextRelease\">"
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
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"unit\">Unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"unit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.unit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"preUnit\">Pre unit\n              <textarea class=\"auto-size\" type=\"text\" id=\"preUnit\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.preUnit : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"isIndex\">\n            <label for=\"isIndex\">Index? </label>\n            <input type=\"checkbox\" name=\"isIndex\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"source\">Source\n              <textarea class=\"auto-size\" type=\"text\" id=\"source\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.source : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"one\"></div>\n\n    <div id=\"note\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"timeseries\"></div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"alert\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT6'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p id=\"metadata-b\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"edition\">\n                        <label for=\"edition\">Edition\n                            <textarea class=\"auto-size\" type=\"text\" id=\"edition\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"release-date\">\n                        <label for=\"releaseDate\">Release date\n                            <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                        </label>\n                    </div>\n                    <div class=\"next-p\">\n                        <label for=\"nextRelease\">Next release\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactName\">Contact name\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactEmail\">Contact email\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"contactTelephone\">Contact telephone\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"abstract-p\">\n                        <label for=\"abstract\">Summary\n                            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div id=\"natStat\">\n                        <label for=\"natStat-checkbox\">National statistic </label>\n                        <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Chapters</h1>\n                <p>Title</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"sortable-chapter\" class=\"edit-section__sortable\">\n                    <div id=\"chapters\"></div>\n                </div>\n                <div class=\"text-center\">\n                    <button class=\"btn btn--subtle btn-add-section\" id=\"add-chapter\">Add chapter</button>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Compendium data</h1>\n                <p>Title</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"sortable-compendium-data\" class=\"edit-section__sortable\">\n                    <div id=\"datasets\"></div>\n                </div>\n                <div class=\"text-center\">\n                    <button class=\"btn btn--subtle btn-add-section\" id=\"add-compendium-data\">Add data</button>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"document\"></div>\n\n        <div id=\"data\"></div>\n\n        <div id=\"qmi\"></div>\n\n        <div id=\"methodology\"></div>\n\n        <div id=\"alert\"></div>\n\n    </div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT6Chapter'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n    <div class=\"edit-section__sortable-item--counter float-left\">"
    + alias3((helpers.plus || (depth0 && depth0.plus) || alias1).call(depth0,(data && data.index),1,{"name":"plus","hash":{},"data":data}))
    + ".</div>\n    <div id=\"chapter-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__title\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\n    <div class=\"edit-section__buttons\">\n      <button class=\"btn btn--primary btn-markdown-edit\" id=\"chapter-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Rename</button>\n      <button class=\"btn btn--primary btn-markdown-edit\" id=\"chapter-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n      <button class=\"btn btn--warning btn-page-delete\" id=\"chapter-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n    </div>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT6Dataset'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n        <p id=\"compendium-data-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</p>\n\n        <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"compendium-data-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Rename</button>\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"compendium-data-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n            <button class=\"btn btn--warning btn-page-delete\" id=\"compendium-data-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n        </div>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT7'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <form>\n        <div class=\"edit-accordion\">\n            <div class=\"edit-section\">\n                <div class=\"edit-section__head\">\n                    <h1>Metadata</h1>\n                    <p id=\"metadata-ad\">Title | Release date | Reference | Keywords</p>\n                    <p id=\"metadata-f\">Title | Release date | Keywords</p>\n                    <p id=\"metadata-md\">Title | Contact | Revised | Keywords</p>\n                    <p id=\"metadata-q\">Title | Contact | Survey | Frequency | How compiled | Coverage | Size | Revised |\n                        Keywords</p>\n                    <p id=\"metadata-s\">Title | Summary | Keywords</p>\n                </div>\n                <div class=\"edit-section__content\">\n                    <div id=\"metadata-list\">\n                        <div>\n                            <label for=\"title\">Title\n                                <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"summary-p\">\n                            <label for=\"summary\">Summary\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"natStat\">\n                            <label for=\"natStat-checkbox\">National statistic </label>\n                            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                        </div>\n                        <div id=\"contact-p\">\n                            <label for=\"contactName\">Contact name\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                            </label>\n                            <label for=\"contactEmail\">Contact email\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                            </label>\n                            <label for=\"contactPhone\">Contact phone\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"survey-p\">\n                            <label for=\"survey\">Survey name\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"survey\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.surveyName : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"frequency-p\">\n                            <label for=\"frequency\">Frequency\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"frequency\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.frequency : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"compilation-p\">\n                            <label for=\"compilation\">How compiled\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"compilation\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.compilation : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"geoCoverage-p\">\n                            <label for=\"geoCoverage\">Geographic coverage\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"geoCoverage\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.geographicCoverage : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"sampleSize-p\">\n                            <label for=\"sampleSize\">Sample size\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"sampleSize\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.sampleSize : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"lastRevised-p\">\n                            <label for=\"lastRevised\">Last revised\n                                <input type=\"text\" id=\"lastRevised\" placeholder=\"Day month year\"\n                                       value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.lastRevised : stack1), depth0))
    + "\"/>\n                            </label>\n                        </div>\n                        <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                            </label>\n                        </div>\n                        <div id=\"reference-p\">\n                            <label for=\"reference\">Reference\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"reference\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.reference : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"keywords\">Keywords\n                                <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                       style=\"display: none;\">\n                            </label>\n                            <ul id=\"keywordsTag\"></ul>\n                        </div>\n                        <div>\n                            <label for=\"metaDescription\">Meta description\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"content\"></div>\n\n            <div id=\"charts\"></div>\n\n            <div id=\"tables\"></div>\n\n            <div id=\"equations\"></div>\n\n            <div id=\"images\"></div>\n\n            <div id=\"pdfFile\"></div>\n\n            <div id=\"document\"></div>\n\n            <div id=\"dataset\"></div>\n\n            <div id=\"file\"></div>\n\n            <div id=\"link\"></div>\n\n            <div id=\"alert\"></div>\n\n        </div>\n\n        <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </nav>\n    </form>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT7Landing'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n              <textarea class=\"auto-size\" id=\"section-uri_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Copy link or click Go to, navigate to page and click Copy link. Then add a title and click Edit\">"
    + alias3(((helper = (helper = helpers.uri || (depth0 != null ? depth0.uri : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"uri","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea class=\"auto-size\" id=\"section-title_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" placeholder=\"Type a title and click Edit\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <textarea style=\"display: none;\" id=\"section-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"summary","hash":{},"data":data}) : helper)))
    + "</textarea>\n              <button class=\"btn btn--primary btn-markdown-edit\" id=\"section-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n              <button class=\"btn btn--primary btn-page-delete\" id=\"section-delete_"
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
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Sections</h1>\n        <p> Link | Summary</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-section\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.sections : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n          <button class=\"btn btn--subtle btn-add-section\" id=\"add-section\">Add section</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"edition\"></div>\n\n    <div id=\"content\"></div>\n\n    <div id=\"link\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT7StaticArticle'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n                <p id=\"metadata-m\">Title | Summary | Keywords</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <div>\n                        <label for=\"title\">Title\n                            <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div class=\"release-date\">\n                        <label for=\"releaseDate\">Release date\n                            <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                        </label>\n                    </div>\n                    <div id=\"summary-p\">\n                        <label for=\"summary\">Summary\n                            <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                    <div>\n                        <label for=\"keywords\">Keywords\n                            <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                   style=\"display: none;\">\n                        </label>\n                        <ul id=\"keywordsTag\"></ul>\n                    </div>\n                    <div>\n                        <label for=\"metaDescription\">Meta description\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                        </label>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id=\"section\"></div>\n\n        <div id=\"charts\"></div>\n\n        <div id=\"tables\"></div>\n\n        <div id=\"equations\"></div>\n\n        <div id=\"images\"></div>\n\n        <div id=\"file\"></div>\n\n        <div id=\"link\"></div>\n\n        <div id=\"anchor\"></div>\n\n        <div id=\"alert\"></div>\n\n    </div>\n\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"panel workspace-edit\">\n\n  <div class=\"child-page\">\n    <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n  </div>\n\n  <div class=\"edit-accordion\">\n\n    <div id=\"one\"></div>\n\n    <div id=\"version\"></div>\n\n    <div id=\"correction\"></div>\n\n    <div id=\"supplementary-files\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8ApiLandingPage'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"margin-left--1 margin-bottom--1 margin-top--2\"><strong>Connected dataset ID: </strong>"
    + alias2(alias1((depth0 != null ? depth0.apiDatasetId : depth0), depth0))
    + "</div>\n  <div class=\"margin-left--1 margin-bottom--1\"><strong>Title: </strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n</section>\n";
},"usePartial":true,"useData":true});
templates['workEditT8Compendium'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <form>\n        <div class=\"child-page\">\n            <p class=\"child-page__content\">This is a sub-page of <span class=\"child-page__title\"></span></p>\n        </div>\n\n        <div class=\"edit-accordion\">\n\n            <div class=\"edit-section\">\n                <div class=\"edit-section__head\">\n                    <h1>Metadata</h1>\n\n                    <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n                </div>\n                <div class=\"edit-section__content\">\n                    <div id=\"metadata-list\">\n                        <div>\n                            <label for=\"title\">Title\n                                <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"summary-p\">\n                            <label for=\"summary\">Summary\n                                <textarea class=\"auto-size\" type=\"text\"\n                                          id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div class=\"release-date\">\n                            <label for=\"releaseDate\">Release date\n                                <input id=\"releaseDate\" type=\"text\" placeholder=\"Day month year\"\n                                       value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.releaseDate : stack1), depth0))
    + "\"/>\n                            </label>\n                        </div>\n                        <div class=\"next-p\">\n                            <label for=\"nextRelease\">Next release\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"nextRelease\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.nextRelease : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactName\">Contact name\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactEmail\">Contact email\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"contactEmail\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"contactTelephone\">Contact telephone\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"contactTelephone\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.telephone : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div>\n                            <label for=\"datasetId\">Dataset ID\n                            <textarea class=\"auto-size\" type=\"text\"\n                                      id=\"datasetId\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.datasetId : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                        <div id=\"natStat\">\n                            <label for=\"natStat-checkbox\">National statistic </label>\n                            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\"/>\n                        </div>\n                        <div>\n                            <label for=\"keywords\">Keywords\n                                <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\"\n                                       style=\"display: none;\">\n                            </label>\n                            <ul id=\"keywordsTag\"></ul>\n                        </div>\n                        <div>\n                            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\"\n                        id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"file\"></div>\n\n            <div id=\"document\"></div>\n\n            <div id=\"dataset\"></div>\n\n            <div id=\"qmi\"></div>\n\n            <div id=\"methodology\"></div>\n\n            <div id=\"correction\"></div>\n\n        </div>\n\n        <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNavChild,depth0,{"name":"editNavChild","data":data,"indent":"            ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "        </nav>\n    </form>\n</section>";
},"usePartial":true,"useData":true});
templates['workEditT8CorrectionList'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "      <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n        <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.label : depth0), depth0))
    + "</div>\n        <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n               value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\"/>\n        <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n        <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n        <button class=\"btn btn--warning btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n      </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
templates['workEditT8LandingDatasetList'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n    <p id=\"edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.edition : stack1), depth0))
    + "</p>\n    <button class=\"btn btn--primary btn-markdown-edit\" id=\"edition-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Update / Add supplementary file</button>\n    <button class=\"btn btn--warning btn-page-delete\" id=\"edition-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete file</button>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditT8LandingPage'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n  <div class=\"edit-accordion\">\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Metadata</h1>\n        <p id=\"metadata-d\">Title | Next release | Contact | Summary | NS status | Keywords</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"metadata-list\">\n          <div>\n            <label for=\"title\">Title\n              <textarea class=\"auto-size\" type=\"text\" id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"summary-p\">\n            <label for=\"summary\">Summary\n              <textarea class=\"auto-size\" type=\"text\" id=\"summary\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.summary : stack1), depth0))
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
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"datasetId\">Dataset ID\n              <textarea class=\"auto-size\" type=\"text\" id=\"datasetId\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.datasetId : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div id=\"natStat\">\n            <label for=\"natStat-checkbox\">National statistic </label>\n            <input id=\"natStat-checkbox\" type=\"checkbox\" name=\"natStat\" value=\"false\" />\n          </div>\n          <div>\n            <label for=\"keywords\">Keywords\n              <input name=\"tags\" id=\"keywords\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.keywords : stack1), depth0))
    + "\" style=\"display: none;\">\n            </label>\n            <ul id=\"keywordsTag\"></ul>\n          </div>\n          <div>\n            <label for=\"metaDescription\">Meta description\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaDescription\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaDescription : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n          <div>\n            <label for=\"metaCmd\">CMD meta data\n              <textarea class=\"auto-size\" type=\"text\" id=\"metaCmd\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.metaCmd : stack1), depth0))
    + "</textarea>\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"one\"></div>\n\n    <div class=\"edit-section\">\n      <div class=\"edit-section__head\">\n        <h1>Download options</h1>\n        <p>Title</p>\n      </div>\n      <div class=\"edit-section__content\">\n        <div id=\"sortable-edition\" class=\"edit-section__sortable\">\n          <div id=\"edition\"></div>\n        </div>\n        <div class=\"text-center\">\n          <button class=\"btn btn--subtle btn-add-section\" id=\"add-edition\">Add spreadsheet</button>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"dataset\"></div>\n\n    <div id=\"document\"></div>\n\n    <div id=\"qmi\"></div>\n\n    <div id=\"methodology\"></div>\n\n    <div id=\"topics\"></div>\n\n    <div id=\"filterable-dataset\"></div>\n\n    <div id=\"alert\"></div>\n\n    <div id=\"link\"></div>\n\n  </div>\n\n  <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "  </nav>\n\n</section>\n";
},"usePartial":true,"useData":true});
templates['workEditT8VersionList'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"correction-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" correction-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\"></div>\n          <input id=\"correction-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\" class=\"hasDateTimePicker\"/>\n          <textarea style=\"display: none;\" id=\"correction-markdown_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(alias4((depth0 != null ? depth0.correctionNotice : depth0), depth0))
    + "</textarea>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit label</button>\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"correction-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit notice</button>\n            <button class=\"btn btn--warning btn-page-delete\" id=\"correction-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.idField || (depth0 != null ? depth0.idField : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idField","hash":{},"data":data}) : helper)))
    + "-section\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.type : depth0),{"name":"unless","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "        <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n          <div id=\"version-edition_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" version-url=\""
    + alias3(alias4((depth0 != null ? depth0.uri : depth0), depth0))
    + "\"></div>\n          <input id=\"version-date_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" type=\"text\" placeholder=\"Day month year\"\n                 value=\""
    + alias3(alias4((depth0 != null ? depth0.updateDate : depth0), depth0))
    + "\" class=\"hasDateTimePicker\"/>\n          <div class=\"edit-section__buttons\">\n            <button class=\"btn btn--primary btn-markdown-edit\" id=\"version-edit-label_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit label</button>\n            <button class=\"btn btn--warning btn-page-delete\" id=\"version-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n          </div>\n        </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.correction : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});
templates['workEditTables'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <div id=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__sortable-item\">\n                    <div class=\"edit-section__title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n                    <input class=\"copy-markdown-target\" style=\"position:absolute;left:-99999px;\" value=\"&lt;ons-table"
    + ((stack1 = (helpers.if_eq || (depth0 && depth0.if_eq) || alias1).call(depth0,(depth0 != null ? depth0.version : depth0),"2",{"name":"if_eq","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " path=&#34;"
    + alias3(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"filename","hash":{},"data":data}) : helper)))
    + "&#34; /&gt;\">\n                    <div class=\"edit-section__buttons\">\n                        <button class=\"btn btn-markdown-edit copy-markdown\">\n                            Copy\n                            <div class=\"tick-animation\">\n                                <div class=\"tick-animation-trigger\"></div>\n                                <svg version=\"1.1\" id=\"tick\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 37 37\" style=\"enable-background:new 0 0 37 37;\" xml:space=\"preserve\">\n                                    <path class=\"circ path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" d=\"\n                                        M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z\"\n                                        />\n                                    <polyline class=\"tick path\" style=\"fill:none;stroke:#F5F6F7;stroke-width:3;stroke-linejoin:round;stroke-miterlimit:10;\" points=\"\n                                        11.6,20 15.9,24.2 26.4,13.8 \"/>\n                                </svg>\n                            </div>\n                        </button>\n                        <button class=\"btn btn--primary btn-markdown-edit\" id=\"table-edit_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Edit</button>\n                        <button class=\"btn btn--warning btn-page-delete\" id=\"table-delete_"
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">Delete</button>\n                    </div>\n                </div>\n";
},"2":function(depth0,helpers,partials,data) {
    return "-v2";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"edit-section\" id=\"tables\">\n    <div class=\"edit-section__head\">\n        <h1>Tables</h1>\n\n        <p>Edit existing tables</p>\n    </div>\n    <div id=\"table-list\" class=\"edit-section__content\">\n        <div id=\"sortable-table\" class=\"edit-section__sortable\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.tables : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"text-center\">\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-table\">Add table</button>\n            <button class=\"btn btn--subtle btn-add-section\" id=\"add-table-v2\">Add table (new)</button>\n        </div>\n    </div>\n</div>";
},"useData":true});
templates['workEditVisualisation'] = template({"1":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda((depth0 != null ? depth0.zipTitle : depth0), depth0));
},"3":function(depth0,helpers,partials,data) {
    return "No file uploaded";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<section class=\"panel workspace-edit\">\n    <div class=\"edit-accordion\">\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Metadata</h1>\n\n                <p id=\"metadata-d\">Title | Unique ID</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"metadata-list\">\n                    <label for=\"title\">Title\n                        <textarea class=\"auto-size\" type=\"text\" disabled id=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.description : depth0)) != null ? stack1.title : stack1), depth0))
    + "</textarea>\n                    </label>\n                    <label for=\"uid\">\n                        Unique ID\n                        <textarea name=\"uid\" id=\"uid\" disabled>"
    + alias2(alias1((depth0 != null ? depth0.uid : depth0), depth0))
    + "</textarea>\n                    </label>\n                </div>\n            </div>\n        </div>\n\n        <div class=\"edit-section\">\n            <div class=\"edit-section__head\">\n                <h1>Visualisation</h1>\n                <p>File upload</p>\n            </div>\n            <div class=\"edit-section__content\">\n                <div id=\"visualisation\">\n                        <form id=\"upload-vis\">\n                            <label class=\"input__file\" for=\"input-vis\" data-file-title=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.zipTitle : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" >Upload ZIP\n                                <input type=\"file\" name=\"input-vis\" id=\"input-vis\" accept=\".zip\">\n                            </label>\n                            <!--<button class=\"btn btn--primary btn--inline-block\" type=\"submit\" value=\"upload-vis\">Submit</button>-->\n                        </form>\n                </div>\n            </div>\n        </div>\n\n    </div>\n    <nav class=\"edit-nav\">\n"
    + ((stack1 = this.invokePartial(partials.editNav,depth0,{"name":"editNav","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </nav>\n</section>";
},"usePartial":true,"useData":true});
templates['workImport'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<section class=\"panel workspace-create\">\n  <h1>Import</h1>\n  <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.lastIndex || (depth0 != null ? depth0.lastIndex : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"lastIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"edit-section__item\">\n    <form id=\"UploadForm\">\n      <input type=\"file\" title=\"Select a file and click Submit\" name=\"files\">\n      <br>\n      <button type=\"submit\" form=\"UploadForm\" value=\"submit\">Submit</button>\n      <button class=\"btn btn-page-cancel\" id=\"file-cancel\">Cancel</button>\n    </form>\n    <div id=\"response\"></div>\n    <ul id=\"list\"></ul>\n  </div>\n</section>\n";
},"useData":true});
templates['workSpace'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<nav class=\"panel col col--1 nav nav--workspace js-workspace-nav\">\n    <ul class=\"nav__list nav__list--workspace\">\n        <!--<div id=\"nav--workspace__welsh\" style=\"margin-top: 20px;\"></div>-->\n        <!--<br/>-->\n        <li class=\"nav__item nav__item--workspace nav__item--lang js-workspace-nav__item\" id=\"nav--workspace__welsh\"></li>\n        <li class=\"nav__item nav__item--workspace nav__item--browse js-workspace-nav__item selected\" id=\"browse\"><a class=\"nav__link\" href=\"javascript:void(0)\">Browse</a>\n        </li>\n        <li class=\"nav__item nav__item--workspace nav__item--create js-workspace-nav__item\" id=\"create\"><a class=\"nav__link\" href=\"javascript:void(0)\">Create</a>\n        </li>\n        <li class=\"nav__item nav__item--workspace nav__item--edit js-workspace-nav__item\" id=\"edit\"><a class=\"nav__link\" href=\"javascript:void(0)\">Edit</a></li>\n    </ul>\n</nav>\n<div class=\"panel col col--4 workspace-menu\" id=\"browse-tree\">\n"
    + ((stack1 = this.invokePartial(partials.loadingAnimation,depth0,{"name":"loadingAnimation","hash":{"large":true},"data":data,"indent":"    ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "</div>\n<section class=\"panel col col--7 workspace-browser\">\n    <div class=\"browser\">\n        <div class=\"addressbar\">\n            <button class=\"btn browser-btn-back\">&lt;</button>\n            <button class=\"btn browser-btn-forward\">&gt;</button>\n            <label for=\"browser-location\" class=\"browser-location-label\">Preview URL</label>\n            <input id=\"browser-location\" class=\"browser-location\" type=\"text\" value=\"\">\n            <div class=\"browser-location__select select-wrap select-wrap--browser\" id='select-vis-wrapper'>\n                <select id='select-vis-preview'></select>\n            </div>\n            <button class=\"btn browser-btn-mobile\">Mobile</button>\n        </div>\n        <div class=\"browser__iframe\">\n            <iframe id=\"iframe\" name=\"preview\" src=\""
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\">\n"
    + ((stack1 = this.invokePartial(partials.loadingAnimation,depth0,{"name":"loadingAnimation","hash":{"large":true},"data":data,"indent":"                ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "            </iframe>\n        </div>\n    </div>\n</section>\n";
},"usePartial":true,"useData":true});
})();