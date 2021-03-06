﻿var dPlugin = {

    version: "1.0",

    classIds: {
        java: "8AD9C840-044E-11D1-B3E9-00805F499D93",
        javaBean: "8AD9C840-044E-11D1-B3E9-00805F499D93",
        quicktime: "02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",
        flash: "D27CDB6E-AE6D-11CF-96B8-444553540000",
        silverlight: "32C73088-76AE-40F7-AC40-81F62CB2C1DA",
        mediaPlayer: "22D6F312-B0F6-11D0-94AB-0080C74C7E95", // "6BF52A52-394A-11D3-B153-00C04F79FAA6",
        pdf: "CA8A9780-280D-11CF-A24D-444553540000"
    },

    activeXNames: {
        java: 'JavaPlugin',
        javaBean: 'JavaPlugin',
        flash: 'ShockwaveFlash.ShockwaveFlash',
        silverlight: 'AgControl.AgControl',
        mediaPlayer: 'WMPlayer.ocx',
        quicktime: 'QuickTimeCheckObject.QuickTimeCheck.1', // This ActiveX control is needed for IE to play QuickTime movies
        pdf: ['AcroPDF.PDF.1', 'PDF.PdfCtrl.5']
    },

    versionOffsets: { // used for IE only
        java: [1, 7, 3, 17] // must be maintained manually - the first and the second are the major version, the third the minor version and the fourth the patch version
    },

    // if not allowed, neither the existence nor the version of the plugin will be detected (applies for IE only) - only specify true for ActiveX controls pre-approved by Microsoft
    allowedActiveXNames: {
        flash: true,
        silverlight: true,
        mediaPlayer: true,
        quicktime: false, // is set to false since IE (6 and 7) may prompt the user to allow execution of this ActiveXObject - not pre-approved
        java: true,
        javaBean: true,
        pdf: true
    },

    pluginNames: {
        java: 'Java ', // must end with a space to prevent clashing with the word JavaScript
        javaBean: 'Java ',
        flash: 'Shockwave Flash',
        silverlight: 'Silverlight',
        quicktime: 'QuickTime',
        mediaPlayer: 'Windows Media Player',
        pdf: 'Adobe Acrobat'
    },

    mimeTypes: {
        java: 'application/x-java-applet',
        javaBean: 'application/x-java-bean',
        flash: 'application/x-shockwave-flash',
        silverlight: 'application/x-silverlight',
        mediaPlayer: 'application/x-mplayer2',
        quicktime: 'video/quicktime',
        pdf: 'application/pdf'
    },

    // important not to specify the protocol in the URL's, otherwise IE may prompt the user for confirmation to view mixed content
    downloadUrls: {
        java: '//java.com/download/',
        javaBean: '//java.com/download/',
        flash: '//www.adobe.com/go/getflashplayer',
        quicktime: '//www.apple.com/quicktime/download/',
        silverlight: '//www.microsoft.com/silverlight/downloads.aspx',
        mediaPlayer: '//www.microsoft.com/windows/windowsmedia/download/AllDownloads.aspx',
        pdf: '//www.adobe.com/products/acrobat/readstep2.html'
    },
    
    hasPluginCache: {},

    getPluginVersionCache: {},

    pluginNotSupportedClass: "PluginNotSupported",

    // must be called before calling any other function
    detectBrowser: function() {
        var vendor = (typeof navigator.vendor == "string") ? navigator.vendor.toLowerCase() : "";
        this.isLikeSafari = (vendor.indexOf("apple") > -1); // is true in Shiira too
        this.isLikeSafari3 = this.isLikeSafari && (typeof [].forEach == "function" && [].forEach.toString().toLowerCase().indexOf("native") > -1); // Safari 3 supports JavaScript1.7 in which Array.prototype.forEach is defined - this property is true in Shiira too
        this.isLikeSafari_2 = this.isLikeSafari && !this.isLikeSafari3; // is less than or equal to a Safari2 like browser
        this.isOpera = !!window.opera;
        this.isOpera9 = this.isOpera && typeof XPathResult != "undefined"; // is Opera 9 or higher
        this.isOpera95 = this.isOpera9 && typeof navigator.onLine == "boolean";
        this.isOpera_9 = this.isOpera && !this.isOpera95;
        //this.isIE = !!window.ActiveXObject && !!window.showModalDialog && !!document.all && !this.isOpera;
        this.isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
        this.isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
    },

    // returns -1 if the first argument is the lowest, 1 if the last is the lowest, 0 otherwise.
    compareVersions: function(v1, v2) {
        if (typeof v1 == "string" && typeof v2 == "string" && v1 != v2) {
            var re = /\.|_|,|-/;
            var arr1 = v1.split(re);
            var arr2 = v2.split(re);
            for (var i = 0, l = Math.max(arr1.length, arr2.length); i < l; i++) {
                var s1 = (i in arr1) ? arr1[i] : '0';
                var s2 = (i in arr2) ? arr2[i] : '0';
                var n1 = Number(s1);
                var n2 = Number(s2);
                if (isNaN(n1) || isNaN(n2)) {
                    if (s1 < s2) {
                        return -1;
                    }
                    else if (s1 > s2) {
                        return 1;
                    }
                } else {
                    if (n1 < n2) {
                        return -1;
                    }
                    else if (n1 > n2) {
                        return 1;
                    }
                }
            }
        }
        return 0;
    },

    // Returns the value of the PARAM tag with the given name as a string. If a PARAM tag with the given name doesn't exist, the empty string is returned.
    getParameter: function(obj, name) {
        if (obj && name) {
            var children = obj.childNodes;
            /*	No good to use plugin.getElementsByTagName in IE due to a bug.
            plugin.getElementsByTagName returns all tags in the entire document with the specified name!
            Not just those in the plugin tag.	*/
            for (var j = 0, ln = children.length; j < ln; j++) {
                var child = children[j];
                if (child.nodeType == 1 && child.tagName.toLowerCase() == 'param') {
                    var n = child.getAttribute("name");
                    if (n == name) {
                        return child.getAttribute("value");
                    }
                }
            }
        }
        return "";
    },

    insertSilverlightPlugin: function(id) { // this causes Safari 3.1.1 on Mac to alert the user if the Silverlight plugin is not installed - this may be the case in Safari on Windows too?
        if (document.getElementsByTagName("body").length > 0) {
            id = id || "obj_silverlight_" + new Date().getTime();
            // see http://www.ietf.org/rfc/rfc2397.txt for details about the data protocol (data:,)
            var htm = '<object id="' + id + '" type="' + this.mimeTypes["silverlight"] + '" data="data:," width="0" height="0"><\/object>';
            document.write(htm);
            return id;
        }
        return "";
    },

    detectPluginType: function(obj) {
        var key = '';
        if (obj) {
            if (this.isIE && obj.getAttribute("classid")) {
                var classId = obj.getAttribute("classid").toLowerCase();
                var idx = classId.indexOf("clsid:");
                classId = (idx > -1) ? classId.substring(idx + 6) : classId;
                for (var p in this.classIds) {
                    if (this.classIds[p].toLowerCase() == classId) {
                        key = p;
                        break;
                    }
                }
            }
            if (!key && obj.getAttribute("type")) {
                var type = obj.getAttribute("type");
                for (var p in this.mimeTypes) {
                    if (type.indexOf(this.mimeTypes[p]) == 0) {
                        key = p;
                        break;
                    }
                }
            }
        }
        return key;
    },

    getActiveXNames: function(key) {
        if (key in this.allowedActiveXNames && this.allowedActiveXNames[key]) {
            return this.activeXNames[key];
        }
        return '';
    },

    /*	This method is useful if getPluginVersionByName and getPluginVersionByMimeType returns '0'.
    If the version is '0' does not necessarily means that the required plugin isn't supported by the browser.
    As an example the Java version for Safari on Windows is '0' even when a Java Plugin is present.
    It is impossible to detect the Java version (without an applet) in Safari, regardless which version of the Sun Java Plugin is installed.	*/
    hasPluginByName: function(pluginName) {
        if (pluginName && navigator.plugins) {
            for (var j = 0, len = navigator.plugins.length; j < len; j++) {
                var plugin = navigator.plugins[j];
                if (typeof plugin.name == "string" && plugin.name.indexOf(pluginName) > -1) {
                    return true;
                }
                if (typeof plugin.description == "string" && plugin.description.indexOf(pluginName) > -1) {
                    return true;
                }
            }
        }
        return false;
    },

    /*	The argument is case-sensitive!	Use one of the mimeTypes properties as argument. */
    supportsMimeType: function(mimeType, mustBeEnabled) {
        if (typeof mustBeEnabled != "boolean") {
            mustBeEnabled = true;
        }
        if (mimeType && navigator.mimeTypes) {
            for (var j = 0, l = navigator.mimeTypes.length; j < l; j++) {
                var mType = navigator.mimeTypes[j];
                if (typeof mType.type == "string" && mType.type.toLowerCase().indexOf(mimeType) > -1 && (!mustBeEnabled || mType.enabledPlugin)) {
                    return true;
                }
            }
        }
        return false;
    },

    getFlashVersion: function() {
        function ControlVersion() { // From Adobe toolkit
            var version; var axo; var e;
            try {
                axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                version = axo.GetVariable("$version");
            } catch (e) { }
            if (!version) {
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    version = "WIN 6,0,21,0";
                    axo.AllowScriptAccess = "always";
                    version = axo.GetVariable("$version");
                } catch (e) { }
            } if (!version) {
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = axo.GetVariable("$version");
                } catch (e) { }
            } if (!version) {
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
                    version = "WIN 3,0,18,0";
                } catch (e) { }
            } if (!version) {
                try {
                    axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    version = "WIN 2,0,0,11";
                } catch (e) { version = -1; }
            } return version;
        }
        function GetSwfVer() { // From Adobe toolkit
            var isOpera = !!window.opera;
            var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
            var flashVer = -1;
            if (navigator.plugins != null && navigator.plugins.length > 0) {
                if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
                    var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
                    var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
                    var descArray = flashDescription.split(" ");
                    var tempArrayMajor = descArray[2].split(".");
                    var versionMajor = tempArrayMajor[0];
                    var versionMinor = tempArrayMajor[1];
                    var versionRevision = descArray[3];
                    if (versionRevision == "") { versionRevision = descArray[4]; }
                    if (versionRevision[0] == "d") {
                        versionRevision = versionRevision.substring(1);
                    } else if (versionRevision[0] == "r") {
                        versionRevision = versionRevision.substring(1);
                        if (versionRevision.indexOf("d") > 0) {
                            versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                        }
                    }
                    var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
                }
            }
            else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
            else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
            else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
            if (isIE && !isOpera) {
                flashVer = ControlVersion();
            }
            return flashVer;
        }
        var versionStr = GetSwfVer();
        if (versionStr == -1) {
            return -1;
        } else if (versionStr != 0) {
            if (this.isIE && !this.isOpera) {
                tempArray = versionStr.split(" ");
                tempString = tempArray[1];
                versionArray = tempString.split(",");
            } else {
                versionArray = versionStr.split(".");
            }
            var versionMajor = versionArray[0];
            var versionMinor = versionArray[1];
            var versionRevision = versionArray[2];

            return versionMajor + '.' + versionMinor;
        }
    },

    hasPluginByMimeType: function(mimeType, mustBeEnabled) {
        return this.supportsMimeType(mimeType, mustBeEnabled);
    },

    hasPlugin: function(key) {
        if (key in this.hasPluginCache) {
            return this.hasPluginCache[key];
        }
        var hasPlugin = this.hasPluginByMimeType(this.mimeTypes[key]) || this.hasPluginByName(this.pluginNames[key]) || (this.getPluginVersion(key) != "0");
        if (!hasPlugin) { // exceptions
            switch (key) {
                case "javaBean":
                case "java":
                    /*	In IE: if the APPLET tag is disabled, navigator.javaEnabled() will return false, but using the OBJECT tag to embed your applet will still work!
                    But if disabling ActiveX components in IE the OBJECT tag will not work for any type of plugin.	*/
                    hasPlugin = (typeof navigator.javaEnabled != "undefined") ? navigator.javaEnabled() : false; // typeof navigator.javaEnabled is 'unknown' in IE7, not 'function'!?!?
                    break;
                case "pdf":
                    if (this.isIE) {
                        var names = this.getActiveXNames(key);
                        for (var i = 0, l = names.length; i < l; i++) {
                            try {
                                hasPlugin = (new ActiveXObject(names[i]) != null);
                            }
                            catch (ex) {
                            }
                        }
                    }
                    break;
                case "mediaPlayer":
                case "flash":
                    hasPlugin = this.getFlashVersion() != -1;
                    break;
                case "quicktime":
                    if (window.ActiveXObject) {
                        try {
                            hasPlugin = (new ActiveXObject(this.getActiveXNames(key)) != null);
                        }
                        catch (ex) {
                        }
                    }
                    break;
                case "silverlight":
                default:
                    break;
            }

        }
        this.hasPluginCache[key] = hasPlugin;
        return hasPlugin;
    },

    getPluginVersionByMimeType: function(mimeType) {
        var version = '0';
        if (mimeType && navigator.mimeTypes) {
            var regExp = new RegExp("=[0-9]{1,}((\.|,|_)[0-9]{1,}){0,}");
            for (var j = 0, l = navigator.mimeTypes.length; j < l; j++) {
                var found = null;
                var mType = navigator.mimeTypes[j];
                if (typeof mType.type == "string" && mType.type.indexOf(mimeType) > -1 && mType.enabledPlugin) {
                    found = mType.type.match(regExp);
                    if (found && found.length > 0) {
                        var v = found[0].substring(1);
                        if (v > version) {
                            version = v;
                        }
                    }
                }
            }
        }
        return version;
    },

    getPluginVersionByName: function(pluginName) {
        var version = '0';
        if (pluginName && navigator.plugins) {
            var regExp = /[0-9]{1,}((\.|,|_)[0-9]{1,}){0,}/;
            for (var j = 0, len = navigator.plugins.length; j < len; j++) {
                var found = null;
                var plugin = navigator.plugins[j];
                if (typeof plugin.name == "string" && plugin.name.indexOf(pluginName) > -1) {
                    found = plugin.name.match(regExp);
                    if (found && found.length > 0) {
                        if (found[0] > version) {
                            version = found[0];
                        }
                    }
                }
                found = null;
                if (typeof plugin.description == "string" && (plugin.description.indexOf(pluginName) > -1 || plugin.name.indexOf(pluginName) > -1)) {
                    found = plugin.description.match(regExp);
                    if (found && found.length > 0) {
                        if (found[0] > version) {
                            version = found[0];
                            if (pluginName == this.pluginNames["flash"]) {
                                found = /r[0-9]{1,}$/.exec(plugin.description);
                                if (found) {
                                    version += found[0].replace("r", ".");
                                }
                            }
                        }
                    }
                }
            }
        }
        return version;
    },

    getPluginVersion: function(key) {
        if (key in this.getPluginVersionCache) {
            return this.getPluginVersionCache[key];
        }
        var vmt = this.getPluginVersionByMimeType(this.mimeTypes[key]);
        var vpn = this.getPluginVersionByName(this.pluginNames[key]);
        var version = "0";
        switch (key) {
            /*	Not all browsers supplies the version number in the Java mimeType.type property.
            Opera may not supply the mimetype, nor the plugin name, even though the newest Java Plugin (1.6.0_04 at the time of writing) is installed.	*/ 
            case "javaBean":
            case "java":
                try {
                    version = "" + java.lang.System.getProperty("java.version");
                }
                catch (ex) {
                    if (window.ActiveXObject) {
                        var name = this.getActiveXNames(key);
                        if (name) {
                            var vs = this.versionOffsets['java'];
                            outer:
                            for (var i = vs[0]; i > 0; i--) {
                                for (var j = vs[1]; j > 0; j--) {
                                    for (var k = vs[2]; k > -1; k--) {
                                        for (var l = vs[3]; l > 0; l--) {
                                            try {
                                                var s = (l < 10) ? "0" + l : "" + l;
                                                if ((new ActiveXObject(name + "." + i + "" + j + "" + k + "_" + s)) != null) {
                                                    version = i + "." + j + "." + k + "_" + s;
                                                    break outer;
                                                }
                                            }
                                            catch (iex) {
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case "pdf":
                if (window.ActiveXObject) {
                    var names = this.getActiveXNames(key);
                    for (var i = 0, l = names.length; i < l; i++) {
                        try {
                            var v = new ActiveXObject(names[i]).GetVersions().split(",")[1].split("=")[1];
                            if (v > version) {
                                version = v;
                            }
                        }
                        catch (ex) {
                        }
                    }
                }
                break;
            case "flash":
                version = this.getFlashVersion();
                break;
            case "silverlight":
                var nav = navigator.plugins["Silverlight Plug-In"];
                if (nav) {
                    for (var i = 0; i < 4; i++) {
                        version = nav.description;
                    }
                } else {//try the IE one now.
                    try {
                        function loopMatch(control, v, idx, inc) {
                            while (control.isVersionSupported(v[0] + "." + v[1] + "." + v[2] + "." + v[3])) {
                                v[idx] += inc;
                            }
                            v[idx] -= inc;
                        }
                        var control = new ActiveXObject('AgControl.AgControl');
                        //the following would be faster with a binary search, but this is "fast enough" for now. 
                        var vers = Array(1, 0, 0, 0);
                        loopMatch(control, vers, 0, 1);
                        loopMatch(control, vers, 1, 1);
                        loopMatch(control, vers, 2, 10000);
                        loopMatch(control, vers, 2, 1000);
                        loopMatch(control, vers, 2, 100);
                        loopMatch(control, vers, 2, 10);
                        loopMatch(control, vers, 2, 1);
                        loopMatch(control, vers, 3, 1);
                        version = vers.join('.');
                    } catch (e) {
                    }
                }
                break;
            case "mediaPlayer":
                if (window.ActiveXObject) {
                    try {
                        version = new ActiveXObject(this.getActiveXNames(key)).versionInfo;
                    }
                    catch (ex) {
                    }
                }
                break;
            default:
                break;
        }
        if (vmt > vpn) {
            vpn = vmt;
        }
        if (vpn > version) {
            version = vpn;
        }
        this.getPluginVersionCache[key] = version;
        return version;
    },

    /*	Convenience methods for detecting the most widely used plugins.	*/
    getJavaVersion: function() {
        return this.getPluginVersion("java");
    },

    getQuickTimeVersion: function() {
        return this.getPluginVersion("quicktime");
    },

    getSilverlightVersion: function() {
        return this.getPluginVersion("silverlight");
    },

    /** Methods for circumventing the EOLA patent */

    isEolaUsed: function(obj) {
        return this.isOpera9;
    },

    /**	If you don't wanna move the EOLA borders (and thereby force the user to click to activate the plugin), you
    can add a param tag called 'ignoreEola' with the value 'true'. Like this:
    <param name="ignoreEola" value="true" />
    The value will be converted to a boolean, so the number strings 0 and NaN will result in false, every other number string will result in true.
    The character value true will result in true, every other character string (including null, undefined, false and the empty string) will result in false.
    */
    ignoreEola: function(obj) {
        var ignore = false;
        var s = this.getParameter(obj, "ignoreEola"); // getParameter returns a string
        if (s) { // non-empty
            try {
                ignore = Boolean(eval(s));
            }
            catch (ex) {
            }
        }
        return ignore;
    },

    fixEola: function(obj) {
        if (obj && this.isEolaUsed() && this.doFixEola(obj)) {
            if (this.ignoreEola(obj)) {
                return;
            }
            var htm = obj.outerHTML.split('>')[0];
            htm += (htm.indexOf("style=") == -1) ? ' style="visibility:visible;">' : '>';
            /*	No good to use plugin.getElementsByTagName in IE due to a bug.
            plugin.getElementsByTagName returns all tags in the entire document with the specified name!
            Not just those in the plugin tag.	*/
            var children = obj.childNodes;
            /*	In Opera 9.1 a JavaScript error will occur if this Eola trick is used and JavaScript tries to call methods in the applet!
            Hence the following variable.	*/
            var detectScriptability = (this.isOpera && obj.type.indexOf(this.mimeTypes["java"]) == 0);
            for (var j = 0, ln = children.length; j < ln; j++) {
                var child = children[j];
                if (child.nodeType == 1 && child.tagName.toLowerCase() == 'param') {
                    if (detectScriptability) {
                        var n = child.getAttribute("name");
                        if (n.toLowerCase() == "scriptable" || n.toLowerCase() == "mayscript") {
                            obj.style.visibility = "visible";
                            return;
                        }
                    }
                    htm += child.outerHTML;
                }
            }
            htm += '<\/' + obj.tagName.toLowerCase() + '>';
            obj.outerHTML = htm;
        }
    },

    // override for customized behavior - must return a boolean
    doFixEola: function(obj) {
        return (this.detectPluginType(obj).indexOf("java") != 0); // Eola is not fixed for Java applets in Opera due to slow loading. Furthermore some versions of Opera throws an error if communicating with the applet via JavaScript.
    },

    /* DOM manipulating methods */
    getId: function(obj) {
        var id = obj.id;
        if (!id) {
            id = 'obj' + (new Date().getTime() * Math.random());
            id = id.replace(".", "");
        }
        return id;
    },

    getAltContent: function(obj, key) {
        var htm = '';
        if (obj) {
            htm += obj.innerHTML;
            var idx = htm.lastIndexOf("-->"); // necessary to remove possible conditional comments
            if (idx > -1) {
                htm = htm.substring(idx + 3);
            }
            htm = htm.replace(new RegExp("<param([^<>]){1,}>", "gi"), '');
            htm = htm.replace(/^[\s]{1,}/, '').replace(/[\s]{1,}$/, '');
            key = key || this.detectPluginType(obj);
            var id = this.getId(obj);
            var downloadUrl = this.getParameter(obj, "downloadUrl") || this.downloadUrls[key];
            if (downloadUrl && downloadUrl != "null" && htm.indexOf(downloadUrl) == -1) {
                var downloadText = this.getParameter(obj, "downloadText") || "Download Plugin";
                htm += '<p><a href="' + downloadUrl + '" onclick="return dPlugin.downloadPlugin(event, \'' + id + '\');">' + downloadText + '<\/a><\/p>';
            }
            var viewPluginLink = this.getParameter(obj, "viewPluginLink") || "View Plugin";
            // provide a link to the user in case our version detection wasn't right
            htm += '<p><a href="" onclick="return dPlugin.viewPlugin(event, \'' + id + '\');">' + viewPluginLink + '<\/a><\/p>';
        }
        return htm;
    },

    showAltContent: function(obj, key) {
        if (obj) {
            var otherMethod = this.getParameter(obj, "showAltContent");
            if (otherMethod && typeof window[otherMethod] == "function") {
                var quit = window[otherMethod].apply(window, [obj]);
                if (quit) {
                    obj.style.visibility = "visible";
                    return;
                }
            }
            var id = this.getId(obj);
            obj.id = id;
            obj.style.display = "none";
            // to set width and height to 0 seems to be necessary in Safari on Windows (3.0.4 - build 523.15) - setting display to 'none' doesn't work
            obj.style.height = "0";
            obj.style.width = "0";
            var div = document.createElement("div");
            div.id = "div_" + id;
            div.className = this.pluginNotSupportedClass;
            div.innerHTML = this.getAltContent(obj, key);
            obj.parentNode.insertBefore(div, obj);
        }
    },

    viewPlugin: function(e, objId) {
        e = e || window.event;
        if (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
        var obj = (objId) ? document.getElementById(objId) : null;
        if (obj) {
            var div = obj.previousSibling;
            div.style.display = "none";
            obj.style.visibility = "visible";
            obj.style.width = obj.getAttribute("width") + "px";
            obj.style.height = obj.getAttribute("height") + "px";
            obj.style.display = "inline";
            this.fixEola(obj);
        }
        return false;
    },

    /*	Override for customized behavior. Returning false will prevent the browser from following the downloadURL.	*/
    downloadPlugin: function(e, objId) {return true;},

    /*	Is called onload/onDOMContentLoaded. It traverses each OBJECT element and detects the kind of plugin. If detection is successful, it detects if the browser supports this kind of plugin.
    If it does, it detects if the markup indicates a required version of the plugin. If this is the case the version supported by the browser is detected.
    If detected, this version is compared with the required version. If version < required version, the alternative text inside the OBJECT element is copied and inserted in a DIV element
    which is inserted just before the OBJECT element and finally the OBJECT element is hidden.	*/
    checkPluginVersions: function() {
        if (dPlugin.hasRun) {
            return;
        }
        dPlugin.hasRun = true;
        try {
            var objectTags = document.getElementsByTagName('object'); // if IE doesn't support a certain kind of plugin, objectTags.length is 0!?!
            for (var i = 0, l = objectTags.length; i < l; i++) {
                var obj = objectTags[i];
                obj.style.visibility = "visible";
                this.currentObjectTag = obj;
                var key = this.detectPluginType(obj);
                var hasPlugin = this.hasPlugin(key);
                if (hasPlugin) {
                    var requiredVersion = "";
                    var children = obj.childNodes;
                    /*	No good to use plugin.getElementsByTagName in IE due to a bug.
                    obj.getElementsByTagName returns all tags in the entire document with the specified name!
                    Not just those in the OBJECT tag.	*/
                    for (var j = 0, ln = children.length; j < ln; j++) {
                        var child = children[j];
                        if (child.nodeType == 1 && child.tagName.toLowerCase() == "param" && child.getAttribute("name") == "requiredVersion") {
                            requiredVersion = child.getAttribute("value");
                            break;
                        }
                    }
                    if (!requiredVersion) { // try to read from the type attribute
                        var found = obj.type ? /version=/i.exec(obj.type) : null;
                        var index = found ? obj.type.indexOf(found[0]) : -1;
                        requiredVersion = (index > -1) ? obj.type.substring(index + found[0].length) : requiredVersion;
                    }
                    var version = this.getPluginVersion(key);
                    if (version != "0" && requiredVersion && this.compareVersions(version, requiredVersion) == -1) {
                        this.showAltContent(obj, key);
                    } else {
                        this.fixEola(obj);
                    }
                }
                this.currentObjectTag = null;
            }
        }
        catch (ex) {
            this.currentObjectTag = null;
        }
    },

    readyListener: function() {
        dPlugin.checkPluginVersions.apply(dPlugin);
    },

    addReadyListener: function() {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", dPlugin.readyListener, false);
        }
        else if (document.attachEvent) {
            document.attachEvent("onDOMContentLoaded", dPlugin.readyListener);
        }
        if (window.addEventListener) {
            window.addEventListener("load", dPlugin.readyListener, false);
        }
        else if (window.attachEvent) {
            window.attachEvent("onload", dPlugin.readyListener);
        }
    },

    removeReadyListener: function() {
        if (document.removeEventListener) {
            document.removeEventListener("DOMContentLoaded", dPlugin.readyListener, false);
        }
        else if (document.detachEvent) {
            document.detachEvent("onDOMContentLoaded", dPlugin.readyListener);
        }
        if (window.removeEventListener) {
            window.removeEventListener("load", dPlugin.readyListener, false);
        }
        else if (window.detachEvent) {
            window.detachEvent("onload", dPlugin.readyListener);
        }
    }

};

(function() {
	dPlugin.detectBrowser();
	if (!dPlugin.isIE) {
		var htm = '<style type="text/css">object { visibility: hidden; }<\/style>';
		document.write(htm); // this causes IE6+7 to hang when reloading page
	}
	dPlugin.addReadyListener();
})();