/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Wayback Machine icon in the browser Safari.
 */
const global = safari.extension.globalPage.contentWindow;
var bloodhound, typeahead;

window.onload = function(){
    initComponent();
    initEventHandler();
}

function _onSave() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onSave(getURL());
    }
}

function _onRecent() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onRecent(getURL());
    }
}

function _onFirst() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onFirst(getURL());
    }
}

function _onOverview() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onOverview(getURL());
    }
}

function _onAlexa() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onAlexa(getURL());
    }
}

function _onWhois() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onWhois(getURL());
    }
}

function _onTweets() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onTweets(getURL());
    }
}

function _onRadial() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onRadial(getURL());
    }
}

function _onFacebook() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onFacebook(getURL());
    }
}

function _onTwitter() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onTwitter(getURL());
    }
}

function _onGooglePlus() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onGooglePlus(getURL());
    }
}

function _onLinkedin() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        global._onLinkedin(getURL());
    }
}

function _onAbout() {
    document.getElementById("main_container").style.display = "none";
    document.getElementById("about_container").style.display = "block";
}

function _onBack() {
    document.getElementById("main_container").style.display = "block";
    document.getElementById("about_container").style.display = "none";
}

function _onSetting() {
    document.getElementById("main_container").style.display = "none";
    document.getElementById("setting_container").style.display = "block";
}

function _onSaveSetting() {
    document.getElementById("main_container").style.display = "block";
    document.getElementById("setting_container").style.display = "none";
}

function _onSearch(evt) {
    if (evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40 || evt.keyCode == 13) return true;

    if (!$(".tt-menu").hasClass("tt-empty")) {
        $(".tt-menu").addClass("tt-empty");
    }
    $(".tt-menu").css("display", "none");

    var keyword = getSearchTerm();

    if (keyword.length < 3) return true;
    
    global._onSearch(keyword, function(suggestions){
        $(".tt-dataset.tt-dataset-0").empty();

        if (suggestions.length == 0) return;

        $(".tt-menu").css("display", "block");
        $(".tt-menu").removeClass("tt-empty");

        suggestions.forEach(function(url, index){
            var item = document.createElement("div");
            item.setAttribute("class","tt-suggestion tt-selectable");
            item.innerHTML = url;
            item.onclick = function(){
                $("#search_term").val(url);
                $(".tt-menu").css("display", "none");
            }

            $(".tt-dataset.tt-dataset-0").append(item);
        });
    });
}

function initEventHandler() {
    document.getElementById("btn_save").onclick         = _onSave;
    document.getElementById("btn_recent").onclick       = _onRecent;
    document.getElementById("btn_first").onclick        = _onFirst;
    document.getElementById("btn_overview").onclick     = _onOverview;
    document.getElementById("btn_alexa").onclick        = _onAlexa;
    document.getElementById("btn_whois").onclick        = _onWhois;
    document.getElementById("btn_tweets").onclick       = _onTweets;
    document.getElementById("btn_radial").onclick       = _onRadial;
    document.getElementById("btn_facebook").onclick     = _onFacebook;
    document.getElementById("btn_twitter").onclick      = _onTwitter;
    document.getElementById("btn_google").onclick       = _onGooglePlus;
    document.getElementById("btn_linkedin").onclick     = _onLinkedin;
    document.getElementById("btn_about").onclick        = _onAbout;
    document.getElementById("btn_setting").onclick      = _onSetting;
    document.getElementById("btn_about_back").onclick   = _onBack;
    document.getElementById("btn_setting_save").onclick = _onSaveSetting;
    document.getElementById("search_term").onkeyup      = _onSearch;
}

function initComponent() {
    //Typeahead for Search Input 
    bloodhound = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("url"),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });
    
    typeahead = $("#search_term").typeahead({
        hint: true,
        minLength: 3
    }, {
        displayKey: "url",
        source: bloodhound
    });

    //Switchery for Auto Save
    var elem = document.getElementById("chk_auto_save");
    var switchery = new Switchery(elem, { size: 'small' });
}

function getURL() {
    var url = null;
    if (getSearchTerm() == "") {
        url = getActiveURL();
    } else {
        url = getSearchTerm();
    }
    return url;
}

function getSearchTerm() {
    return document.getElementById("search_term").value; 
}

function getActiveURL() {
    return safari.application.activeBrowserWindow.activeTab.url;
}

function showMessage(message) {
    alert(message);
}







