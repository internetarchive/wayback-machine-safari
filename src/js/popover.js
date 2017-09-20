/**
 * @fileOverview This file provides for the menu that pops over when
 * you click on the Wayback Machine icon in the browser Safari.
 */
window.onload = function(){
    initComponent();
    initEventHandler();
}

function _onSave() {
    safari.extension.globalPage.contentWindow._onSave();
}

function _onRecent() {
    safari.extension.globalPage.contentWindow._onRecent();
}

function _onFirst() {
    safari.extension.globalPage.contentWindow._onFirst();
}

function _onOverview() {
    safari.extension.globalPage.contentWindow._onOverview();
}

function _onAlexa() {
    safari.extension.globalPage.contentWindow._onAlexa();
}

function _onWhois() {
    safari.extension.globalPage.contentWindow._onWhois();
}

function _onTweets() {
    safari.extension.globalPage.contentWindow._onTweets();
}

function _onRadial() {
    safari.extension.globalPage.contentWindow._onRadial();
}

function _onFacebook() {
    safari.extension.globalPage.contentWindow._onFacebook();
}

function _onTwitter() {
    safari.extension.globalPage.contentWindow._onTwitter();
}

function _onGooglePlus() {
    safari.extension.globalPage.contentWindow._onGooglePlus();
}

function _onLinkedin() {
    safari.extension.globalPage.contentWindow._onLinkedin();
}

function _onAbout() {
    safari.extension.globalPage.contentWindow._onAbout();
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





