/* See license.txt for terms of usage */

/**
 * @module tabs/homeTab
 */
define("tabs/homeTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "core/trace",
    "i18n!nls/homeTab",
    "text!tabs/homeTab.html",
    "preview/harModel",
    "dnd"
],

function(Domplate, TabView, Lib, Trace, Strings, HomeTabHtml, HarModel, dnd) { with (Domplate) {

var FILE_READ_OPTIONS = {
    type: 'openFile',
    accepts: [
        { extensions: ['har'] }
    ]
};

//*************************************************************************************************
// Home Tab

/**
 * @constructor module:tabs/homeTab
 */
function HomeTab() {}
HomeTab.prototype = Lib.extend(TabView.Tab.prototype,
/** @lends HomeTab.prototype */
{
    id: "Home",
    label: Strings.homeTabLabel,

    bodyTag:
        DIV({"class": "homeBody"}),

    onUpdateBody: function(tabView, body)
    {
        body = this.bodyTag.replace({}, body);

        // Content of this tab is loaded by default (required above) since it's
        // the first thing displayed to the user anyway.
        // Also let's search and replace some constants in the template.
        body.innerHTML = HomeTabHtml.replace("http://www.softwareishard.com/blog/har-12-spec/", tabView.harSpecURL, "g");

        // Register click handlers.
        $("#appendPreview").click(Lib.bindFixed(this.onAppendPreview, this));
        $(".linkAbout").click(Lib.bind(this.onAbout, this));

        var dragOverlay = document.getElementById('file-drop-overlay');

        function dragEnter(event) {
            dragOverlay.style.height = '100%';
        }

        function dragLeave(event) {
            dragOverlay.style.height = null;
        }

        // Registers drag-and-drop event handlers. These will be responsible for
        // auto-loading all dropped HAR files.
        dnd('#home-tab', this.handleDrop.bind(this), dragEnter, dragLeave);
        
        document.getElementById('select-file').addEventListener('change', function (event) {
            var fileProcessed = this.handleDrop(event.target);
            if(fileProcessed) {
                setTimeout(function() {
                    event.target.value = '';
                }, 500);
            }
        }.bind(this));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onAppendPreview: function(jsonString)
    {
        if (!jsonString)
            jsonString = $("#sourceEditor").val();

        if (jsonString)
            this.tabView.appendPreview(jsonString);
    },

    onAbout: function()
    {
        this.tabView.selectTabByName("About");
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    onDrop: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(e);

        try
        {
            this.handleDrop(event.originalEvent.dataTransfer);
        }
        catch (err)
        {
            Trace.exception("HomeTab.onDrop EXCEPTION", err);
        }
    },

    handleDrop: function(dataTransfer)
    {
        if (!dataTransfer) {
            return false;
        }

        var files = dataTransfer.files;
        if (!files) {
            return false;
        }

        var file = files[0];
        var ext = Lib.getFileExtension(file.name);
        if (ext.toLowerCase() != "har") {
            return false;
        }

        var self = this;
        var reader = this.getFileReader(file, function(text) {
            if (text) {
                self.onAppendPreview(text);
            }
        });
        reader();
        
        return true;
    },

    /**
     * File reader callback.
     *
     * @callback fileReaderCallback
     * @param {String} contents
     *  file contents
     */

     /**
     * @param {Object} file
     *  The file to get the text for.
     * @param {fileReaderCallback} callback
     *  Callback to receive the file contents.
     */
    getFileReader: function(file, callback)
    {
        return function fileReader()
        {
            if (typeof(file.getAsText) != "undefined")
            {
                callback(file.getAsText(""));
                return;
            }

            if (typeof(FileReader) != "undefined")
            {
                var fileReader = new FileReader();
                fileReader.onloadend = function() {
                    callback(fileReader.result);
                };
                fileReader.readAsText(file);
            }
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    loadInProgress: function(show, msg)
    {
        $("#sourceEditor").val(show ? (msg ? msg : Strings.loadingHar) : "");
    }
});

return HomeTab;

//*************************************************************************************************
}});
