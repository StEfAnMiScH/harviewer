/* See license.txt for terms of usage */

/**
 * @module tabs/aboutTab
 */
define("tabs/aboutTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "text!tabs/aboutTab.html"
],

function(Domplate, TabView, Lib, Strings, AboutTabHtml) { with (Domplate) {

//*************************************************************************************************
// Home Tab

/**
 * @constructor module:tabs/aboutTab
 */
function AboutTab() {}
AboutTab.prototype =
{
    id: "About",
    label: Strings.aboutTabLabel,

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    bodyTag:
        DIV({"class": "aboutBody"}),

    onUpdateBody: function(tabView, body)
    {
        var self = this;
        body = this.bodyTag.replace({}, body);
        body.innerHTML = AboutTabHtml;
        $(".linkSchema").click(Lib.bind(self.onSchema, self));
    },

    onSchema: function()
    {
        this.tabView.selectTabByName("Schema");
    }
};

return AboutTab;

//*************************************************************************************************
}});
