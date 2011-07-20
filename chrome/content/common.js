/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://procon/content/third_party/md5.js", common);

const common =
{
    updateButtonElements : function()
    {
        var Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        Prefs = Prefs.getBranch("extensions.procon.");
        var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
        var browserWindow = wm.getMostRecentWindow("navigator:browser");

        if (Prefs.getBoolPref("blacklist.enabled") || Prefs.getBoolPref("profanitylist.enabled"))
        {
            browserWindow.document.getElementById("procon-status-img").setAttribute("src", "chrome://procon/skin/images/security_small.png");
        }
        else
        {
            browserWindow.document.getElementById("procon-status-img").setAttribute("src", "chrome://procon/skin/images/security_small_gray.png");
        }

        browserWindow.document.getElementById("procon-status").hidden = !Prefs.getBoolPref("misc.showStatusButton");
        browserWindow.document.getElementById("procon-menu-button").hidden = !Prefs.getBoolPref("misc.showMenuButton");
    },

    authenticateUser : function()
    {
        var Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

        if (Prefs.prefHasUserValue("extensions.procon.general.password"))
        {
            var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
            var strings = document.getElementById("procon-strings");
            var password =
            {
                value : ""
            },
            check =
            {
                value : false
            }; //XXX: need to pass an object for the checkbox, even if hidden

            var password_result = prompts.promptPassword(null,
                strings.getString("passwordPromptTitle"),
                strings.getString("passwordPrompt"),
                password,
                null,
                check);

            if (!password_result)
                return false;

            if (hex_md5(password.value) != Prefs.getCharPref("extensions.procon.general.password"))
            {
                prompts.alert(null,
                    strings.getString("passwordPromptTitle"),
                    strings.getString("passwordPromptWrong"));
                return false;
            }
        }
        return true;
    }
};
