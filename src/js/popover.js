/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Wayback Machine icon in the browser Safari.
 */
window.onload = function(){
    initComponent();
    initEventHandler();
}

function _onSave() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onSave(getURL());
    }
}

function _onRecent() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onRecent(getURL());
    }
}

function _onFirst() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onFirst(getURL());
    }
}

function _onOverview() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onOverview(getURL());
    }
}

function _onAlexa() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onAlexa(getURL());
    }
}

function _onWhois() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onWhois(getURL());
    }
}

function _onTweets() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onTweets(getURL());
    }
}

function _onRadial() {
    safari.extension.globalPage.contentWindow._onRadial(getURL());
}

function _onFacebook() {
    if (!getURL()) {
        showMessage("Please type a URL");
    } else {
        safari.extension.globalPage.contentWindow._onFacebook(getURL());
    }
}

function _onTwitter() {
    safari.extension.globalPage.contentWindow._onTwitter(getURL());
}

function _onGooglePlus() {
    safari.extension.globalPage.contentWindow._onGooglePlus(getURL());
}

function _onLinkedin() {
    safari.extension.globalPage.contentWindow._onLinkedin(getURL());
}

function _onAbout() {
    // safari.extension.globalPage.contentWindow._onAbout();
    window.open("", "", "width=1000, height=1000");
}

function _onSetting() {
    safari.extension.globalPage.contentWindow._onSetting();
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
}

function initComponent() {
    // for Search Input
    $("#search_term").typeahead({
        source          :["item1","item2","item3"],
        fitToElement    : true,
        items           : 5,
        showHintOnFocus : false,
    });

    // Switchery for Auto Save
    // var elem = document.getElementById("chk_auto_save");
    // var switchery = new Switchery(elem, { size: 'small' });
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

/**
 * Helper function for activateExtension() and deactivateExtension().
 *
 * @param {node} toShow The element that needs to be shown
 * @param {node} toHide The element that needs to be hidden
 */
function extensionStateChange(toShow, toHide) {
    
    /* istanbul ignore if */
    if (typeof safari !== "undefined" && safari.extension !== undefined) {
        safari.extension.globalPage.contentWindow.modalButton.modeChange();
    }

    // Update the UI
    $(toShow).show();
    $(toHide).hide();
}





